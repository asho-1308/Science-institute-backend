require('dotenv').config();
const mongoose = require('mongoose');
const ClassSession = require('./models/ClassSession');

async function createTestClasses() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing classes
    await ClassSession.deleteMany({});
    console.log('🧹 Cleared existing classes');

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // Create test classes for different times
    const testClasses = [
      {
        title: "Mathematics",
        subject: "Mathematics",
        grade: "Grade 10",
        startTime: new Date(now.getTime() + 35 * 60 * 1000), // 35 minutes from now
        endTime: new Date(now.getTime() + 35 * 60 * 1000 + 60 * 60 * 1000), // 1 hour later
        day: now.toLocaleDateString('en-US', { weekday: 'long' }),
        location: "Room 101",
        category: "PERSONAL",
        type: "Theory",
        medium: "English",
        classNumber: 1,
        notificationSent: false
      },
      {
        title: "Science",
        subject: "Science",
        grade: "Grade 10",
        startTime: new Date(now.getTime() + 65 * 60 * 1000), // 65 minutes from now
        endTime: new Date(now.getTime() + 65 * 60 * 1000 + 60 * 60 * 1000), // 1 hour later
        day: now.toLocaleDateString('en-US', { weekday: 'long' }),
        location: "Lab 1",
        category: "PERSONAL",
        type: "Revision",
        medium: "English",
        classNumber: 2,
        notificationSent: false
      },
      {
        title: "English",
        subject: "English",
        grade: "Grade 9",
        startTime: new Date(now.getTime() + 95 * 60 * 1000), // 95 minutes from now
        endTime: new Date(now.getTime() + 95 * 60 * 1000 + 60 * 60 * 1000), // 1 hour later
        day: now.toLocaleDateString('en-US', { weekday: 'long' }),
        location: "Room 205",
        category: "EXTERNAL",
        type: "Paper Class",
        medium: "English",
        classNumber: 3,
        notificationSent: false
      }
    ];

    console.log('📝 Creating test classes...');
    for (const classData of testClasses) {
      const newClass = new ClassSession(classData);
      await newClass.save();
      console.log(`✅ Created: ${classData.title} at ${classData.startTime.toLocaleTimeString()}`);
    }

    console.log('\n📊 Test classes created successfully!');
    console.log('⏰ WhatsApp notifications will trigger 30 minutes before each class');
    console.log('📱 Check your WhatsApp for reminder messages');

    // Show when notifications will be sent
    console.log('\n🔔 Expected notification times:');
    testClasses.forEach((cls, index) => {
      const notifyTime = new Date(cls.startTime.getTime() - 30 * 60 * 1000);
      console.log(`${index + 1}. ${cls.title}: ${notifyTime.toLocaleTimeString()} (30 min before class)`);
    });

    await mongoose.disconnect();
    console.log('\n👋 Database connection closed');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createTestClasses();