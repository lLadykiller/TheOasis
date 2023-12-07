#!/usr/bin/env python3
# from werkzeug.exceptions import Unauthorized
# from werkzeug.urls import url_decode
# Standard library imports
import logging
from flask import request, make_response, session, abort
# Remote library imports
import ipdb
from flask import Flask, request, render_template, redirect, url_for, jsonify, flash, make_response, session
from flask_restful import Resource, reqparse
from flask_login import LoginManager, login_required, current_user, logout_user, login_user
from datetime import datetime
from models import User, Post, Comment, Hero
# Local imports
from config import app, db, api
from werkzeug.security import check_password_hash
# Add your model imports

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Views go here!


# Define the login route
class CheckSession(Resource):
    def get(self):
        if current_user.is_authenticated:
            return current_user.to_dict()
            # return user.to_dict(only=("username",))

        else:
            return {"message": "401: Not Authorized"}, 401


api.add_resource(CheckSession, '/check_session')


class Login(Resource):
    def post(self):
        data = request.get_json()

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return {'message': 'Username or password missing.'}, 400

        user = User.query.filter(User.username == username).first()

        if user and user.check_password(password):
            login_user(user)  # Log in the user
            return {'message': 'Login successful', 'user_id': user.id}, 200
        else:
            return {'message': 'Invalid username or password.'}, 401


api.add_resource(Login, "/login")


@login_manager.user_loader
def load_user(user_id):
    # Retrieve the user from the database based on user_id
    return User.query.get(int(user_id))


@login_manager.unauthorized_handler
def unauthorized():
    
    return ""


# @login_required  # Requires the user to be logged in
@app.route('/logout', methods=("POST",))
@login_required
def logout():
    logout_user()
    # Optionally, display a message to the user
    return ""


# @app.route('/user', methods=['GET'])
# @login_required  # Requires the user to be logged in
# def get_user_information():
#     user = current_user
#     if user:
#         user_data = {
#             'id': user.id,
#             'username': user.username,
#             'email': user.email,
#             'rank': user.rank,
#             # Add other user attributes here
#         }
#         return jsonify(user_data), 200
#     else:
#         return jsonify({'message': 'User not found'}), 404


@app.route('/api/posts', methods=['GET'])
def get_posts():
    posts = Post.query.all()  # Query the database to get all posts
    post_list = [post.serialize() for post in posts]  # Serialize the posts

    return jsonify(post_list), 200  # Return the list of posts as JSON

post_parser = reqparse.RequestParser()
post_parser.add_argument('title', type=str, required=True)
post_parser.add_argument('content', type=str, required=True)

# Define a resource for creating a new post


# Add the resource to your API

@app.route('/create/post', methods=['POST'])
@login_required  # Requires the user to be logged in
def create_post():
    try:
        data = request.get_json()
        title = data.get('title')
        content = data.get('content')
        
        if not title or not content:
            return jsonify(error='Title and content are required.'), 400
        
        if not current_user.is_authenticated:
            return jsonify(error='User is not authenticated.'), 401
        
        new_post = Post(
            title=title,
            content=content,
            username=current_user.username,
            timestamp=datetime.utcnow()
        )
        
        db.session.add(new_post)
        db.session.commit()
        
        return jsonify({'message': 'Post created successfully', 'post': new_post.serialize()}), 201
    
    except Exception as e:
        app.logger.error("Error in create_post route: " + str(e))
        return jsonify(error="Failed to create a post: " + str(e)), 500

# class CreatePost(Resource):
#     def post(self):
#         data = request.get_json()

#       # Get the current user's username (modify this part based on your authentication system)
#         username = "LadyKiller"

#         new_post = Post(
#             title=data.get('title'),
#             content=data.get('content'),
#             username=username,  # Set the username to the current user's username
#             timestamp=datetime.utcnow()
#         )

#         # Add the new post to the database
#         db.session.add(new_post)
#         db.session.commit()

#         return {"message": "Post created successfully", "post": new_post.serialize()}, 201


# api.add_resource(CreatePost, '/post')

from flask import jsonify

