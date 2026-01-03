import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { validateEmail, validatePassword } from '../utils/validators.js';
import { verifyToken } from '../middleware/auth.js';
import axios from 'axios';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// POST /api/register - Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, password_confirmation } = req.body;

    // Logging
    console.log('[REGISTER] Incoming request:', {
      method: req.method,
      contentType: req.headers['content-type'],
      body: req.body,
    });

    // Validation
    const errors = {};

    if (!name || typeof name !== 'string' || name.length === 0) {
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
      return res.status(422).json({
        status: false,
        message: 'Validation failed',
        errors,
      });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(422).json({
        status: false,
        message: 'Email sudah terdaftar',
        errors: {
          email: ['Email sudah terdaftar'],
        },
      });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'user',
      },
    });

    console.log('[REGISTER] User created:', { id: user.id, email: user.email });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Response
    res.status(201).json({
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
    });
  } catch (error) {
    console.error('[REGISTER] Error:', {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      status: false,
      message: 'Terjadi kesalahan server: ' + error.message,
      error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message,
    });
  }
});

// POST /api/login - Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    const errors = {};

    if (!email || !validateEmail(email)) {
      errors.email = ['The email field is required.'];
    }

    if (!password) {
      errors.password = ['The password field is required.'];
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        status: false,
        errors,
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        status: false,
        message: 'Email atau password salah!',
      });
    }

    // Verify password
    const passwordMatch = await bcryptjs.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        status: false,
        message: 'Email atau password salah!',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
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
    });
  } catch (error) {
    console.error('[LOGIN] Error:', error.message);

    res.status(500).json({
      status: false,
      message: 'Terjadi kesalahan server: ' + error.message,
    });
  }
});

// POST /api/login-with-google - Login with Google
router.post('/login-with-google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(422).json({
        status: false,
        errors: {
          token: ['The token field is required.'],
        },
      });
    }

    // Verify Google token
    try {
      const googleResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
      );

      const email = googleResponse.data.email;
      const name = googleResponse.data.name || 'Google User';

      // Check if user exists
      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Create new user
        user = await prisma.user.create({
          data: {
            email,
            name,
            password: await bcryptjs.hash(Math.random().toString(), 10),
            role: 'user',
          },
        });
      }

      // Generate JWT token
      const jwtToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        status: true,
        message: 'Login dengan Google berhasil!',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: jwtToken,
        access_token: jwtToken,
        role: user.role,
      });
    } catch (googleError) {
      console.error('Google token verification failed:', googleError.message);
      return res.status(401).json({
        status: false,
        message: 'Token Google tidak valid',
      });
    }
  } catch (error) {
    console.error('[LOGIN_GOOGLE] Error:', error.message);

    res.status(500).json({
      status: false,
      message: 'Error verifying Google token: ' + error.message,
    });
  }
});

// GET /api/me - Get current user (protected)
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }

    res.json({
      status: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('[ME] Error:', error.message);

    res.status(500).json({
      status: false,
      message: 'Internal Server Error',
    });
  }
});

// POST /api/logout - Logout user (protected)
router.post('/logout', verifyToken, (req, res) => {
  // JWT tokens are stateless, so logout is handled on frontend by deleting token
  res.json({
    status: true,
    message: 'Logout berhasil!',
  });
});

// PUT /api/change-password - Change password (protected)
router.put('/change-password', verifyToken, async (req, res) => {
  try {
    const { current_password, new_password, new_password_confirmation } = req.body;

    // Validation
    const errors = {};

    if (!current_password) {
      errors.current_password = ['The current password field is required.'];
    }

    if (!new_password || new_password.length < 6) {
      errors.new_password = ['The new password must be at least 6 characters.'];
    }

    if (new_password !== new_password_confirmation) {
      errors.new_password_confirmation = ['The password confirmation does not match.'];
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        status: false,
        errors,
      });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const passwordMatch = await bcryptjs.compare(current_password, user.password);

    if (!passwordMatch) {
      return res.status(422).json({
        status: false,
        message: 'Password lama tidak sesuai',
        errors: {
          current_password: ['Password lama tidak sesuai'],
        },
      });
    }

    // Hash new password
    const hashedNewPassword = await bcryptjs.hash(new_password, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    res.json({
      status: true,
      message: 'Password berhasil diubah',
    });
  } catch (error) {
    console.error('[CHANGE_PASSWORD] Error:', error.message);

    res.status(500).json({
      status: false,
      message: 'Internal Server Error',
    });
  }
});

export default router;
