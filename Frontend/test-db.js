const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Read MONGODB_URI directly from .env.local without needing any extra packages
let uri = process.env.MONGODB_URI;

if (!uri && fs.existsSync(path.join(__dirname, '.env.local'))) {
  const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('MONGODB_URI=')) {
      uri = trimmed.replace('MONGODB_URI=', '').trim();
      // Remove quotes if present
      if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
        uri = uri.slice(1, -1);
      }
      break;
    }
  }
}

if (!uri) {
  console.log('\n❌ Error: MONGODB_URI is empty in .env.local!');
  console.log('Please open .env.local and paste your MongoDB Atlas connection string.\n');
  process.exit(1);
}

console.log('\nConnecting to MongoDB Atlas...');

mongoose.connect(uri)
  .then(() => {
    console.log('\n=============================================');
    console.log('✅ Connected to MongoDB Atlas Successfully!');
    console.log(`Database Name: ${mongoose.connection.name || 'default'}`);
    console.log('Host: ' + mongoose.connection.host);
    console.log('=============================================\n');
    process.exit(0);
  })
  .catch((err) => {
    console.log('\n=============================================');
    console.log('❌ Connection Failed!');
    console.log('Reason: ' + err.message);
    if (err.message.includes('bad auth')) {
      console.log('👉 Tip: Check your username and password in the connection string.');
    } else if (err.message.includes('whitelist') || err.message.includes('timed out')) {
      console.log('👉 Tip: Go to MongoDB Atlas -> Network Access -> Add IP Address -> Allow 0.0.0.0/0.');
    }
    console.log('=============================================\n');
    process.exit(1);
  });

