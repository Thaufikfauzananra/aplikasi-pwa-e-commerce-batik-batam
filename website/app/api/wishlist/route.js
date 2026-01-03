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
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// GET /api/wishlist - Get user's wishlist
export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ status: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ status: false, message: 'Invalid token' }, { status: 401 });
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: decoded.id },
      include: {
        product: {
          include: { images: { where: { isPrimary: true } } },
        },
      },
    });

    return NextResponse.json({
      status: true,
      message: 'Wishlist retrieved successfully',
      data: wishlist,
    });
  } catch (error) {
    console.error('[GET WISHLIST] Error:', error.message);
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/wishlist - Add product to wishlist
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

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { status: false, message: 'ProductId is required' },
        { status: 422 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      return NextResponse.json(
        { status: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if already in wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: decoded.id,
          productId: parseInt(productId),
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { status: false, message: 'Product already in wishlist' },
        { status: 409 }
      );
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: decoded.id,
        productId: parseInt(productId),
      },
      include: {
        product: { include: { images: true } },
      },
    });

    return NextResponse.json(
      { status: true, message: 'Product added to wishlist', data: wishlistItem },
      { status: 201 }
    );
  } catch (error) {
    console.error('[ADD WISHLIST] Error:', error.message);
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist/:productId - Remove product from wishlist
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

    const productId = new URL(request.url).searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { status: false, message: 'ProductId is required' },
        { status: 422 }
      );
    }

    const wishlist = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: decoded.id,
          productId: parseInt(productId),
        },
      },
    });

    if (!wishlist) {
      return NextResponse.json(
        { status: false, message: 'Wishlist item not found' },
        { status: 404 }
      );
    }

    await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId: decoded.id,
          productId: parseInt(productId),
        },
      },
    });

    return NextResponse.json({
      status: true,
      message: 'Product removed from wishlist',
    });
  } catch (error) {
    console.error('[DELETE WISHLIST] Error:', error.message);
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