@app.route('/profile/get', methods=['GET'])
@login_required
def get_user_profile():
    user = current_user
    if user:
        # You can either serialize the user data directly in this route or use a serialization method
        user_data = {
            'username': user.username,
            'email': user.email,
            'rank': user.rank,
            'battle_tag': user.battle_tag,
            'main_hero': user.main_hero,
            'most_played': user.most_played,
            'role': user.role,
            'playstyle': user.playstyle
        }
        return jsonify(user_data), 200
    else:
        return jsonify(error="User not found"), 404


@app.route('/profile/create', methods=['POST'])
@login_required
def create_profile():
    try:
        user = current_user
        if user:
            user_data = request.get_json()
           
            # Extract the additional profile data from the request
            rank = user_data.get('rank')
            battle_tag = user_data.get('battle_tag')
            main_hero = user_data.get('main_hero')
            most_played = user_data.get('most_played')
            role = user_data.get('role')
            playstyle = user_data.get('playstyle')
            logging.info(f"Extracted user data: {rank}, {battle_tag}, ...")
            # Update the user's profile data
            user.rank = rank
            user.battle_tag = battle_tag
            user.main_hero = main_hero
            user.most_played = most_played
            user.role = role
            user.playstyle = playstyle
           
            db.session.commit()
            return jsonify(message="Profile created successfully", user=user.serialize())
        else:
            return jsonify(error="User not found"), 404
    except Exception as e:
        
        return jsonify(error="Failed to create profile: " + str(e)), 500


@app.route('/signup', methods=['POST'])
def signup():
    try:
        user_data = request.get_json()

        email = user_data.get('email')
        # You should hash the password before storing it
        password = user_data.get('password')
        username = user_data.get('username')

        # Add other user data fields as needed

        # Check if the email or username is already in use
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify(error="Email already in use"), 400

        existing_username = User.query.filter_by(username=username).first()
        if existing_username:
            return jsonify(error="Username already in use"), 400

        new_user = User(email=email, username=username)
        # Set the password using the set_password method
        new_user.set_password(password)  # Hash and store the password

        # Add other user data fields to the new_user

        db.session.add(new_user)
        db.session.commit()

        return jsonify(message="User signed up successfully"), 201
    except Exception as e:
        return jsonify(error="Failed to sign up: " + str(e)), 500


@app.route('/user', methods=['GET'])
@login_required
def get_user_information():
    user = current_user

    if user.is_authenticated:
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'rank': user.rank,
            'battle_tag': user.battle_tag,
            'main_hero': user.main_hero,
            'most_played': user.most_played,
            'role': user.role,
            'playstyle': user.playstyle,
            # Add other user attributes here
        }

        return jsonify(user_data), 200
    else:
        return jsonify({'message': 'User not found'}), 404

# USER ROUTES CRUD


class Users(Resource):
    def get(self):
        users = [
            user.to_dict(
                rules=("-posts", "-heros", )

            )
            for user in User.query.all()
        ]
        return make_response(users, 200)


api.add_resource(Users, "/users")


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


@app.route('/users/update', methods=['PATCH'])
def edit_user():
    # Check if 'user_id' is in the session
    if 'user_id' not in session:
        return jsonify(error='User not authenticated'), 401

    # Query the database for the user with the provided user_id
    user = User.query.get(session['user_id'])

    if user:
        try:
            data = request.get_json()

            # Update the user fields with the new data
            user.username = data.get('username', user.username)
            user.rank = data.get('rank', user.rank)
            user.battle_tag = data.get('battle_tag', user.battle_tag)
            user.main_hero = data.get('main_hero', user.main_hero)
            user.most_played = data.get('most_played', user.most_played)
            user.role = data.get('role', user.role)
            user.playstyle = data.get('playstyle', user.playstyle)

            db.session.commit()
            return jsonify(message='User edited successfully', user=user.serialize())

        except Exception as e:
            db.session.rollback()
            return jsonify(error=f'Error editing user: {str(e)}'), 500

    else:
        return jsonify(error='User not found'), 404


