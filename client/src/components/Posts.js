// Posts.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Postcard from './Postcard';
import PostForm from './PostForm';

function Posts() {
  const [posts, setPosts] = useState([]);

 

  const createPost = (newPost) => {
    fetch('/api/create_post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setPosts([...posts, data]); // Update the posts list
      })
      .catch((error) => {
        console.error('Error creating a post:', error);
      });
  };
  
  return (
    <div>
      <h2>Blog Posts</h2>
      <PostForm createPost={createPost} />
      <div className="post-list">
        {posts.map((post) => (
          <Postcard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Posts;
