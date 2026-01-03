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
      'Access-Control-Allow-Methods': 'PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// PUT /api/addresses/[id] - Update address
export async function PUT(request, { params }) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ status: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ status: false, message: 'Invalid token' }, { status: 401 });
    }

    const { id } = params;
    const data = await request.json();

    const address = await prisma.address.findUnique({
      where: { id: parseInt(id) },
    });

    if (!address || address.userId !== decoded.id) {
      return NextResponse.json(
        { status: false, message: 'Address not found' },
        { status: 404 }
      );
    }

    // If setting as default, unset others
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: decoded.id },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json({
      status: true,
      message: 'Address updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('[UPDATE ADDRESS] Error:', error.message);
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/addresses/[id] - Delete address
export async function DELETE(request, { params }) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ status: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ status: false, message: 'Invalid token' }, { status: 401 });
    }

    const { id } = params;

    const address = await prisma.address.findUnique({
      where: { id: parseInt(id) },
    });

    if (!address || address.userId !== decoded.id) {
      return NextResponse.json(
        { status: false, message: 'Address not found' },
        { status: 404 }
      );
    }

    await prisma.address.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      status: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    console.error('[DELETE ADDRESS] Error:', error.message);
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
