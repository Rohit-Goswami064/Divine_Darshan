const express = require('express');
const { getUsers } = require('../controllers/userController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(protect, authorize('admin'), getUsers);

module.exports = router;