@app.route('/users/<int:user_id>', methods=['DELETE'])
@login_required
def delete_user(user_id):
    # Query the database for the user with the provided user_id
    user = User.query.get(user_id)

    if user:
        db.session.delete(user)  # Mark the user for deletion
        db.session.commit()  # Commit the transaction
        return jsonify(message='User deleted successfully')
    else:
        return jsonify(error='User not found'), 404


#  COMMENT ROUTES
from flask import abort

@app.route('/comments/<int:post_id>', methods=['GET'])
def get_comments(post_id):
    try:
        # Query the database for comments associated with the provided post_id
        comments = Comment.query.filter_by(post_id=post_id).all()

        # Serialize the comments
        comments_data = [comment.serialize() for comment in comments]

        # Return the comments as JSON
        return jsonify(comments_data), 200

    except Exception as e:
        return jsonify(error=f"Failed to retrieve comments: {str(e)}"), 500

@app.route('/comments', methods=['POST'])
def create_comment():
    try:
        data = request.get_json()
        user_id = data.get('user_id')  # Obtain the user's ID
        post_id = data.get('post_id')  # Obtain the post's ID
        text = data.get('text')  # Extract the comment text

        # Validate input data
        if not all((user_id, post_id, text)):
            return jsonify(error='Incomplete data. Please provide user_id, post_id, and text.'), 400

        # Check if the user and post exist
        user = User.query.get(user_id)
        post = Post.query.get(post_id)

        if user is None:
            app.logger.error("Error in create_post route: " + str(e))
            return jsonify(error=f'User not found for user_id {user_id}.'), 404

        if post is None:
            return jsonify(error=f'Post not found for post_id {post_id}.'), 404

        # Create a new comment and associate it with the user and post
        new_comment = Comment(user_id=user_id, post_id=post_id, text=text)
        db.session.add(new_comment)
        db.session.commit()

        return jsonify(message='Comment created successfully', comment=new_comment.serialize()), 201
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
@login_required
def delete_comment(comment_id):
    try:
        comment = Comment.query.get(comment_id)

        if comment:
            # Check if the user is the author of the comment
            if comment.user_id == current_user.id:
                db.session.delete(comment)
                db.session.commit()
                return jsonify(message='Comment deleted successfully')
            else:
                return jsonify(error='Unauthorized: You can only delete your own comments'), 403
        else:
            return jsonify(error='Comment not found'), 404
    except Exception as e:
        return jsonify(error="Failed to delete the comment: " + str(e)), 500

    # HERO ROUTES


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


# CREATE HEROES

@app.route('/heroes', methods=['POST'])
def create_hero():
    try:
        hero_data = request.get_json()

        image = hero_data.get('image')
        name = hero_data.get('name')
        description = hero_data.get('description')
        role = hero_data.get('role')
        health = hero_data.get('health')

        new_hero = Hero(name=name, description=description,
                        role=role, health=health, image=image)

        db.session.add(new_hero)
        db.session.commit()

        # Return 201 for created status
        return jsonify(message="Hero created successfully"), 201
    except Exception as e:
        return jsonify(error="Failed to create hero: " + str(e)), 500

    # DELETE HEROES


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


@app.route('/delete/post/<int:post_id>', methods=['DELETE'])
@login_required
def delete_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({'error': 'Post not found'}), 404

    if current_user != post.author:
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        # Manually delete associated comments
        Comment.query.filter_by(post_id=post_id).delete()

        # Delete the post
        db.session.delete(post)
        db.session.commit()

        return jsonify({'message': 'Post deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete post. {str(e)}'}), 500

# Flask route for editing a post
@app.route('/api/posts/<int:post_id>', methods=['PATCH'])
@login_required
def edit_post(post_id):
    try:
        # Retrieve the post from the database
        post = Post.query.get(post_id)

        # Check if the user is the author of the post
        if post and post.author == current_user:
            data = request.get_json()
            new_content = data.get('content')

            # Update the post content
            post.content = new_content
            db.session.commit()

            return jsonify(message='Post updated successfully', post=post.serialize()), 200
        else:
            return jsonify(error='Unauthorized: You can only edit your own posts'), 403

    except Exception as e:
        return jsonify(error=f"Failed to edit the post: {str(e)}"), 500
if __name__ == '__main__':
    app.run(port=5555, debug=True)

