const { getRiskData } = require('../services/riskService');
const { sendWhatsAppMessage } = require('../services/whatsappService');

let deliveries = [];

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

    // 🔥 WhatsApp Trigger Logic
    if (risk_score > 75) {

        let message = "";

        if (risk_type === "customer_unavailable") {
            message = `Your delivery will be out soon. Will you be available?

1. Available
2. Leave at gate
3. Handover to watchman`;
        } 
        else if (risk_type === "delay") {
            message = `Your delivery might be delayed by 2 hours.

1. Continue anyway
2. Reschedule`;
        }

        sendWhatsAppMessage(phone, message);
    }

    res.json(delivery);
};

exports.getDeliveries = (req, res) => {
    res.json(deliveries);
};