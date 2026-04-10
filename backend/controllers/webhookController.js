const { deliveries } = require('../data/store'); // make sure this is shared

exports.handleIncomingMessage = (req, res) => {
    const msg = req.body.Body.toLowerCase();
    const from = req.body.From;

    console.log("Incoming message:", msg);
    console.log("From:", from);

    // Extract phone number
    const phone = from.replace('whatsapp:+91', '');

    // Find delivery for this user
    const delivery = deliveries.find(d => d.phone === phone);

    let response = "";

    if (delivery) {

        // 📦 Case 1: Customer availability
        if (delivery.last_message_type === "customer_unavailable") {

            if (msg === "1" || msg.includes("available")) {
                response = "Delivery will proceed as planned.";
                delivery.status = "Confirmed";
            }
            else if (msg === "2" || msg.includes("gate")) {
                response = "Package will be left at the gate.";
                delivery.status = "Leave at gate";
            }
            else if (msg === "3" || msg.includes("watchman")) {
                response = "Package will be handed to watchman.";
                delivery.status = "Hand to watchman";
            }
            else {
                response = "Please reply with 1, 2, or 3.";
            }

        }

        // 🌧️ Case 2: Delay handling
        else if (delivery.last_message_type === "delay") {

            if (msg === "1" || msg.includes("continue")) {
                response = "Delivery will proceed despite delay.";
                delivery.status = "Continue";
            }
            else if (msg === "2" || msg.includes("reschedule")) {
                response = "Your delivery has been rescheduled.";
                delivery.status = "Rescheduled";
            }
            else {
                response = "Please reply with 1 or 2.";
            }

        }

        // Fallback if no context
        else {
            response = "Unable to determine request context.";
        }

    } else {
        response = "Delivery not found.";
    }

    // Send reply back to WhatsApp
    res.send(`<Response><Message>${response}</Message></Response>`);
};