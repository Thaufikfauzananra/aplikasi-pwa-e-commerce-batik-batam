import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/health - Health check
router.get('/', async (req, res) => {
  try {
    // Test database connection
    const result = await prisma.user.count();
    res.json({
      status: 'success',
      message: 'Backend is healthy',
      database: 'connected',
      totalUsers: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

export default router;
