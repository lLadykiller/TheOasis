#!/usr/bin/env python3
# from werkzeug.exceptions import Unauthorized
# from werkzeug.urls import url_decode
# Standard library imports

# Remote library imports

from flask import Flask, request, render_template, redirect, url_for, jsonify, flash, make_response
from flask_restful import Resource, reqparse
from flask_login import LoginManager, login_required, current_user, logout_user, login_user
from datetime import datetime
from models import User, Post, Comment, Hero
# Local imports
from config import app, db, api

# Add your model imports

login_manager = LoginManager(app)

# Views go here!



# Define the login route
login_parser = reqparse.RequestParser()
login_parser.add_argument('username', type=str, required=True)
login_parser.add_argument('password', type=str, required=True)
@login_manager.user_loader
def load_user(user_id):
    # Retrieve the user from the database based on user_id
    return User.query.get(int(user_id))


class CreatePost(Resource):
    def post(self):
        data = request.get_json()

      # Get the current user's username (modify this part based on your authentication system)
        username = "LadyKiller"

        new_post = Post(
        title=data.get('title'),
        content=data.get('content'),
        username=username,  # Set the username to the current user's username
        timestamp=datetime.utcnow()
    )


        # Add the new post to the database
        db.session.add(new_post)
        db.session.commit()

        return {"message": "Post created successfully", "post": new_post.serialize()}, 201
api.add_resource(CreatePost, '/post')

