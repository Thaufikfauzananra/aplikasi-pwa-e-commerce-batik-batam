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

// GET /api/orders - Get user's orders
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

    const orders = await prisma.order.findMany({
      where: { userId: decoded.id },
      include: {
        items: {
          include: {
            product: { include: { images: { where: { isPrimary: true } } } },
          },
        },
        address: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      status: true,
      message: 'Orders retrieved successfully',
      data: orders,
    });
  } catch (error) {
    console.error('[GET ORDERS] Error:', error.message);
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
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

    const { addressId, items, subtotal, discount, tax, shippingCost, total, notes } = await request.json();

    if (!addressId || !items || items.length === 0) {
      return NextResponse.json(
        { status: false, message: 'AddressId and items are required' },
        { status: 422 }
      );
    }

    // Verify address belongs to user
    const address = await prisma.address.findUnique({
      where: { id: parseInt(addressId) },
    });

    if (!address || address.userId !== decoded.id) {
      return NextResponse.json(
        { status: false, message: 'Address not found' },
        { status: 404 }
      );
    }

    // Generate order number
    const timestamp = Date.now();
    const orderNumber = `ORD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${timestamp % 10000}`;

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: decoded.id,
        addressId: parseInt(addressId),
        subtotal: parseFloat(subtotal),
        discount: parseFloat(discount) || 0,
        tax: parseFloat(tax) || 0,
        shippingCost: parseFloat(shippingCost) || 0,
        total: parseFloat(total),
        notes,
        items: {
          create: items.map(item => ({
            productId: parseInt(item.productId),
            productSizeId: parseInt(item.productSizeId),
            productName: item.productName,
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
            subtotal: parseFloat(item.subtotal),
          })),
        },
      },
      include: {
        items: {
          include: {
            product: { include: { images: true } },
          },
        },
        address: true,
      },
    });

    // Clear user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: decoded.id },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return NextResponse.json(
      { status: true, message: 'Order created successfully', data: order },
      { status: 201 }
    );
  } catch (error) {
    console.error('[CREATE ORDER] Error:', error.message);
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
