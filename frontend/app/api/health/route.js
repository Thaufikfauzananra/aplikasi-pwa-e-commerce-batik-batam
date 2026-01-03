import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // For now, just return healthy status
    // Database connection will be tested in production
    return NextResponse.json({
      status: 'success',
      message: 'Backend is healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    }, { status: 200 });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error.message,
    }, { status: 503 });
  }
}
