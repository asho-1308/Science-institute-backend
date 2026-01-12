
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  bufferCommands: false, // Disable mongoose buffering
  bufferMaxEntries: 0, // Disable mongoose buffering
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});
connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Seed an admin user if it doesn't exist
const User = require('./models/User');
(async () => {
  try {
    const adminUsername = 'krishkugan@gmail.com';
    const adminPassword = '990001';
    const existing = await User.findOne({ username: adminUsername }).exec();
    if (!existing) {
      const user = new User({ username: adminUsername, password: adminPassword });
      await user.save();
      console.log(`Admin user created: ${adminUsername}`);
    } else {
      console.log('Admin user already exists');
    }
  } catch (err) {
    console.error('Error creating admin user:', err.message);
  }
})();

const classRoutes = require('./routes/classRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/timetable', classRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
