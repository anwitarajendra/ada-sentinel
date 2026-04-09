function getRiskData() {
    const risk_score = Math.floor(Math.random() * 100);

    let risk_type = "safe";

    if (risk_score > 75) {
        risk_type = Math.random() > 0.5 
            ? "customer_unavailable" 
            : "delay";
    }

    return { risk_score, risk_type };
}

module.exports = { getRiskData };