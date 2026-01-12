
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const timetableSchema = new Schema({
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  location: { type: String, required: true },
}, {
  timestamps: true,
});

const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = Timetable;
