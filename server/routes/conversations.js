const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const tokenVerification = require('../middleware/tokenVerification');


router.get('/', tokenVerification, conversationController.getConversationsForUser);

router.post('/', tokenVerification, conversationController.sendMessage);

router.delete('/:id',tokenVerification, conversationController.deleteConversation);

router.get('/:id', tokenVerification, conversationController.getConversationDetails);


module.exports = router;
