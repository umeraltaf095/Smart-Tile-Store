import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Order from '../../../../models/Order';

// GET: Fetch a single order by ID or Order Number
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json(
        { success: false, message: 'Database connection unavailable' },
        { status: 503 }
      );
    }

    let order = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: id.toUpperCase() });
    }

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
      source: 'mongodb',
    });
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve order: ' + error.message },
      { status: 500 }
    );
  }
}

// PATCH: Update order status (e.g. customer cancels order, or admin updates to Shipped/Delivered)
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json(
        { success: false, message: 'Database connection unavailable' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { status, notes } = body;

    const allowedStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    let updated = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      updated = await Order.findByIdAndUpdate(id, updateData, { new: true });
    }
    if (!updated) {
      updated = await Order.findOneAndUpdate({ orderNumber: id.toUpperCase() }, updateData, { new: true });
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${updated.status}`,
      data: updated,
      source: 'mongodb',
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update order: ' + error.message },
      { status: 500 }
    );
  }
}

