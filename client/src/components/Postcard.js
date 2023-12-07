// Postcard.js

import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import CommentForm from './CommentForm';
import EditPostForm from './EditPostForm'; // Import the EditPostForm component
import { format } from 'date-fns';

function Postcard({ post, user, onDelete, onEditPost  }) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(true);
  const [editingPost, setEditingPost] = useState(null);

  const toggleCommentForm = () => {
    setShowCommentForm(!showCommentForm);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleDelete = () => {
    if (user && post && post.username === user.username) {
      onDelete(post.id);
    } else {
      console.error('You do not have permission to delete this post.');
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/comments/${post.id}`);
        if (response.ok) {
          const commentData = await response.json();
          setComments(commentData);
        } else {
          console.error('Failed to fetch comments');
        }
      } catch (error) {
        console.error('Error fetching comments:', error.message);
      }
    };

    if (post) {
      fetchComments();
    }
  }, [post]);

  return (
    <Card className="mb-4" style={{ width: '18rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#FFA500' }}>
      <Card.Body className="flex flex-col justify-center items-center text-center">
        {post ? (
          <>
            <Card.Title className="font-bold">{post.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{post.username}</Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted">{format(new Date(post.timestamp), 'MMMM dd, yyyy HH:mm')}</Card.Subtitle>
            <Card.Text style={{ color: '#ffffff' }}>{post.content}</Card.Text>
            <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded" onClick={toggleCommentForm}>
              Add Comment
            </button>
            {user && post.username === user.username && (
              <>
                <button className="mt-2 bg-red-500 text-white px-4 py-2 rounded" onClick={handleDelete}>
                  Delete Post
                </button>
                <button className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded" onClick={() => setEditingPost(post.id)}>
                  Edit Post
                </button>
              </>
            )}
            <button className="mt-2 bg-white text-black px-4 py-2 rounded" onClick={toggleComments}>
              {showComments ? 'Hide Comments' : 'Show Comments'}
            </button>
          </>
        ) : (
          <p>Loading...</p>
        )}
        {showCommentForm && <CommentForm postId={post ? post.id : null} user={user} />}
        {showComments && (
          <div className="mt-4">
            <h4 className="mb-2 text-white">Comments:</h4>
            {comments.map((comment) => (
              <div key={comment.id} className="mb-2" style={{ backgroundColor: '#e2e8f0', padding: '8px', borderRadius: '4px' }}>
                {comment.user && comment.user.username ? (
                  <strong>{comment.user.username}:</strong>
                ) : (
                  <strong>{user.username}</strong>
                )}{' '}
                {comment.text}
              </div>
            ))}
          </div>
        )}
        {editingPost === post.id && (
          <EditPostForm
            postId={post.id}
            originalContent={post.content}
            onCancel={() => setEditingPost(null)}
            onEditPost={onEditPost}
          />
        )}
      </Card.Body>
    </Card>
  );
}

export default Postcard;