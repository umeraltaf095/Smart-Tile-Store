import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Order from '../../../models/Order';

// Helper to generate next sequential Order Number
async function generateOrderNumber() {
  try {
    const lastOrder = await Order.findOne({}, {}, { sort: { createdAt: -1 } });
    if (!lastOrder || !lastOrder.orderNumber) {
      return 'ORD-1001';
    }
    const matches = lastOrder.orderNumber.match(/\d+/);
    if (matches && matches.length > 0) {
      const nextNum = parseInt(matches[0], 10) + 1;
      return `ORD-${nextNum}`;
    }
    return `ORD-${Date.now().toString().slice(-4)}`;
  } catch (e) {
    return `ORD-${Date.now().toString().slice(-4)}`;
  }
}

// GET: Retrieve orders (filtered by customerEmail or all for admin)
export async function GET(request) {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json(
        { success: false, data: [], message: 'Could not connect to MongoDB Atlas' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    const query = {};
    if (email) {
      query.customerEmail = email.toLowerCase().trim();
    } else if (userId && userId.match(/^[0-9a-fA-F]{24}$/)) {
      query.userId = userId;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length,
      source: 'mongodb',
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve orders: ' + error.message },
      { status: 500 }
    );
  }
}

// POST: Create a new order or quotation request
export async function POST(request) {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json(
        { success: false, message: 'Database connection failed. Please ensure MongoDB Atlas is accessible.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone = '',
      deliveryAddress,
      orderType = 'Direct Purchase',
      paymentMethod = 'Cash on Delivery',
      items = [],
      totalBoxes,
      totalAmount,
      notes = '',
    } = body;

    // Validation
    if (!customerName || !customerName.trim()) {
      return NextResponse.json(
        { success: false, message: 'Customer name is required' },
        { status: 400 }
      );
    }

    if (!customerEmail || !customerEmail.trim()) {
      return NextResponse.json(
        { success: false, message: 'Customer email is required' },
        { status: 400 }
      );
    }

    if (!deliveryAddress || !deliveryAddress.trim()) {
      return NextResponse.json(
        { success: false, message: 'Delivery address is required' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Order must contain at least one tile product' },
        { status: 400 }
      );
    }

    if (totalAmount === undefined || isNaN(Number(totalAmount)) || Number(totalAmount) < 0) {
      return NextResponse.json(
        { success: false, message: 'Valid total amount is required' },
        { status: 400 }
      );
    }

    const orderNumber = await generateOrderNumber();

    const newOrder = await Order.create({
      orderNumber,
      userId: userId || undefined,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone.trim(),
      deliveryAddress: deliveryAddress.trim(),
      orderType,
      paymentMethod: orderType === 'Price Quotation' ? 'To be discussed with Quotation' : 'Cash on Delivery',
      items,
      totalBoxes: Number(totalBoxes) || items.reduce((sum, it) => sum + (Number(it.boxes) || 1), 0),
      totalAmount: Number(totalAmount),
      status: 'Pending',
      notes: (notes || '').trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: `${orderType === 'Price Quotation' ? 'Quotation request' : 'Order'} submitted successfully!`,
        data: newOrder,
        source: 'mongodb',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create order: ' + error.message },
      { status: 500 }
    );
  }
}

