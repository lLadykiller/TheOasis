import React, { useState,useEffect } from 'react';

function CommentForm({ postId}) {
  const [commentText, setCommentText] = useState('');

  const [user, setUser] = useState();

  useEffect(() => {
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((u) => {
          setUser(u);
        });
      } else {
        setUser(null);
      }
    }).catch((error) => {
      console.error('Error checking session:', error.message);
    });
  }, []);


  const handleCommentSubmit = async () => {
    try {
      if (!user) {
        // If there is no user, handle the case accordingly
        console.error('User not logged in. Cannot submit comment.');
        return;
      }
      // Assuming user prop contains the user information
      const userID = user.id;

      // Make a POST request to your server endpoint to submit the comment
      const response = await fetch('/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userID,
          post_id: postId,
          text: commentText,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to submit comment. ${errorMessage}`);
      }

      // Reset the comment text after a successful submission
      setCommentText('');
    } catch (error) {
      console.error('Error submitting comment:', error.message);
      // Handle error (show a message to the user, log, etc.)
    }
  };


  return (
    <div className="mt-2">
      {user ? (
      <>
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Type your comment here..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded" onClick={handleCommentSubmit}>
        Submit Comment
      </button>
      </>
       ) : (
         <p>Please log in to leave a comment.</p>
       )}
    </div>
  );
}

export default CommentForm;

