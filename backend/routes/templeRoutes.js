const express = require('express');
const {
  getTemples,
  getTempleById,
  addTemple,
  updateTemple,
  deleteTemple,
} = require('../controllers/templeController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getTemples)
  .post(protect, authorize('admin'), addTemple);

router
  .route('/:id')
  .get(getTempleById)
  .put(protect, authorize('admin', 'temple_manager'), updateTemple)
  .delete(protect, authorize('admin'), deleteTemple);

module.exports = router;
