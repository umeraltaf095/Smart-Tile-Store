import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Category from '../../../models/Category';

// GET: Retrieve all categories purely from MongoDB
export async function GET() {
  try {
    const conn = await connectDB();

    if (!conn) {
      return NextResponse.json({
        success: false,
        data: [],
        message: 'Could not connect to MongoDB Atlas. Please check cluster IP Whitelist.',
      }, { status: 503 });
    }

    const categories = await Category.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: categories,
      source: 'mongodb',
    });
  } catch (error) {
    console.error('Error fetching categories from database:', error);
    return NextResponse.json(
      { success: false, data: [], message: 'Failed to fetch categories: ' + error.message },
      { status: 500 }
    );
  }
}

// POST: Create a new category in MongoDB
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description = '', status = 'active' } = body;

    // Validation according to schema
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Category name is required and must be a string' },
        { status: 400 }
      );
    }

    const normalizedStatus = status ? status.toLowerCase() : 'active';
    if (!['active', 'inactive'].includes(normalizedStatus)) {
      return NextResponse.json(
        { success: false, message: 'Status must be either "active" or "inactive"' },
        { status: 400 }
      );
    }

    const conn = await connectDB();

    if (!conn) {
      return NextResponse.json(
        { success: false, message: 'Database connection failed. Please ensure MongoDB Atlas is accessible.' },
        { status: 503 }
      );
    }

    // Check if category name already exists
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: `Category "${name.trim()}" already exists` },
        { status: 400 }
      );
    }

    const newCategory = await Category.create({
      name: name.trim(),
      description: (description || '').trim(),
      status: normalizedStatus,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Category created successfully in database',
        data: newCategory,
        source: 'mongodb',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create category: ' + error.message },
      { status: 500 }
    );
  }
}
