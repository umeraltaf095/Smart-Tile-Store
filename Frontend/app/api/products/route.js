import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Product from '../../../models/Product';
import Category from '../../../models/Category';

// GET: Fetch all products purely from MongoDB
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

    const products = await Product.find({})
      .populate('categoryId', 'name status')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: products,
      source: 'mongodb',
    });
  } catch (error) {
    console.error('Error fetching products from database:', error);
    return NextResponse.json(
      { success: false, data: [], message: 'Failed to fetch products: ' + error.message },
      { status: 500 }
    );
  }
}

// POST: Create a new tile product in MongoDB
export async function POST(request) {
  try {
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

    // 1. Validation according to schema
    if (!itemId || !itemId.trim()) {
      return NextResponse.json(
        { success: false, message: 'Item ID is required (e.g. T-FL-101)' },
        { status: 400 }
      );
    }

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Product name is required' },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { success: false, message: 'Category is required' },
        { status: 400 }
      );
    }

    if (!company || !company.trim()) {
      return NextResponse.json(
        { success: false, message: 'Manufacturing company is required' },
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
        { success: false, message: 'Database connection failed. Please ensure MongoDB Atlas is accessible.' },
        { status: 503 }
      );
    }

    // Check duplicate itemId in MongoDB
    const existing = await Product.findOne({
      itemId: { $regex: new RegExp(`^${itemId.trim()}$`, 'i') },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: `Item ID "${itemId.trim()}" is already assigned to another tile` },
        { status: 400 }
      );
    }

    // Create in MongoDB
    const newProduct = await Product.create({
      itemId: itemId.trim().toUpperCase(),
      name: name.trim(),
      categoryId,
      company: company.trim(),
      size: (size || '').trim(),
      design: (design || '').trim(),
      price: Number(price),
      unitType: unitType || 'Sq.Ft',
      boxCoverage: Number(boxCoverage) || 15.0,
      description: (description || '').trim(),
      status: status ? status.toLowerCase() : 'active',
    });

    const populated = await Product.findById(newProduct._id).populate('categoryId', 'name status');

    return NextResponse.json(
      {
        success: true,
        message: 'Tile product created successfully in database',
        data: populated,
        source: 'mongodb',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create product: ' + error.message },
      { status: 500 }
    );
  }
}
