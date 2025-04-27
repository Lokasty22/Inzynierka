const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const tokenVerification = require('../middleware/tokenVerification');

router.post('/', tokenVerification, messageController.sendMessage);

module.exports = router;
