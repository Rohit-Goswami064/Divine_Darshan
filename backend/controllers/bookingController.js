const Booking = require('../models/Booking');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Create new booking
// @route     POST /api/bookings
// @access    Private
exports.createBooking = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.userId = req.user.id;

  const booking = await Booking.create(req.body);

  res.status(201).json({
    success: true,
    data: booking,
  });
});

// @desc      Get all bookings for a user
// @route     GET /api/bookings/my-bookings
// @access    Private
exports.getUserBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ userId: req.user.id });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

// @desc      Get all bookings (Admin)
// @route     GET /api/bookings/all
// @access    Private/Admin
exports.getAllBookings = asyncHandler(async (req, res, next) => {
  let query;

  // If user is a temple manager, they can only see bookings for their assigned temple.
  if (req.user.role === 'temple_manager' && req.user.assignedTempleId) {
    // This is a simplistic lookup. In a real app, you might store templeId directly on booking.
    // For now, this is a placeholder for the logic.
    // query = Booking.find({ templeId: req.user.assignedTempleId });
    // Since we don't have templeId, we'll just show all for now, but this is where the logic would go.
    query = Booking.find();
  } else {
    query = Booking.find();
  }

  const bookings = await query.populate({
    path: 'userId',
    select: 'name email',
  });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});
