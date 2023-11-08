// Posts.js
import React, { useEffect, useState } from 'react';

import Postcard from './Postcard';
import PostForm from './PostForm';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the blog posts when the component mounts
    fetch('/api/posts')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        setError(error);
        console.error('Error fetching posts:', error);
      });
  }, []);

  const createPost = (newPost) => {
    fetch('/create/post', {
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
        setPosts([...posts, data.post]);
      })
      .catch((error) => {
        setError(error);
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
