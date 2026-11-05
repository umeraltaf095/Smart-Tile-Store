import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import Category from '../../../../models/Category';

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

    if (status && !['active', 'inactive'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Status must be "active" or "inactive"' },
        { status: 400 }
      );
    }

    const conn = await connectDB();

    if (conn) {
      // Check if itemId conflicts with another product
      if (itemId) {
        const conflict = await Product.findOne({
          itemId: itemId.trim().toUpperCase(),
          _id: { $ne: id },
        });
        if (conflict) {
          return NextResponse.json(
            { success: false, message: `Another product already has Item ID "${itemId.trim().toUpperCase()}"` },
            { status: 400 }
          );
        }
      }

      const updateData = {
        name: name.trim(),
        company: company?.trim(),
        size: size.trim(),
        design: design.trim(),
        price: Number(price),
        unitType: unitType.trim() || 'Sq.Ft',
        boxCoverage: Number(boxCoverage) || 15.0,
        description: description.trim(),
        status: status || 'active',
      };

      if (itemId) updateData.itemId = itemId.trim().toUpperCase();
      if (categoryId) updateData.categoryId = categoryId;

      const updated = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).populate('categoryId', 'name status');

      if (!updated) {
        return NextResponse.json(
          { success: false, message: 'Product not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Product updated successfully',
        data: updated,
        source: 'mongodb',
      });
    }

    // In-memory fallback
    if (!global.__mockProducts) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    const index = global.__mockProducts.findIndex((p) => p._id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    let catDetails = global.__mockProducts[index].categoryId;
    if (categoryId && global.__mockCategories) {
      const matchCat = global.__mockCategories.find((c) => c._id === categoryId);
      if (matchCat) {
        catDetails = { _id: matchCat._id, name: matchCat.name };
      }
    }

    global.__mockProducts[index] = {
      ...global.__mockProducts[index],
      itemId: itemId ? itemId.trim().toUpperCase() : global.__mockProducts[index].itemId,
      name: name.trim(),
      categoryId: catDetails,
      company: company ? company.trim() : global.__mockProducts[index].company,
      size: size.trim(),
      design: design.trim(),
      price: Number(price),
      unitType: unitType.trim() || 'Sq.Ft',
      boxCoverage: Number(boxCoverage) || 15.0,
      description: description.trim(),
      status: status || 'active',
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: global.__mockProducts[index],
      source: 'demo_fallback',
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update product: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete product by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const conn = await connectDB();

    if (conn) {
      const deleted = await Product.findByIdAndDelete(id);
      if (!deleted) {
        return NextResponse.json(
          { success: false, message: 'Product not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Product deleted successfully',
        data: deleted,
        source: 'mongodb',
      });
    }

    // In-memory fallback
    if (!global.__mockProducts) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    const index = global.__mockProducts.findIndex((p) => p._id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    const deletedItem = global.__mockProducts.splice(index, 1)[0];

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      data: deletedItem,
      source: 'demo_fallback',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete product: ' + error.message },
      { status: 500 }
    );
  }
}

