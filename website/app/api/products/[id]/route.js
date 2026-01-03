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
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// GET /api/products/[id] - Get product detail
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        images: true,
        sizes: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { status: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: true,
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    console.error('[PRODUCT DETAIL] Error:', error.message);
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product (admin only)
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

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { status: false, message: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;
    const { name, description, price, discount, category, subcategory, stock, sku, weight } = await request.json();

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        discount: discount ? parseFloat(discount) : null,
        category,
        subcategory,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        sku,
        weight: weight ? parseFloat(weight) : null,
      },
    });

    return NextResponse.json({
      status: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    console.error('[UPDATE PRODUCT] Error:', error.message);
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product (admin only)
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

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { status: false, message: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      status: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('[DELETE PRODUCT] Error:', error.message);
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
