from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy import Table, Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from config import db, bcrypt

from flask import current_app
from flask_login import UserMixin
# from werkzeug.urls import url_decode
# User-Hero association table for many-to-many relationship

# User model for authentication
class User(db.Model,UserMixin, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    rank = db.Column(db.String(20))
    battle_tag = db.Column(db.String(40))
    main_hero = db.Column(db.String(100))
    most_played = db.Column(db.String(100))
    role = db.Column(db.String(20))
    playstyle = db.Column(db.String(20))

    # Define relationships
    posts = relationship('Post', back_populates='author')
    heroes = relationship('Hero', secondary='user_hero_association', back_populates='users')
    comments = relationship('Comment', back_populates='user')       
    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'rank': self.rank,
            'battle_tag': self.battle_tag,
            'main_hero': self.main_hero,
            'most_played': self.most_played,
            'role': self.role,
            'playstyle': self.playstyle
            # Add other fields as needed
        }

    def check_password(self, password):
         return bcrypt.check_password_hash(self.password, password)
    def set_password(self, password):
         self.password = bcrypt.generate_password_hash(password).decode('utf-8')
    # Serialize method for converting the model to a dictionary
  

# Add other fields as needed

class Hero(db.Model, SerializerMixin):
    __tablename__ = 'heroes'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    lore = Column(String(300), nullable=False)
    role = Column(String(20), nullable=False)
    health = Column(Integer, nullable=False)

    # Serialize method for converting the model to a dictionary
    

    # Define relationships
    users = relationship('User', secondary='user_hero_association', back_populates='heroes')

# Define a many-to-many association table for users and heroes
user_hero_association = Table(
    'user_hero_association',
    db.Model.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('hero_id', Integer, ForeignKey('heroes.id'))
)

class Post(db.Model, SerializerMixin):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    content = Column(Text, nullable=False)
    username = Column(Integer, ForeignKey('users.username'), nullable=False)
    timestamp = Column(DateTime, nullable=False)

    # Define relationships
    author = relationship('User', back_populates='posts')
    comments = relationship('Comment', back_populates='post')

    # Serialize method for converting the model to a dictionary
   

class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    text = db.Column(db.String(255), nullable=False)

    post = db.relationship('Post', back_populates='comments')
    user = db.relationship('User', back_populates='comments')
