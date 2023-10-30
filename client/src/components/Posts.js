// Posts.js
import React, { useState, useEffect } from 'react';

function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from the backend and set them in the state
    fetchPostsFromBackend();
  }, []);

  const fetchPostsFromBackend = () => {
    // Make a GET request to retrieve the posts from your backend
    fetch('/posts') // Replace with your actual backend endpoint
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });
  };

  return (
    <div>
      <CreatePostForm createPost={createPost} />
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}

export default Posts;
