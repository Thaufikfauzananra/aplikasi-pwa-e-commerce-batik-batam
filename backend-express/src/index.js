import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import healthRoutes from './routes/health.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: false,
  maxAge: 86400,
}));

// Handle preflight OPTIONS
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/health', healthRoutes);
app.use('/api', authRoutes);  // This handles /api/register, /api/login, etc.
app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Halo dari Express Backend! 🎉',
    status: 'success',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    status: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: 'Route not found',
  });
});

// Start server (for local development only)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

// Export for Vercel
export default app;
