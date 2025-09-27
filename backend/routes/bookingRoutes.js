const express = require('express');
const { createBooking, getUserBookings, getAllBookings } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Note: All routes here are protected
router.use(protect);

router.route('/').post(createBooking);
router.route('/my-bookings').get(getUserBookings);
router.route('/all').get(authorize('admin', 'temple_manager'), getAllBookings);


module.exports = router;
