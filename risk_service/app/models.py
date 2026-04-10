from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone_number = Column(String)
    address = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    missed_delivery_count = Column(Integer, default=0)
    history_score = Column(Float, default=0.0)
    
    deliveries = relationship("Delivery", back_populates="customer")

class Delivery(Base):
    __tablename__ = "deliveries"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    risk_score = Column(Float, default=0.0)
    signals = Column(JSON, default={})

    status = Column(String, default="PENDING") 
    proof_image_url = Column(String, nullable=True) 
    verification_score = Column(Float, nullable=True) 

    customer = relationship("Customer", back_populates="deliveries")

class Driver(Base):
    __tablename__ = "drivers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    rating = Column(Float)