from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .database import get_db, engine
from . import models

# This line tries to create the tables in the database
# If the database isn't running yet, this might cause an error when you start the server
#models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ADA Sentinel - Risk Service")

@app.get("/")
def root():
    return {"status": "ADA Sentinel Risk Service is live "}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
def predict_risk(delivery_id: int, db: Session = Depends(get_db)):
    # Dummy score for now — real ML model comes next
    dummy_score = 42.0
    dummy_signals = {
        "weather_impact": 0.3,
        "traffic_delay": 0.5,
        "customer_history": 0.2
    }

    
    delivery = db.query(models.Delivery).filter(models.Delivery.id == delivery_id).first()
    
    if not delivery:
        return {"error": "Delivery not found"}

    delivery.risk_score = dummy_score
    delivery.signals = dummy_signals
    #db.commit()

    return {
        "delivery_id": delivery_id,
        "risk_score": dummy_score,
        "signals": dummy_signals
    }