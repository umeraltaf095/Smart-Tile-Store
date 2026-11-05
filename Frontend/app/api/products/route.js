import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Product from '../../../models/Product';
import Category from '../../../models/Category';

// Seed demo products for offline/demo fallback matching the updated schema
const defaultProducts = [
  {
    _id: 'prod-1',
    itemId: 'T-FL-101',
    name: 'Carrara White Porcelain',
    categoryId: 'cat-1',
    categoryName: 'Floor Tiles',
    company: 'Master Ceramics',
    size: '60 x 120 cm',
    design: 'Polished Glazed Marble',
    price: 4.50,
    unitType: 'Sq.Ft',
    boxCoverage: 15.5,
    description: 'Premium rectified porcelain floor tile with subtle grey veining.',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod-2',
    itemId: 'T-EL-304',
    name: 'Rustic Slate 3D Stone',
    categoryId: 'cat-3',
    categoryName: 'Front Elevation Tiles',
    company: 'National Tiles',
    size: '30 x 60 cm',
    design: 'Textured Rockface Finish',
    price: 5.20,
    unitType: 'Sq.Ft',
    boxCoverage: 12.0,
    description: 'Weather-resistant textured stacked stone finish for exterior facades.',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod-3',
    itemId: 'T-WS-208',
    name: 'Royal Blue Anti-Skid',
    categoryId: 'cat-2',
    categoryName: 'Washroom Tiles',
    company: 'Shabbir Tiles (Stile)',
    size: '30 x 30 cm',
    design: 'Matte Anti-Slip Pattern',
    price: 3.80,
    unitType: 'Sq.Ft',
    boxCoverage: 10.0,
    description: 'High-grip moisture-proof anti-skid floor tile for bathrooms.',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod-4',
    itemId: 'T-FL-109',
    name: 'Travertine Gold Polished',
    categoryId: 'cat-1',
    categoryName: 'Floor Tiles',
    company: 'Karam Ceramics',
    size: '80 x 80 cm',
    design: 'Mirror Polished Finish',
    price: 6.10,
    unitType: 'Sq.Ft',
    boxCoverage: 14.0,
    description: 'Luxury warm travertine pattern with high-gloss mirror glaze.',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod-5',
    itemId: 'T-WS-215',
    name: 'Onyx Pearl Subway Tile',
    categoryId: 'cat-2',
    categoryName: 'Washroom Tiles',
    company: 'Master Ceramics',
    size: '10 x 30 cm',
    design: 'Beveled Edge Glossy',
    price: 4.10,
    unitType: 'Sq.Ft',
    boxCoverage: 11.5,
    description: 'Classic beveled wall tile for bathroom and shower surrounds.',
    status: 'inactive',
    createdAt: new Date().toISOString(),
  },
];

// GET: Fetch all products
export async function GET() {
  try {
    const conn = await connectDB();

    if (conn) {
      const products = await Product.find({})
        .populate('categoryId', 'name status')
        .sort({ createdAt: -1 });

      return NextResponse.json({
        success: true,
        data: products,
        source: 'mongodb',
      });
    }

    // In-memory fallback
    if (!global.__mockProducts) {
      global.__mockProducts = [...defaultProducts];
    }

    return NextResponse.json({
      success: true,
      data: global.__mockProducts,
      source: 'demo_fallback',
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products: ' + error.message },
      { status: 500 }
    );
  }
}

// POST: Create a new tile product
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
        { success: false, message: 'Company / Manufacturer name is required' },
        { status: 400 }
      );
    }

    if (price === undefined || price === null || isNaN(Number(price)) || Number(price) < 0) {
      return NextResponse.json(
        { success: false, message: 'Valid positive price is required' },
        { status: 400 }
      );
    }

    if (!['active', 'inactive'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Status must be "active" or "inactive"' },
        { status: 400 }
      );
    }

    const cleanItemId = itemId.trim().toUpperCase();
    const conn = await connectDB();

    if (conn) {
      // Check if Item ID already exists
      const existing = await Product.findOne({ itemId: cleanItemId });
      if (existing) {
        return NextResponse.json(
          { success: false, message: `Product with Item ID "${cleanItemId}" already exists` },
          { status: 400 }
        );
      }

      const newProduct = await Product.create({
        itemId: cleanItemId,
        name: name.trim(),
        categoryId,
        company: company.trim(),
        size: size.trim(),
        design: design.trim(),
        price: Number(price),
        unitType: unitType.trim() || 'Sq.Ft',
        boxCoverage: Number(boxCoverage) || 15.0,
        description: description.trim(),
        status,
      });

      const populatedProduct = await Product.findById(newProduct._id).populate(
        'categoryId',
        'name status'
      );

      return NextResponse.json(
        {
          success: true,
          message: 'Product created successfully',
          data: populatedProduct,
          source: 'mongodb',
        },
        { status: 201 }
      );
    }

    // In-memory fallback
    if (!global.__mockProducts) {
      global.__mockProducts = [...defaultProducts];
    }

    const existingMock = global.__mockProducts.find(
      (p) => p.itemId.toUpperCase() === cleanItemId
    );

    if (existingMock) {
      return NextResponse.json(
        { success: false, message: `Product with Item ID "${cleanItemId}" already exists` },
        { status: 400 }
      );
    }

    // Resolve category name from mockCategories if available
    let resolvedCatName = 'Standard Tile';
    if (global.__mockCategories) {
      const matchCat = global.__mockCategories.find((c) => c._id === categoryId);
      if (matchCat) resolvedCatName = matchCat.name;
    }

    const newMockProduct = {
      _id: 'prod-' + Date.now(),
      itemId: cleanItemId,
      name: name.trim(),
      categoryId: {
        _id: categoryId,
        name: resolvedCatName,
      },
      categoryName: resolvedCatName,
      company: company.trim(),
      size: size.trim(),
      design: design.trim(),
      price: Number(price),
      unitType: unitType.trim() || 'Sq.Ft',
      boxCoverage: Number(boxCoverage) || 15.0,
      description: description.trim(),
      status,
      createdAt: new Date().toISOString(),
    };

    global.__mockProducts.unshift(newMockProduct);

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully',
        data: newMockProduct,
        source: 'demo_fallback',
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

