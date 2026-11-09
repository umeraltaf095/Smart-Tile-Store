import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import Category from '../../../../models/Category';

// GET: Fetch a single product by ID or Item ID
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

    let product = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id).populate('categoryId', 'name status description');
    }
    if (!product) {
      product = await Product.findOne({ itemId: id.toUpperCase() }).populate('categoryId', 'name status description');
    }

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Tile product not found in database' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
      source: 'mongodb',
    });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch product: ' + error.message },
      { status: 500 }
    );
  }
}

// PUT: Update an existing product by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      itemId,
      name,
      categoryId,
      company,
      size = '',
      design = '',
      price,
      unitType = 'Sq.Ft',
      boxCoverage = 15.0,
      description = '',
      status = 'active',
    } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Product name is required' },
        { status: 400 }
      );
    }

    if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
      return NextResponse.json(
        { success: false, message: 'Valid positive price is required' },
        { status: 400 }
      );
    }

    const conn = await connectDB();

    if (!conn) {
      return NextResponse.json(
        { success: false, message: 'Database connection unavailable' },
        { status: 503 }
      );
    }

    // Check duplicate itemId if changed
    if (itemId) {
      const duplicate = await Product.findOne({
        _id: { $ne: id },
        itemId: itemId.trim().toUpperCase(),
      });
      if (duplicate) {
        return NextResponse.json(
          { success: false, message: `Item ID "${itemId}" is already used by another tile` },
          { status: 400 }
        );
      }
    }

    const updateFields = {
      name: name.trim(),
      company: (company || '').trim(),
      size: (size || '').trim(),
      design: (design || '').trim(),
      price: Number(price),
      unitType: unitType || 'Sq.Ft',
      boxCoverage: Number(boxCoverage) || 15.0,
      description: (description || '').trim(),
      status: status ? status.toLowerCase() : 'active',
    };

    if (itemId) updateFields.itemId = itemId.trim().toUpperCase();
    if (categoryId) updateFields.categoryId = categoryId;

    const updated = await Product.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    }).populate('categoryId', 'name status');

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Tile product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tile product updated successfully',
      data: updated,
      source: 'mongodb',
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update product: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a product by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const conn = await connectDB();

    if (!conn) {
      return NextResponse.json(
        { success: false, message: 'Database connection unavailable' },
        { status: 503 }
      );
    }

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Tile product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tile product deleted successfully from database',
      source: 'mongodb',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete product: ' + error.message },
      { status: 500 }
    );
  }
}
