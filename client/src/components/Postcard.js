// Postcard.js
import React from 'react';

function Postcard({ post }) {
  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <p>Author: {post.author}</p>
      <p>Timestamp: {post.timestamp}</p>
    </div>
  );
}

export default Postcard;
