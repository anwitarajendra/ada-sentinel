const express = require('express');
const router = express.Router();

const { handleIncomingMessage } = require('../controllers/webhookController');

router.post('/webhook', handleIncomingMessage);

module.exports = router;