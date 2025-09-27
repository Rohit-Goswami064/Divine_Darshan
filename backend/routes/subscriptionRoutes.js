
const express = require('express');
const { createSubscription, getUserSubscriptions } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').post(createSubscription);
router.route('/my-subscriptions').get(getUserSubscriptions);

module.exports = router;
