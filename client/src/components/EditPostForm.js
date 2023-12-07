import React, { useState } from 'react';
import axios from 'axios';

function EditPostForm({ postId, originalContent, onCancel, onEditPost }) {
  const [updatedContent, setUpdatedContent] = useState(originalContent);

  const handleEdit = async () => {
    try {
      // Make a PATCH request to your server endpoint to update the post content using Axios
      const response = await axios.patch(`/api/posts/${postId}`, {
        content: updatedContent,
      });

      if (response.status !== 200) {
        throw new Error(`Failed to update post. ${response.data.message}`);
      }

      // Trigger the onEditPost callback to update the state in the parent component
      onEditPost();

      // Clear the form by resetting the updatedContent state
      setUpdatedContent('');

    } catch (error) {
      console.error('Error editing post:', error.message);
      // Handle error (show a message to the user, log, etc.)
    }
  };

  return (
    <div>
      <textarea
        value={updatedContent}
        onChange={(e) => setUpdatedContent(e.target.value)}
        placeholder="Enter updated content"
      />
      <button onClick={handleEdit}>Save Changes</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}

export default EditPostForm;