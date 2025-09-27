
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  id: {
    type: String, // transactionId
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  pujaNameKey: {
    type: String,
    required: true,
  },
  templeNameKey: {
    type: String,
    required: true,
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: true,
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Completed', 'Cancelled'],
    default: 'Confirmed',
  },
  price: {
    type: Number,
    required: true,
  },
  isEPuja: {
    type: Boolean,
    default: false,
  },
  liveStreamLink: {
    type: String,
  },
  numDevotees: {
    type: Number,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Booking', BookingSchema);
