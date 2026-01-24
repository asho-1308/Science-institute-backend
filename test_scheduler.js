require('dotenv').config();
const mongoose = require('mongoose');
const ClassSession = require('./models/ClassSession');

async function testScheduler() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const now = new Date();
    console.log('🕐 Current time:', now.toLocaleTimeString());

    // Check all classes
    const allClasses = await ClassSession.find({}).sort({ startTime: 1 });
    console.log('📚 All classes in database:');

    allClasses.forEach((cls, index) => {
      const timeUntil = Math.round((cls.startTime - now) / (1000 * 60));
      const notified = cls.notificationSent ? '✅' : '⏰';
      console.log(`${index + 1}. ${notified} ${cls.title}: ${cls.startTime.toLocaleTimeString()} (${timeUntil} min from now)`);
    });

    // Check classes that should trigger notifications now
    const plus29 = new Date(now.getTime() + 29 * 60 * 1000);
    const plus31 = new Date(now.getTime() + 31 * 60 * 1000);

    const pending = await ClassSession.find({
      notificationSent: false,
      startTime: { $gte: plus29, $lte: plus31 }
    });

    console.log('\n🎯 Classes that should trigger notifications in next minute:');
    if (pending.length === 0) {
      console.log('None found in the 29-31 minute window');
    } else {
      pending.forEach((cls, index) => {
        console.log(`${index + 1}. ${cls.title} at ${cls.startTime.toLocaleTimeString()}`);
      });
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testScheduler();