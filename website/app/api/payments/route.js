import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

function getTokenFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

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

// POST /api/payments/create - Create payment transaction
export async function POST(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ status: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ status: false, message: 'Invalid token' }, { status: 401 });
    }

    const { orderId, amount } = await request.json();

    if (!orderId || !amount) {
      return NextResponse.json(
        { status: false, message: 'OrderId and amount are required' },
        { status: 422 }
      );
    }

    // Verify order belongs to user
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
    });

    if (!order || order.userId !== decoded.id) {
      return NextResponse.json(
        { status: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Create payment record
    // In production, integrate with Midtrans to create snap transaction
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const payment = await prisma.payment.create({
      data: {
        userId: decoded.id,
        transactionId,
        orderId: parseInt(orderId),
        amount: parseFloat(amount),
        currency: 'IDR',
        status: 'pending',
        // snapToken and snapUrl would be set from Midtrans API
        snapToken: 'mock-snap-token-' + transactionId,
        snapUrl: `https://app.midtrans.com/snap/v1/transactions/${transactionId}`,
      },
    });

    return NextResponse.json(
      {
        status: true,
        message: 'Payment transaction created',
        data: {
          payment,
          snapToken: payment.snapToken,
          snapUrl: payment.snapUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[CREATE PAYMENT] Error:', error.message);
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
