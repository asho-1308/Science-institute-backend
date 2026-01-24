const cron = require('node-cron');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const ClassSession = require('./models/ClassSession');

// Environment variables:
// ADMIN_PHONE (E.164, e.g., +919812345678) - recipient admin number
// SCHEDULER_ENABLED (optional) - set to 'false' to disable scheduler

const SCHEDULER_ENABLED = process.env.SCHEDULER_ENABLED !== 'false';

if (!SCHEDULER_ENABLED) {
  console.log('WhatsApp scheduler disabled (SCHEDULER_ENABLED=false)');
  module.exports = null;
  return;
}

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'scheduler' }),
  puppeteer: { headless: true }
});

client.on('qr', (qr) => {
  console.log('WhatsApp QR received — scan with admin phone');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ WhatsApp client ready — scheduler starting');

  // Send a test message when ready
  const adminPhone = process.env.ADMIN_PHONE;
  if (adminPhone) {
    const raw = adminPhone.replace(/\D/g, '');
    const chatId = `${raw}@c.us`;
    const testMessage = `🤖 WhatsApp Bot Connected!\n📅 Timetable App Scheduler Active\n⏰ Monitoring for class reminders\n📱 Admin: ${adminPhone}`;

    client.sendMessage(chatId, testMessage)
      .then(() => console.log('✅ Test message sent to admin'))
      .catch(err => console.error('❌ Failed to send test message:', err.message));
  }

  // Run every minute
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
            console.warn('ADMIN_PHONE not configured — skipping notification');
            continue;
          }

          // whatsapp-web.js expects numbers like '9198xxxxxxx@c.us' (no leading +)
          const raw = adminPhone.replace(/\D/g, '');
          const chatId = `${raw}@c.us`;

          const startLocal = new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const body = `Reminder: ${cls.title || cls.subject} (${cls.type}) at ${startLocal} in ${cls.location} — starts in ~30 minutes.`;

          await client.sendMessage(chatId, body);
          cls.notificationSent = true;
          await cls.save();
          console.log('✅ WhatsApp reminder sent:', {
            classId: cls._id,
            subject: cls.title || cls.subject,
            time: startLocal,
            location: cls.location,
            recipient: adminPhone
          });
        } catch (err) {
          console.error('Failed to send reminder for', cls._id, err && err.message);
        }
      }
    } catch (err) {
      console.error('Scheduler error:', err && err.message);
    }
  });
});

client.initialize();

module.exports = client;
