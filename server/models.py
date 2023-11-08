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


class User(db.Model, UserMixin, SerializerMixin):
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
    posts = db.relationship('Post', back_populates='author')
    heroes = db.relationship(
        'Hero', secondary='user_hero_association', back_populates='users')
    comments = db.relationship('Comment', back_populates='user')

    serialize_rules = ("-posts", "-heroes, -password")
    # def serialize(self):
    #     return {
    #         'id': self.id,
    #         'email': self.email,
    #         'username': self.username,
    #         'rank': self.rank,
    #         'battle_tag': self.battle_tag,
    #         'main_hero': self.main_hero,
    #         'most_played': self.most_played,
    #         'role': self.role,
    #         'playstyle': self.playstyle
    #         # Add other fields as needed
    #     }

    def set_password(self, password):
        # Hash the password and store the hash
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        # Check if the provided password matches the stored hash
        return bcrypt.check_password_hash(self.password, password)
# Add other fields as needed


class Hero(db.Model, SerializerMixin):
    __tablename__ = 'heroes'

    id = db.Column(Integer, primary_key=True)
    name = db.Column(String(100), nullable=False)
    description = db.Column(String(300))  # Add the description field
    role = db.Column(String(20), nullable=False)
    health = db.Column(Integer, nullable=False)
    image = db.Column(String(255))
    # Serialize method for converting the model to a dictionary

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'role': self.role,
            'health': self.health,
            'image': self.image  # Include 'image' if you have an 'image' field
        }

    # Define relationships
    users = db.relationship(
        'User', secondary='user_hero_association', back_populates='heroes')


# Define a many-to-many association table for users and heroes
user_hero_association = Table(
    'user_hero_association',
    db.Model.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('hero_id', Integer, ForeignKey('heroes.id'))
)


class Post(db.Model, UserMixin, SerializerMixin):
    __tablename__ = 'posts'

    id = db.Column(Integer, primary_key=True)
    title = db.Column(String(100), nullable=False)
    content = db.Column(Text, nullable=False)
    username = db.Column(Integer, ForeignKey('users.username'), nullable=False)
    timestamp = db.Column(DateTime, nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'username': self.username,
            # Format the timestamp as a string
            'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }

    # Define relationships
    author = db.relationship('User', back_populates='posts')
    comments = db.relationship('Comment', back_populates='post')

    # Serialize method for converting the model to a dictionary


class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    text = db.Column(db.String(255), nullable=False)

    post = db.relationship('Post', back_populates='comments')
    user = db.relationship('User', back_populates='comments')

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'post_id': self.post_id,
            'text': self.text,
            # Add more fields as needed
        }
