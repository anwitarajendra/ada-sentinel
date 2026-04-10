import os
import requests
import numpy as np
import xgboost as xgb
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from .database import get_db
from . import models

app = FastAPI(title="ADA Sentinel - Risk Service")

risk_model = None

@app.on_event("startup")
def load_model():
    global risk_model

    model_path = os.path.join(os.path.dirname(__file__), "..", "risk_model.json")
    try:
        risk_model = xgb.XGBClassifier()
        risk_model.load_model(model_path)
        print("XGBoost model loaded successfully")
    except Exception as e:
        print(f"Error loading model: {e}")


def get_live_weather_signal(city="Bengaluru"):
    API_KEY = "37864687e473aa357b9afa621f8082f0"
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}"
    try:
        response = requests.get(url, timeout=5).json()
        condition = response['weather'][0]['main']
        mapping = {
            "Thunderstorm": 0.9, "Rain": 0.7, "Drizzle": 0.4, 
            "Snow": 0.8, "Clear": 0.1, "Clouds": 0.2
        }
        return mapping.get(condition, 0.3), condition
    except Exception:
        return 0.2, "Clear (Fallback)"

def get_live_traffic_signal(lat, lon):
    TOMTOM_KEY = "l9X1lfIqzbKCzrKnaDueMVMUWsxQyYRL" 
    url = f"https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point={lat}%2C{lon}&key={TOMTOM_KEY}"
    
    try:
        response = requests.get(url, timeout=5).json()
        flow = response.get("flowSegmentData", {})
        current_speed = flow.get("currentSpeed", 30)
        free_flow = flow.get("freeFlowSpeed", 30)
        
        if free_flow == 0: return 0.25
        
        traffic_impact = max(0.0, min(1.0, 1 - (current_speed / free_flow)))
        return round(float(traffic_impact), 2)
    except Exception as e:
        print(f"Traffic API Error: {e}")
        return 0.25 

def get_risk_category(score: float) -> str:
    if score >= 0.75: return "HIGH"
    elif score >= 0.40: return "MEDIUM"
    return "LOW"

def get_recommended_message(category: str) -> str:
    messages = {
        "HIGH": "High failure risk. WhatsApp triage triggered — customer contacted.",
        "MEDIUM": "Moderate risk. Driver flagged to verify address and call on arrival.",
        "LOW": "Low risk. Delivery is on track.",
    }
    return messages.get(category, "No action required.")


@app.post("/predict")
def predict_risk(delivery_id: int, customer_id: int, db: Session = Depends(get_db)):
    if risk_model is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet.")

    delivery = db.query(models.Delivery).filter(models.Delivery.id == delivery_id).first()
    customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()

    if not delivery or not customer:
        raise HTTPException(status_code=404, detail="Data not found.")

    weather_score, weather_desc = get_live_weather_signal("Bengaluru")
    traffic_score = get_live_traffic_signal(customer.latitude, customer.longitude)
    history_score = float(customer.history_score)

    features = np.array([[weather_score, traffic_score, history_score]])
    raw_prob = risk_model.predict_proba(features)[0][1]
    risk_score = round(float(raw_prob), 4)

    delivery.risk_score = risk_score
    delivery.signals = {
        "weather_impact": weather_score,
        "traffic_delay": traffic_score,
        "customer_history": history_score,
        "weather_desc": weather_desc
    }
    db.commit()

    category = get_risk_category(risk_score)
    return {
        "status": "success",
        "data": {
            "customer": customer.name,
            "risk_score": risk_score,
            "risk_category": category,
            "live_metrics": {"weather": weather_desc, "traffic": traffic_score},
            "recommended_message": get_recommended_message(category)
        }
    }

@app.post("/deliveries/{delivery_id}/verify")
async def verify_delivery_photo(delivery_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    mock_url = f"https://sentinel-storage.com/proofs/{file.filename}"

    delivery = db.query(models.Delivery).filter(models.Delivery.id == delivery_id).first()
    if not delivery:
        raise HTTPException(status_code=404, detail="Delivery not found.")

    delivery.status = "COMPLETED"
    delivery.proof_image_url = mock_url
    delivery.verification_score = 0.98
    db.commit()

    return {
        "status": "verified",
        "message": "Package detected. Delivery marked as COMPLETED.",
        "image_url": mock_url
    }


@app.get("/deliveries/all")
def get_all_deliveries(db: Session = Depends(get_db)):
    results = db.query(models.Delivery).all()
    output = []
    for d in results:
        output.append({
            "delivery_id": d.id,
            "status": d.status,
            "risk_score": d.risk_score,
            "customer_details": {
                "name": d.customer.name,
                "address": d.customer.address,
                "lat": d.customer.latitude,
                "lon": d.customer.longitude
            }
        })
    return {"status": "success", "count": len(output), "deliveries": output}

class CustomerCreate(BaseModel):
    name: str
    phone_number: str
    address: str
    latitude: float
    longitude: float

@app.post("/customers/register")
def register_customer(customer_in: CustomerCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Customer).filter(models.Customer.phone_number == customer_in.phone_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Phone number already registered")

    new_customer = models.Customer(
        name=customer_in.name,
        phone_number=customer_in.phone_number,
        address=customer_in.address,
        latitude=customer_in.latitude,
        longitude=customer_in.longitude,
        history_score=0.25
    )
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return {"status": "success", "customer_id": new_customer.id}

@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": risk_model is not None}