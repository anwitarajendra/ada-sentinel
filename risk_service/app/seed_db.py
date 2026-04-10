from .database import SessionLocal
from . import models

def seed():
    db = SessionLocal()
    
    print("Cleaning existing database records...")
    db.query(models.Delivery).delete()
    db.query(models.Customer).delete()
    db.query(models.Driver).delete()
    db.commit()

    print("Seeding Drivers...")
    drivers = [
        models.Driver(name="Rajesh Mani", rating=4.8),
        models.Driver(name="Amit Singh", rating=4.5),
        models.Driver(name="Suresh Rao", rating=4.9)
    ]
    db.add_all(drivers)
    db.commit()

    print("Seeding Customers...")
    customers = [
        models.Customer(
            name="Aravind Kumar", 
            phone_number="9876543210", 
            address="Indiranagar", 
            latitude=12.9716, 
            longitude=77.6412, 
            history_score=0.15
        ),
        models.Customer(
            name="Priya Sharma", 
            phone_number="9876543211", 
            address="Whitefield", 
            latitude=12.9698, 
            longitude=77.7499, 
            history_score=0.65
        ),
        models.Customer(
            name="Sita Ram", 
            phone_number="9876543212", 
            address="HSR Layout", 
            latitude=12.9101, 
            longitude=77.6450, 
            history_score=0.82
        ),
        models.Customer(
            name="Ananya Iyer", 
            phone_number="9876543213", 
            address="MG Road", 
            latitude=12.9756, 
            longitude=77.5946, 
            history_score=0.10
        ),
        models.Customer(
            name="Vikram Singh", 
            phone_number="9876543214", 
            address="Hebbal", 
            latitude=13.0354, 
            longitude=77.5988, 
            history_score=0.45
        ),
        models.Customer(
            name="Sanjay Gupta", 
            phone_number="9876543215", 
            address="Malleshwaram", 
            latitude=12.9972, 
            longitude=77.5710, 
            history_score=0.30
        )
    ]
    db.add_all(customers)
    db.commit() 

    print("Creating initial PENDING deliveries...")
    for c in customers:
        db.add(models.Delivery(
            customer_id=c.id, 
            status="PENDING", 
            risk_score=0.0,
            signals={}
        ))
    
    db.commit()
    db.close()
    print("\nDatabase Successfully Seeded!")
    print(f"   - {len(drivers)} Drivers added.")
    print(f"   - {len(customers)} Customers added.")
    print(f"   - {len(customers)} Deliveries created.")

if __name__ == "__main__":
    seed()