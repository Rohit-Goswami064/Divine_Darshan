const Service = require('../models/Service');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Get all services
// @route     GET /api/services
// @access    Public
exports.getServices = asyncHandler(async (req, res, next) => {
  const services = await Service.find();
  res.status(200).json({ success: true, data: services });
});

// @desc      Add a service
// @route     POST /api/services
// @access    Private/Admin
exports.addService = asyncHandler(async (req, res, next) => {
    // Find the highest existing service ID to auto-increment
    const lastService = await Service.findOne().sort({ id: -1 });
    const nextId = lastService ? lastService.id + 1 : 1;
    
    const serviceDataWithId = { ...req.body, id: nextId };

    const service = await Service.create(serviceDataWithId);
    res.status(201).json({ success: true, data: service });
});

// @desc      Update a service
// @route     PUT /api/services/:id
// @access    Private/Admin
exports.updateService = asyncHandler(async (req, res, next) => {
    let service = await Service.findOne({ id: req.params.id });
    if (!service) {
        return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
    }
    service = await Service.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: service });
});

// @desc      Delete a service
// @route     DELETE /api/services/:id
// @access    Private/Admin
exports.deleteService = asyncHandler(async (req, res, next) => {
    const service = await Service.findOne({ id: req.params.id });
     if (!service) {
        return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
    }
    await service.deleteOne();
    res.status(200).json({ success: true, data: {} });
});