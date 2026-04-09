const twilio = require('twilio');

const client = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH
);

async function sendWhatsAppMessage(to, message) {
    try {
        await client.messages.create({
            from: process.env.TWILIO_PHONE,
            to: `whatsapp:+91${to}`,
            body: message
        });

        console.log("Message sent successfully");

    } catch (error) {
        console.error("Error sending message:", error);
    }
}

module.exports = { sendWhatsAppMessage };