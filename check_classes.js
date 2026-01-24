require('dotenv').config();
const mongoose = require('mongoose');
const ClassSession = require('./models/ClassSession');

async function checkUpcomingClasses() {
  try {
    console.log('🔍 Checking for upcoming classes...');

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find classes in the next 24 hours
    const upcomingClasses = await ClassSession.find({
      startTime: { $gte: now, $lte: next24Hours },
      notificationSent: false
    }).sort({ startTime: 1 });

    console.log(`📅 Found ${upcomingClasses.length} upcoming classes in next 24 hours:`);

    upcomingClasses.forEach((cls, index) => {
      const timeUntil = Math.round((cls.startTime - now) / (1000 * 60)); // minutes
      console.log(`${index + 1}. ${cls.title || cls.subject} - ${cls.startTime.toLocaleString()} (${timeUntil} min from now)`);
    });

    // Check for classes that should trigger notifications (30 min warning)
    const thirtyMinFromNow = new Date(now.getTime() + 30 * 60 * 1000);
    const thirtyTwoMinFromNow = new Date(now.getTime() + 32 * 60 * 1000);

    const classesToNotify = await ClassSession.find({
      startTime: { $gte: thirtyMinFromNow, $lte: thirtyTwoMinFromNow },
      notificationSent: false
    });

    if (classesToNotify.length > 0) {
      console.log(`\n🚨 ${classesToNotify.length} classes should trigger WhatsApp notifications soon:`);
      classesToNotify.forEach(cls => {
        console.log(`- ${cls.title || cls.subject} at ${cls.startTime.toLocaleTimeString()}`);
      });
    } else {
      console.log('\n⏰ No classes triggering notifications in next 30-32 minutes');
    }

    await mongoose.disconnect();
    console.log('👋 Database connection closed');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUpcomingClasses();