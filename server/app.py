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



class CreatePost(Resource):
    def post(self):
        data = request.get_json()

        # Get the current user (modify this part based on your authentication system)
        current_user = get_current_user()

        new_post = Post(
            title=data.get('title'),
            content=data.get('content'),
            user_id=current_user.id,
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


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Retrieve the username and password from the login form
        username = request.json.get('username')

        password = request.json.get('password')

        # Query the database for the user with the provided username
        user = User.query.filter_by(username=username).first()

        if user and user.check_password(password):
            # If the user exists and the password is correct, log in the user
            login_user(user)
            flash('Logged in successfully', 'success')
            return redirect(url_for('index'))  # Replace 'index' with your main page

        flash('Login failed. Please check your username and password.', 'error')

    return render_template('login.html')


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


if __name__ == '__main__':
    app.run(port=5555, debug=True)

