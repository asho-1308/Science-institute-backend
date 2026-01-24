const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();

console.log('🚀 Starting WhatsApp Test Client...');

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'test-client' }),
  puppeteer: { headless: true }
});

client.on('qr', (qr) => {
  console.log('\n📱 Scan this QR code with WhatsApp:');
  qrcode.generate(qr, { small: true });
  console.log('\n⏳ Waiting for QR scan...');
});

client.on('ready', async () => {
  console.log('✅ WhatsApp client ready!');

  const adminPhone = process.env.ADMIN_PHONE;
  if (!adminPhone) {
    console.log('❌ ADMIN_PHONE not configured in .env');
    return;
  }

  const raw = adminPhone.replace(/\D/g, '');
  const chatId = `${raw}@c.us`;

  console.log(`📤 Sending test message to: ${adminPhone}`);

  try {
    const testMessage = `🧪 WhatsApp Test Message\n⏰ ${new Date().toLocaleString()}\n✅ Connection successful!\n📱 Timetable App WhatsApp integration working`;

    await client.sendMessage(chatId, testMessage);
    console.log('✅ Test message sent successfully!');

    // Send another message with notice test
    const noticeTest = `📢 Notice Test\n🖼️ Image support ready\n📅 Date: ${new Date().toLocaleDateString()}\n⏰ Time: ${new Date().toLocaleTimeString()}`;

    await client.sendMessage(chatId, noticeTest);
    console.log('✅ Notice test message sent!');

  } catch (error) {
    console.error('❌ Failed to send message:', error.message);
  }

  console.log('\n🎉 Test complete! Check your WhatsApp for messages.');
  console.log('💡 If you received messages, WhatsApp integration is working!');

  // Exit after 5 seconds
  setTimeout(() => {
    console.log('👋 Closing test client...');
    client.destroy();
    process.exit(0);
  }, 5000);
});

client.on('auth_failure', (msg) => {
  console.error('❌ Authentication failed:', msg);
});

client.on('disconnected', (reason) => {
  console.log('📴 WhatsApp disconnected:', reason);
});

console.log('🔄 Initializing WhatsApp client...');
client.initialize();