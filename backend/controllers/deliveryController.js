const { deliveries } = require('../data/store');
const { getRiskData } = require('../services/riskService');
const { sendWhatsAppMessage } = require('../services/whatsappService');


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

    delivery.last_message_type = risk_type;

    deliveries.push(delivery);

    // WhatsApp Trigger Logic
    if (risk_score > 75) {

        let message = "";
    
        if (risk_type === "customer_unavailable") {
            message = `SwiftLane Delivery Update
    
    Delivery ID: ${delivery.id}
    
    Your order is scheduled for delivery soon.
    
    Will you be available?
    
    1. Available
    2. Leave at gate
    3. Handover to watchman
    4. Reschedule`;
        } 
        else if (risk_type === "delay") {
            message = `SwiftLane Delivery Alert
    
    Delivery ID: ${delivery.id}
    
    Your delivery may be delayed by ~2 hours due to traffic or weather conditions.
    
     How would you like to proceed?
    
    1. Continue anyway
    2. Reschedule`;
        }
    
        console.log("Triggering WhatsApp for delivery:", delivery.id);
    
        sendWhatsAppMessage(phone, message);
    }

    res.json(delivery);
};

exports.getDeliveries = (req, res) => {
    res.json(deliveries);
};