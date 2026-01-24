const cron = require('node-cron');
const ClassSession = require('./models/ClassSession');

// Environment variables:
// ADMIN_PHONE (E.164, e.g., +919812345678) - recipient admin number
// SCHEDULER_ENABLED (optional) - set to 'false' to disable scheduler
// NOTIFICATION_METHOD (optional) - 'whatsapp', 'console', 'email' (default: console)

const SCHEDULER_ENABLED = process.env.SCHEDULER_ENABLED !== 'false';
const NOTIFICATION_METHOD = process.env.NOTIFICATION_METHOD || 'console';

if (!SCHEDULER_ENABLED) {
  console.log('📅 Notification scheduler disabled (SCHEDULER_ENABLED=false)');
  module.exports = null;
  return;
}

console.log(`📅 Notification scheduler starting (method: ${NOTIFICATION_METHOD})`);

// Simple notification service
class NotificationService {
  constructor(method = 'console') {
    this.method = method;
  }

  async sendNotification(recipient, message, classInfo) {
    const timestamp = new Date().toISOString();

    switch (this.method) {
      case 'whatsapp':
        return this.sendWhatsApp(recipient, message, classInfo);
      case 'email':
        return this.sendEmail(recipient, message, classInfo);
      case 'console':
      default:
        return this.sendConsole(recipient, message, classInfo);
    }
  }

  async sendConsole(recipient, message, classInfo) {
    console.log('📱 NOTIFICATION:', {
      timestamp: new Date().toISOString(),
      method: 'console',
      recipient,
      classId: classInfo._id,
      subject: classInfo.title || classInfo.subject,
      time: classInfo.startTime,
      location: classInfo.location,
      message
    });
    return true;
  }

  async sendWhatsApp(recipient, message, classInfo) {
    // TODO: Implement WhatsApp sending when library issues are resolved
    console.log('📱 WhatsApp notification (placeholder):', {
      recipient,
      message,
      classInfo: {
        id: classInfo._id,
        subject: classInfo.title || classInfo.subject,
        time: classInfo.startTime,
        location: classInfo.location
      }
    });
    return true;
  }

  async sendEmail(recipient, message, classInfo) {
    // TODO: Implement email sending
    console.log('📧 Email notification (placeholder):', {
      recipient,
      message,
      classInfo: {
        id: classInfo._id,
        subject: classInfo.title || classInfo.subject,
        time: classInfo.startTime,
        location: classInfo.location
      }
    });
    return true;
  }
}

const notificationService = new NotificationService(NOTIFICATION_METHOD);

// Run every minute to check for classes starting in ~30 minutes
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const plus29 = new Date(now.getTime() + 29 * 60 * 1000);
    const plus31 = new Date(now.getTime() + 31 * 60 * 1000);

    // Find classes that start in ~30 minutes and haven't been notified
    const pending = await ClassSession.find({
      notificationSent: false,
      startTime: { $gte: plus29, $lte: plus31 }
    });

    for (const cls of pending) {
      try {
        const adminPhone = process.env.ADMIN_PHONE;
        if (!adminPhone) {
          console.warn('⚠️ ADMIN_PHONE not configured — skipping notification');
          continue;
        }

        const startLocal = new Date(cls.startTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });
        const body = `⏰ Class Reminder: ${cls.title || cls.subject} (${cls.type}) at ${startLocal} in ${cls.location} — starts in ~30 minutes.`;

        await notificationService.sendNotification(adminPhone, body, cls);

        cls.notificationSent = true;
        await cls.save();

        console.log('✅ Notification sent:', {
          classId: cls._id,
          subject: cls.title || cls.subject,
          time: startLocal,
          location: cls.location,
          recipient: adminPhone,
          method: NOTIFICATION_METHOD
        });
      } catch (err) {
        console.error('❌ Failed to send notification for', cls._id, ':', err.message);
      }
    }
  } catch (err) {
    console.error('❌ Scheduler error:', err.message);
  }
});

console.log('⏰ Notification scheduler initialized - checking every minute for classes starting in 30 minutes');

module.exports = notificationService;