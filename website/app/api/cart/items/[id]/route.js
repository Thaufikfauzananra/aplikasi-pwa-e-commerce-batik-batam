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

// PUT /api/cart/items/[id] - Update cart item quantity
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

    const { quantity } = await request.json();
    const { id } = params;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(id) },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== decoded.id) {
      return NextResponse.json(
        { status: false, message: 'Cart item not found' },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: parseInt(id) },
      });

      return NextResponse.json({
        status: true,
        message: 'Item removed from cart',
      });
    }

    const updated = await prisma.cartItem.update({
      where: { id: parseInt(id) },
      data: { quantity: parseInt(quantity) },
      include: {
        product: { include: { images: true } },
        size: true,
      },
    });

    return NextResponse.json({
      status: true,
      message: 'Cart item updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('[UPDATE CART ITEM] Error:', error.message);
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/items/[id] - Remove item from cart
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

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(id) },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== decoded.id) {
      return NextResponse.json(
        { status: false, message: 'Cart item not found' },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      status: true,
      message: 'Item removed from cart successfully',
    });
  } catch (error) {
    console.error('[DELETE CART ITEM] Error:', error.message);
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
