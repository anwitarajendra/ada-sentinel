const { getRiskData } = require('../services/riskService');

let deliveries = []; // temporary storage

exports.createDelivery = (req, res) => {
    const { name, phone, lat, lng } = req.body;

    const { risk_score, risk_type } = getRiskData();

    const delivery = {
        id: deliveries.length + 1,
        name,
        phone,
        lat,
        lng,
        risk_score,
        risk_type,
        status: "Pending"
    };

    deliveries.push(delivery);

    res.json(delivery);
};

exports.getDeliveries = (req, res) => {
    res.json(deliveries);
};