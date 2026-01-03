import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPool } from '../../../../lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// Validators
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request) {
  let client;
  try {
    const { name, email, password, password_confirmation } = await request.json();

    console.log('[REGISTER] Incoming request:', {
      name,
      email,
      hasPassword: !!password,
    });

    // Validation
    const errors = {};

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      errors.name = ['The name field is required.'];
    }

    if (!email || !validateEmail(email)) {
      errors.email = ['The email must be a valid email address.'];
    } else if (email.length > 255) {
      errors.email = ['The email must not be greater than 255 characters.'];
    }

    if (!password || password.length < 6) {
      errors.password = ['The password must be at least 6 characters.'];
    }

    if (password !== password_confirmation) {
      errors.password_confirmation = ['The password confirmation does not match.'];
    }

    if (Object.keys(errors).length > 0) {
      console.log('[REGISTER] Validation failed:', errors);
      return NextResponse.json({
        status: false,
        message: 'Validation failed',
        errors,
      }, { 
        status: 422,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Get DB connection from singleton pool
    const pool = getPool();
    client = await pool.connect();

    // Check if email already exists
    const existingUserResult = await client.query(
      'SELECT id FROM "User" WHERE email = $1',
      [email]
    );

    if (existingUserResult.rows.length > 0) {
      return NextResponse.json({
        status: false,
        message: 'Email sudah terdaftar',
        errors: {
          email: ['Email sudah terdaftar'],
        },
      }, { 
        status: 422,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const userResult = await client.query(
      'INSERT INTO "User" (name, email, password, role, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id, name, email, role',
      [name.trim(), email, hashedPassword, 'user']
    );

    const user = userResult.rows[0];
    console.log('[REGISTER] User created:', { id: user.id, email: user.email });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Response
    return NextResponse.json({
      status: true,
      message: 'Registrasi berhasil!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
      access_token: token,
      role: user.role,
    }, { 
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('[REGISTER] Error:', {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json({
      status: false,
      message: 'Terjadi kesalahan server: ' + error.message,
      error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message,
    }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } finally {
    if (client) client.release();
  }
}
