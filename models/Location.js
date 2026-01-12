const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['INTERNAL', 'EXTERNAL'],
  },
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
