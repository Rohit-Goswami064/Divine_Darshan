
const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  id: { // razorpay_payment_id
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  templeNameKey: {
    type: String,
    required: true,
  },
  prasadNameKey: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    enum: ['Monthly', 'Quarterly'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Cancelled'],
    default: 'Active',
  },
  price: {
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
  address: {
    type: String,
    required: true,
  },
  nextDeliveryDate: {
    type: String, // YYYY-MM-DD
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);