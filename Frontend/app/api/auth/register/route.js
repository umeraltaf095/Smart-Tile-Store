import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, phone, address } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const conn = await connectDB();

    // 1. If MongoDB Atlas is connected
    if (conn) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'An account with this email already exists' },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        role: 'customer',
        phone: phone || '',
        address: address || '',
      });

      return NextResponse.json({
        success: true,
        message: 'Registration successful! You can now log in.',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        source: 'mongodb',
      });
    }

    // 2. In-Memory / Demo Fallback
    if (!global.__mockUsers) {
      global.__mockUsers = [
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
    }

    const existingMock = global.__mockUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (existingMock) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    const newMockUser = {
      id: 'demo-' + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      password: password,
      role: 'customer',
      phone: phone || '',
      address: address || '',
    };

    global.__mockUsers.push(newMockUser);

    return NextResponse.json({
      success: true,
      message: 'Account registered successfully! You can now log in.',
      user: {
        id: newMockUser.id,
        name: newMockUser.name,
        email: newMockUser.email,
        role: newMockUser.role,
      },
      source: 'demo_fallback',
    });
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}

