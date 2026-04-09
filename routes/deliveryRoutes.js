const express = require('express');
const router = express.Router();
const controller = require('../controllers/deliveryController');

router.post('/delivery', controller.createDelivery);
router.get('/deliveries', controller.getDeliveries);

module.exports = router;