class CreateUser(Resource):
    def post(self):
        user_data = request.get_json()

        new_user = User(
            email=user_data.get('email'),
            password=user_data.get('password'),  # In production, hash the password
            username=user_data.get('username'),
            rank=user_data.get('rank'),
            battle_tag=user_data.get('battle_tag'),
            main_hero=user_data.get('main_hero'),
            most_played=user_data.get('most_played'),
            role=user_data.get('role'),
            playstyle=user_data.get('playstyle')
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify(message="User created successfully", user=new_user.serialize()), 201


class UserDelete(Resource):
    def delete(self, user_id):
        user = User.query.get(user_id)  # Query the user by ID
        if user:
            db.session.delete(user)  # Mark the user for deletion
            db.session.commit()  # Commit the transaction
            return {'message': 'User deleted successfully'}
        else:
            return {'message': 'User not found'}, 404

api.add_resource(UserDelete, '/users/<int:user_id>')


@app.route('/signup', methods=['POST'])
def signup():
    try:
        user_data = request.get_json()
        
        email = user_data.get('email')
        password = user_data.get('password')  # You should hash the password before storing it
        username = user_data.get('username')
        # Add other user data fields as needed
        
        # Check if the email or username is already in use
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify(error="Email already in use"), 400

        existing_username = User.query.filter_by(username=username).first()
        if existing_username:
            return jsonify(error="Username already in use"), 400
        
        new_user = User(email=email, password=password, username=username)
        # Add other user data fields to the new_user
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify(message="User signed up successfully"), 201
    except Exception as e:
        return jsonify(error="Failed to sign up: " + str(e)), 500


@app.route('/login', methods=['POST'])
def login():
    try:
        user_data = request.get_json()
        username = user_data.get('username')
        password = user_data.get('password')

        # Find the user by username
        user = User.query.filter_by(username=username).first()

        if user and check_password_hash(user.password, password):
            # If the user exists and the password is correct, create an access token
            access_token = create_access_token(identity=user.id)
            return jsonify(message="Login successful", access_token=access_token), 200
        else:
            return jsonify(error="Invalid username or password"), 401
    except Exception as e:
        return jsonify(error="Failed to log in: " + str(e)), 500


# Define the logout route
@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logged out successfully', 'success')
    return redirect(url_for('index'))  # Replace 'index' with your main page


# working
class Users(Resource):
    def get(self):
        users = [
            user.to_dict(
                rules=("-posts","-heros", "-friendships",)
               
            )
            for user in User.query.all()
        ]
        return make_response(users, 200)


api.add_resource(Users, "/users")


# working
@app.route('/user/create', methods=['POST'])
def create_user():
    # Retrieve user data from the request
    user_data = request.json  # Assuming the data is sent as JSON

    # Create a new user based on the provided data
    new_user = User(
        email=user_data.get('email'),
        password=user_data.get('password'),  # In production, hash the password
        username=user_data.get('username'),
        rank=user_data.get('rank'),
        battle_tag=user_data.get('battle_tag'),
        main_hero=user_data.get('main_hero'),
        most_played=user_data.get('most_played'),
        role=user_data.get('role'),
        playstyle=user_data.get('playstyle')
    )

    # Add the new user to the database
    db.session.add(new_user)
    db.session.commit()

    # You can return a response to indicate success or provide additional data
    return jsonify(message="User created successfully", user=new_user.serialize())

@app.route('/heroes', methods=['GET'])
def get_heroes():
    try:
        # Query the database to get all heroes
       
        heroes = Hero.query.all()
        heroes_data = [hero.serialize() for hero in heroes]
        return jsonify(heroes_data), 200
 # Return the hero data as JSON
    except Exception as e:
        return jsonify(error="Failed to retrieve heroes: " + str(e)), 500


# Route to fetch and save hero data
@app.route('/heroes', methods=['POST'])
def create_hero():
    try:
        hero_data = request.get_json()
        
        
        image = hero_data.get('image')
        name = hero_data.get('name')
        description = hero_data.get('description')
        role = hero_data.get('role')
        health = hero_data.get('health')
       
        new_hero = Hero(name=name, description=description, role=role, health=health, image=image)

        db.session.add(new_hero)
        db.session.commit()

        return jsonify(message="Hero created successfully"), 201  # Return 201 for created status
    except Exception as e:
        return jsonify(error="Failed to create hero: " + str(e)), 500



@app.route('/users/<int:user_id>', methods=['PATCH'])
def edit_user(user_id):
    # Query the database for the user with the provided user_id
    user = User.query.get(user_id)
    
    if user:
        data = request.get_json()
        
        # Update the user fields with the new data
        user.username = data.get('username', user.username)
        user.rank = data.get('rank', user.rank)
        user.battle_tag = data.get('battle_tag', user.battle_tag)
        user.main_hero = data.get('main_hero', user.main_hero)
        user.most_played = data.get('most_played', user.most_played)
        user.role = data.get('role', user.role)
        user.playstyle = data.get('playstyle', user.playstyle)
        # Add more fields as needed
        
        db.session.commit()  # Commit the changes
        
        return jsonify(message='User edited successfully', user=user.serialize())
    else:
        return jsonify(error='User not found'), 404


@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    # Query the database for the user with the provided user_id
    user = User.query.get(user_id)
    
    if user:
        db.session.delete(user)  # Mark the user for deletion
        db.session.commit()  # Commit the transaction
        return jsonify(message='User deleted successfully')
    else:
        return jsonify(error='User not found'), 404
    
    
    
@app.route('/comments', methods=['POST'])
def create_comment():
    try:
        data = request.get_json()
        user_id = data.get('user_id')  # Obtain the user's ID
        post_id = data.get('post_id')  # Obtain the post's ID
        text = data.get('text')  # Extract the comment text

        # Check if the user and post exist (perform similar checks for authorization)
        user = User.query.get(user_id)
        post = Post.query.get(post_id)

        if user and post:
            # Create a new comment and associate it with the user and post
            new_comment = Comment(user_id=user_id, post_id=post_id, text=text)
            db.session.add(new_comment)
            db.session.commit()

            return jsonify(message='Comment created successfully', comment=new_comment.serialize()), 201
        else:
            return jsonify(error='User or post not found'), 404
    except Exception as e:
        return jsonify(error="Failed to create a comment: " + str(e)), 500

@app.route('/comments/<int:comment_id>', methods=['PATCH'])
def edit_comment(comment_id):
    try:
        data = request.get_json()
        text = data.get('text')  # Extract the new comment text

        comment = Comment.query.get(comment_id)
        if comment:
            # Check if the user is authorized to edit this comment (add your own logic here)

            # Update the comment text
            comment.text = text
            db.session.commit()

            return jsonify(message='Comment edited successfully', comment=comment.serialize())
        else:
            return jsonify(error='Comment not found'), 404
    except Exception as e:
        return jsonify(error="Failed to edit the comment: " + str(e)), 500

@app.route('/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    try:
        comment = Comment.query.get(comment_id)
        if comment:
            # Check if the user is authorized to delete this comment (add your own logic here)

            db.session.delete(comment)
            db.session.commit()
            return jsonify(message='Comment deleted successfully')
        else:
            return jsonify(error='Comment not found'), 404
    except Exception as e:
        return jsonify(error="Failed to delete the comment: " + str(e)), 500
    
    
@app.route('/heroes/<int:hero_id>', methods=['DELETE'])
def delete_hero(hero_id):
        try:
            # Query the database for the hero with the provided hero_id
            hero = Hero.query.get(hero_id)

            if hero:
                db.session.delete(hero)  # Mark the hero for deletion
                db.session.commit()  # Commit the transaction
                return jsonify(message='Hero deleted successfully')
            else:
                return jsonify(error='Hero not found'), 404
        except Exception as e:
            return jsonify(error="Failed to delete the hero: " + str(e)), 500
    
    
if __name__ == '__main__':
    app.run(port=5555, debug=True)

