
const Subscription = require('../models/Subscription');
const asyncHandler = require('../middleware/async');

// @desc      Create new subscription
// @route     POST /api/subscriptions
// @access    Private
exports.createSubscription = asyncHandler(async (req, res, next) => {
  req.body.userId = req.user.id;
  
  // Calculate next delivery date (e.g., 7 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  req.body.nextDeliveryDate = deliveryDate.toISOString().split('T')[0];

  const { id, userId, templeNameKey, prasadNameKey, frequency, price, fullName, phoneNumber, address, nextDeliveryDate } = req.body;
  
  const subscription = await Subscription.create({
    id,
    userId,
    templeNameKey,
    prasadNameKey,
    frequency,
    price,
    fullName,
    phoneNumber,
    address,
    nextDeliveryDate
  });

  res.status(201).json({
    success: true,
    data: subscription,
  });
});

// @desc      Get all subscriptions for a user
// @route     GET /api/subscriptions/my-subscriptions
// @access    Private
exports.getUserSubscriptions = asyncHandler(async (req, res, next) => {
  const subscriptions = await Subscription.find({ userId: req.user.id });

  res.status(200).json({
    success: true,
    count: subscriptions.length,
    data: subscriptions,
  });
});
