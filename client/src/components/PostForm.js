// PostForm.js
import React, { useState } from 'react';
import axios from 'axios';
function PostForm() {
    const [post, setPost] = useState({
        title: '',
        content: '',
      });
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPost({
          ...post,
          [name]: value,
        });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
    
        // Make a POST request to create a new post
        axios.post('/api/create_post', post) // Adjust the API endpoint as needed
          .then((response) => {
            // Handle the response, e.g., show a success message or redirect to the posts page
            console.log(response.data);
          })
          .catch((error) => {
            // Handle errors, e.g., display an error message
            console.error(error);
          });
      };
      return (
        <div className="mt-12 mx-auto p-8 rounded-lg bg-white shadow-md max-w-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">Create a New Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-6">
            <label htmlFor="title" className="block text-sm font-medium leading-5 text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              autoComplete="title"
              className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-300 focus:ring-opacity-50 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-300 sm:text-sm"
              placeholder="Enter your post title"
              value={post.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-6">
            <label htmlFor="content" className="block text-sm font-medium leading-5 text-gray-700">
              Content
            </label>
            <textarea
              name="content"
              id="content"
              autoComplete="content"
              className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-300 focus:ring-opacity-50 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-300 sm:text-sm"
              placeholder="Enter your post content"
              value={post.content}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="mt-8 w-full px-6 py-3 text-lg font-medium text-white bg-orange-500 rounded-md shadow-md focus:outline-none hover:bg-indigo-700 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
          >
            Create Post
          </button>
        </form>
      </div>
      );
    }
    
    export default PostForm;

