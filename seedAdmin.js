require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const uri = process.env.MONGO_URI;

async function run() {
  if (!uri) {
    console.error('MONGO_URI not set in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  try {
    const adminUsername = 'krishkugan@gmail.com';
    const adminPassword = '990001';

    const existing = await User.findOne({ username: adminUsername }).exec();
    if (existing) {
      console.log('Admin user already exists:', adminUsername);
    } else {
      const user = new User({ username: adminUsername, password: adminPassword });
      await user.save();
      console.log('Admin user created:', adminUsername);
    }
  } catch (err) {
    console.error('Error creating admin user:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
