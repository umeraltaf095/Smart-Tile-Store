import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Category from '../../../../models/Category';

// PUT: Update an existing category by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description = '', status } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Category name is required' },
        { status: 400 }
      );
    }

    if (status && !['active', 'inactive'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Status must be either "active" or "inactive"' },
        { status: 400 }
      );
    }

    const conn = await connectDB();

    if (conn) {
      const updated = await Category.findByIdAndUpdate(
        id,
        {
          name: name.trim(),
          description: (description || '').trim(),
          status: status || 'active',
        },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return NextResponse.json(
          { success: false, message: 'Category not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Category updated successfully',
        data: updated,
        source: 'mongodb',
      });
    }

    // In-memory fallback
    if (!global.__mockCategories) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    const index = global.__mockCategories.findIndex((c) => c._id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    global.__mockCategories[index] = {
      ...global.__mockCategories[index],
      name: name.trim(),
      description: (description || '').trim(),
      status: status || 'active',
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      data: global.__mockCategories[index],
      source: 'demo_fallback',
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update category: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a category by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const conn = await connectDB();

    if (conn) {
      const deleted = await Category.findByIdAndDelete(id);

      if (!deleted) {
        return NextResponse.json(
          { success: false, message: 'Category not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Category deleted successfully',
        data: deleted,
        source: 'mongodb',
      });
    }

    // In-memory fallback
    if (!global.__mockCategories) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    const index = global.__mockCategories.findIndex((c) => c._id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    const deletedItem = global.__mockCategories.splice(index, 1)[0];

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
      data: deletedItem,
      source: 'demo_fallback',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete category: ' + error.message },
      { status: 500 }
    );
  }
}

