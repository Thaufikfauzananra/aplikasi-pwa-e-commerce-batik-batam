import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// Validators
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export async function POST(request) {
  let client;
  try {
    const { email, password } = await request.json();

    console.log('[LOGIN] Incoming request:', { email });

    // Validation
    const errors = {};

    if (!email || !validateEmail(email)) {
      errors.email = ['The email field is required.'];
    }

    if (!password) {
      errors.password = ['The password field is required.'];
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({
        status: false,
        errors,
      }, { status: 422 });
    }

    // Get DB connection
    client = await pool.connect();

    // Find user
    const userResult = await client.query(
      'SELECT id, name, email, password, role FROM "User" WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({
        status: false,
        message: 'Email atau password salah',
        errors: {
          email: ['Email atau password salah'],
        },
      }, { status: 401 });
    }

    const user = userResult.rows[0];

    // Check password
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({
        status: false,
        message: 'Email atau password salah',
        errors: {
          password: ['Email atau password salah'],
        },
      }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Response
    return NextResponse.json({
      status: true,
      message: 'Login berhasil!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
      access_token: token,
      role: user.role,
    }, { status: 200 });

  } catch (error) {
    console.error('[LOGIN] Error:', error);

    return NextResponse.json({
      status: false,
      message: 'Terjadi kesalahan server',
      error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message,
    }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}
