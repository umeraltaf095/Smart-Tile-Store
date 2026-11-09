const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. Read MONGODB_URI from .env.local
let uri = process.env.MONGODB_URI;
if (!uri && fs.existsSync(path.join(__dirname, '.env.local'))) {
  const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('MONGODB_URI=')) {
      uri = trimmed.replace('MONGODB_URI=', '').trim();
      if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
        uri = uri.slice(1, -1);
      }
      break;
    }
  }
}

if (!uri) {
  console.log('❌ Error: MONGODB_URI not found in .env.local');
  process.exit(1);
}

// 2. Define User Schema matching models/User.js
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Admin account details to create:
const adminData = {
  name: 'Store Administrator',
  email: 'admin@smarttile.com',
  password: 'admin1234', // Change this password if you want a custom one
  role: 'admin',
  phone: '+92 300 1234567',
  address: 'Main Tile Store Head Office, Lahore',
};

async function createAdmin() {
  try {
    console.log('\nConnecting to MongoDB Atlas...');
    await mongoose.connect(uri);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('\n⚠️  Admin already exists: ' + adminData.email);
      console.log('Role: ' + existingAdmin.role);
      console.log('You can log in right now with this email and your password!\n');
      process.exit(0);
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Insert admin into database
    await User.create({
      ...adminData,
      password: hashedPassword,
    });

    console.log('\n=============================================');
    console.log('✅ Admin Account Created in MongoDB Atlas!');
    console.log('=============================================');
    console.log(`Email:    ${adminData.email}`);
    console.log(`Password: ${adminData.password}`);
    console.log(`Role:     ${adminData.role}`);
    console.log('=============================================\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
    process.exit(1);
  }
}

createAdmin();

