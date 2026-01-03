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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// GET /api/products - Get all products with filter & search
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let where = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const products = await prisma.product.findMany({
      where,
      include: {
        images: { where: { isPrimary: true } },
        sizes: { select: { id: true, size: true, stock: true } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.product.count({ where });

    return NextResponse.json({
      status: true,
      message: 'Products retrieved successfully',
      data: products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[PRODUCTS] Error:', error.message);
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create product (admin only)
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

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { status: false, message: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { name, description, price, discount, category, subcategory, stock, sku, weight, images } = await request.json();

    if (!name || !price || !category) {
      return NextResponse.json(
        { status: false, message: 'Name, price, and category are required' },
        { status: 422 }
      );
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-');

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        discount: discount ? parseFloat(discount) : null,
        category,
        subcategory,
        stock: parseInt(stock) || 0,
        sku,
        weight: weight ? parseFloat(weight) : null,
      },
    });

    if (images && Array.isArray(images)) {
      for (let i = 0; i < images.length; i++) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            imageUrl: images[i].url,
            altText: images[i].altText,
            isPrimary: i === 0,
          },
        });
      }
    }

    return NextResponse.json(
      { status: true, message: 'Product created successfully', data: product },
      { status: 201 }
    );
  } catch (error) {
    console.error('[CREATE PRODUCT] Error:', error.message);
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
