const Temple = require('../models/Temple');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Get all temples
// @route     GET /api/temples
// @access    Public
exports.getTemples = asyncHandler(async (req, res, next) => {
  const temples = await Temple.find();
  res.status(200).json({ success: true, count: temples.length, data: temples });
});

// @desc      Get single temple by custom ID
// @route     GET /api/temples/:id
// @access    Public
exports.getTempleById = asyncHandler(async (req, res, next) => {
  const temple = await Temple.findOne({ id: req.params.id });

  if (!temple) {
    return next(new ErrorResponse(`Temple not found with id of ${req.params.id}`, 404));
  }
  res.status(200).json({ success: true, data: temple });
});

// @desc      Add a new temple
// @route     POST /api/temples
// @access    Private/Admin
exports.addTemple = asyncHandler(async (req, res, next) => {
    // Find the highest existing temple ID to auto-increment
    const lastTemple = await Temple.findOne().sort({ id: -1 });
    const nextId = lastTemple ? lastTemple.id + 1 : 1;
    
    const templeDataWithId = { ...req.body, id: nextId };

    const temple = await Temple.create(templeDataWithId);
    res.status(201).json({ success: true, data: temple });
});


// @desc      Update a temple
// @route     PUT /api/temples/:id
// @access    Private/Admin
exports.updateTemple = asyncHandler(async (req, res, next) => {
    let temple = await Temple.findOne({ id: req.params.id });

    if (!temple) {
        return next(new ErrorResponse(`Temple not found with id of ${req.params.id}`, 404));
    }

    // For temple managers, ensure they only edit their assigned temple
    if (req.user.role === 'temple_manager' && temple.id !== req.user.assignedTempleId) {
         return next(new ErrorResponse(`User is not authorized to update this temple`, 403));
    }

    temple = await Temple.findOneAndUpdate({ id: req.params.id }, req.body, {
        new: true,
        runValidators: true
    });
    
    res.status(200).json({ success: true, data: temple });
});

// @desc      Delete a temple
// @route     DELETE /api/temples/:id
// @access    Private/Admin
exports.deleteTemple = asyncHandler(async (req, res, next) => {
    const temple = await Temple.findOne({ id: req.params.id });

    if (!temple) {
        return next(new ErrorResponse(`Temple not found with id of ${req.params.id}`, 404));
    }
    
    await temple.deleteOne(); // Use deleteOne on the document instance
    
    res.status(200).json({ success: true, data: {} });
});