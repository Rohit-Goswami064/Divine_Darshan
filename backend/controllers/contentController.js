
const Testimonial = require('../models/Testimonial');
const Content = require('../models/Content');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// --- TESTIMONIALS ---

// @desc      Get all testimonials
// @route     GET /api/content/testimonials
// @access    Public
exports.getTestimonials = asyncHandler(async (req, res, next) => {
  const testimonials = await Testimonial.find();
  res.status(200).json({ success: true, data: testimonials });
});

// @desc      Add a testimonial
// @route     POST /api/content/testimonials
// @access    Private/Admin
exports.addTestimonial = asyncHandler(async (req, res, next) => {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: testimonial });
});

// @desc      Update a testimonial
// @route     PUT /api/content/testimonials/:id
// @access    Private/Admin
exports.updateTestimonial = asyncHandler(async (req, res, next) => {
    let testimonial = await Testimonial.findOne({ id: req.params.id });
    if (!testimonial) {
        return next(new ErrorResponse(`Testimonial not found with id of ${req.params.id}`, 404));
    }
    testimonial = await Testimonial.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: testimonial });
});

// @desc      Delete a testimonial
// @route     DELETE /api/content/testimonials/:id
// @access    Private/Admin
exports.deleteTestimonial = asyncHandler(async (req, res, next) => {
    const testimonial = await Testimonial.findOne({ id: req.params.id });
    if (!testimonial) {
        return next(new ErrorResponse(`Testimonial not found with id of ${req.params.id}`, 404));
    }
    await testimonial.deleteOne();
    res.status(200).json({ success: true, data: {} });
});


// --- SEASONAL EVENT ---

// @desc      Get seasonal event
// @route     GET /api/content/seasonalevent
// @access    Public
exports.getSeasonalEvent = asyncHandler(async (req, res, next) => {
    const event = await Content.findOne({ key: 'seasonalEvent' });
    if (!event) {
        // This should not happen if seeder runs, but as a fallback:
        return next(new ErrorResponse(`Seasonal event not configured`, 404));
    }
    res.status(200).json({ success: true, data: event.data });
});

// @desc      Update seasonal event
// @route     PUT /api/content/seasonalevent
// @access    Private/Admin
exports.updateSeasonalEvent = asyncHandler(async (req, res, next) => {
    const event = await Content.findOneAndUpdate(
        { key: 'seasonalEvent' }, 
        { data: req.body }, 
        { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: event.data });
});
