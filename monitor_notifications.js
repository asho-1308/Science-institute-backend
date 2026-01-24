require('dotenv').config();
const mongoose = require('mongoose');
const ClassSession = require('./models/ClassSession');

async function monitorNotifications() {
  console.log('📱 Monitoring notifications... (Press Ctrl+C to stop)');

  setInterval(async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);

      const now = new Date();
      const notifiedClasses = await ClassSession.find({ notificationSent: true }).sort({ startTime: -1 }).limit(5);

      if (notifiedClasses.length > 0) {
        console.log('\n✅ RECENT NOTIFICATIONS:');
        notifiedClasses.forEach((cls, index) => {
          console.log(`${index + 1}. ${cls.title} - ${cls.startTime.toLocaleTimeString()}`);
        });
        console.log('');
      }

      // Check upcoming classes
      const upcoming = await ClassSession.find({
        notificationSent: false,
        startTime: { $gt: now }
      }).sort({ startTime: 1 }).limit(3);

      if (upcoming.length > 0) {
        console.log('⏰ UPCOMING CLASSES:');
        upcoming.forEach((cls, index) => {
          const timeUntil = Math.round((cls.startTime - now) / (1000 * 60));
          console.log(`${index + 1}. ${cls.title}: ${cls.startTime.toLocaleTimeString()} (${timeUntil} min)`);
        });
      }

      await mongoose.disconnect();
    } catch (error) {
      console.error('❌ Monitor error:', error.message);
    }
  }, 10000); // Check every 10 seconds
}

monitorNotifications();