import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Category from '../../../models/Category';

// Default initial categories for demo/offline fallback matching the schema
const defaultCategories = [
  {
    _id: 'cat-1',
    name: 'Floor Tiles',
    description: 'Heavy-duty porcelain & marble finishes for indoor living spaces and commercial areas.',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-2',
    name: 'Washroom Tiles',
    description: 'Anti-skid floor tiles and moisture-resistant glossy wall cladding for modern bathrooms.',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-3',
    name: 'Front Elevation Tiles',
    description: 'Weather-proof 3D textured stone & rock face tiles for building exteriors and facade walls.',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-4',
    name: 'Kitchen Backsplash',
    description: 'Stain-resistant heat-proof glazed subway and mosaic tiles for kitchen work areas.',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-5',
    name: 'Outdoor Pavers',
    description: 'Ultra-durable anti-freeze thick porcelain slabs for driveways, patios, and gardens.',
    status: 'inactive',
    createdAt: new Date().toISOString(),
  },
];

// GET: Retrieve all categories
export async function GET() {
  try {
    const conn = await connectDB();

    if (conn) {
      const categories = await Category.find({}).sort({ createdAt: -1 });
      return NextResponse.json({
        success: true,
        data: categories,
        source: 'mongodb',
      });
    }

    // In-memory fallback
    if (!global.__mockCategories) {
      global.__mockCategories = [...defaultCategories];
    }

    return NextResponse.json({
      success: true,
      data: global.__mockCategories,
      source: 'demo_fallback',
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch categories: ' + error.message },
      { status: 500 }
    );
  }
}

// POST: Create a new category
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

    if (!['active', 'inactive'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Status must be either "active" or "inactive"' },
        { status: 400 }
      );
    }

    const conn = await connectDB();

    if (conn) {
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
        status,
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Category created successfully',
          data: newCategory,
          source: 'mongodb',
        },
        { status: 201 }
      );
    }

    // In-memory fallback
    if (!global.__mockCategories) {
      global.__mockCategories = [...defaultCategories];
    }

    const duplicateMock = global.__mockCategories.find(
      (c) => c.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (duplicateMock) {
      return NextResponse.json(
        { success: false, message: `Category "${name.trim()}" already exists` },
        { status: 400 }
      );
    }

    const newMockCategory = {
      _id: 'cat-' + Date.now(),
      name: name.trim(),
      description: (description || '').trim(),
      status,
      createdAt: new Date().toISOString(),
    };

    global.__mockCategories.unshift(newMockCategory);

    return NextResponse.json(
      {
        success: true,
        message: 'Category created successfully',
        data: newMockCategory,
        source: 'demo_fallback',
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

