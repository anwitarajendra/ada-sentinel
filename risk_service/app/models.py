from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from .database import Base

class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer)
    driver_id = Column(Integer)
    status = Column(String, default="pending")
    risk_score = Column(Float, default=0.0)
    signals = Column(JSONB)  # Example: {"weather_impact": 0.8, "traffic_delay": 0.6}
    created_at = Column(DateTime, default=datetime.utcnow)