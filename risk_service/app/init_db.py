import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from .database import engine, Base
from . import models

def init():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print(" Database tables recreated successfully!")

if __name__ == "__main__":
    init()
