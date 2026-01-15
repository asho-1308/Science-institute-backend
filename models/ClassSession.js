const mongoose = require('mongoose');

const classSessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  location: { type: String, required: true },
  day: { type: String, required: true },
  teacher: { type: String, default: 'Sir' },
  type: {
    type: String,
    enum: ['Theory', 'Revision', 'Paper Class'],
    default: 'Theory',
  },
  medium: {
    type: String,
    enum: ['Tamil', 'English'],
    default: 'English',
  },
  category: {
    type: String,
    enum: ['PERSONAL', 'EXTERNAL'],
    default: 'EXTERNAL',
  },
  classNumber: {
    type: Number,
    required: false,
  },
  notificationSent: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('ClassSession', classSessionSchema);
