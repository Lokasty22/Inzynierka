const express = require('express');
const router = express.Router();
const { getLatestReviews } = require('../controllers/reviewController');

router.get('/', getLatestReviews);

module.exports = router;
