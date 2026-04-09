const express = require('express');
const router = express.Router();

const {
    createDelivery,
    getDeliveries
} = require('../controllers/deliveryController');

router.post('/delivery', createDelivery);
router.get('/deliveries', getDeliveries);

module.exports = router;