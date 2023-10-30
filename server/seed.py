#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker
from config import db, app  # Import your Flask app's database instance
from models import User  # Import your User model
from models import Hero, Post, Friendship  # Import your model classes

# Sample hero data
with app.app_context():
    db.create_all()
    fake = Faker()

   

if __name__ == '__main__':
    print("Seed data has been added to the database.")