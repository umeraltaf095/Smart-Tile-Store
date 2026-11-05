import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

// Predefined demo accounts when MongoDB is not yet connected
const defaultDemoUsers = [
  {
    email: 'admin@smarttile.com',
    password: 'admin1234',
    name: 'Store Administrator',
    role: 'admin',
  },
  {
    email: 'customer@smarttile.com',
    password: 'demo1234',
    name: 'Valued Customer',
    role: 'customer',
  },
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const conn = await connectDB();

    // 1. If MongoDB Atlas is connected
    if (conn) {
      const user = await User.findOne({ email: cleanEmail });

      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Check role if specified
      if (role && user.role !== role) {
        return NextResponse.json(
          { success: false, message: `No ${role} account found with this email` },
          { status: 403 }
        );
      }

      // Verify password (supports bcrypt hash or plain text fallback)
      let isMatch = false;
      try {
        isMatch = await bcrypt.compare(password, user.password);
      } catch (err) {
        isMatch = user.password === password;
      }
      if (!isMatch && user.password === password) {
        isMatch = true;
      }

      if (!isMatch) {
        return NextResponse.json(
          { success: false, message: 'Invalid email or password' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        source: 'mongodb',
      });
    }

    // 2. In-Memory / Demo Fallback (before Atlas connection string is provided)
    if (!global.__mockUsers) {
      global.__mockUsers = [...defaultDemoUsers];
    }

    const matchedUser = global.__mockUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (!matchedUser) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. (Demo: admin@smarttile.com / admin1234 or customer@smarttile.com / demo1234)' },
        { status: 401 }
      );
    }

    if (role && matchedUser.role !== role) {
      return NextResponse.json(
        { success: false, message: `This account is not authorized as ${role}` },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful (Demo Mode - Connect MongoDB Atlas anytime)',
      user: {
        id: 'demo-' + matchedUser.role,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
      },
      source: 'demo_fallback',
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}

