import React, { useEffect, useState } from "react";
import Postcard from "./Postcard";
import PostForm from "./PostForm";
import EditPostForm from "./EditPostForm";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState();
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    // Fetch the blog posts when the component mounts
    fetch("/api/posts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        setError(error);
        console.error("Error fetching posts:", error);
      });
  }, []);

  useEffect(() => {
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((u) => {
          setUser(u);
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  const createPost = (newPost) => {
    fetch("/create/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPosts([...posts, data.post]);
      })
      .catch((error) => {
        setError(error);
        console.error("Error creating a post:", error);
      });
  };

  const deletePost = async (postId) => {
    try {
      // Ensure the user is logged in
      if (!user) {
        // Handle not logged-in scenario (e.g., redirect to login)
        console.error("User not logged in");
        return;
      }

      // Get the post details from the posts state
      const postToDelete = posts.find((post) => post.id === postId);

      // Ensure the logged-in user is the author of the post
      if (user.username !== postToDelete.username) {
        // Handle unauthorized scenario (e.g., display an error message)
        console.error("Unauthorized to delete this post");
        return;
      }

      // Make a DELETE request to your server endpoint to delete the post
      const response = await fetch(`/delete/post/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to delete post. ${errorMessage}`);
      }

      // Update the state to reflect the deleted post
      const updatedPosts = posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);

      console.log(`Post with ID ${postId} deleted successfully.`);
    } catch (error) {
      setError(error);
      console.error("Error deleting post:", error.message);
      // Handle error (show a message to the user, log, etc.)
    }
  };

  // const editPost = (postId) => {
  //   // Set the post ID to be edited
  //   setEditingPost(postId);
  // };

  // const cancelEdit = () => {
  //   // Cancel the editing mode
  //   setEditingPost(null);
  // };

  // const saveChanges = async (postId, newContent) => {
  //   try {
  //     // Make a request to update the post content
  //     const response = await fetch(`/api/posts/${postId}`, {
  //       method: 'POST',  // or 'PUT' depending on your server implementation
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ content: newContent }),
  //     });

  //     if (!response.ok) {
  //       const errorMessage = await response.text();
  //       throw new Error(`Failed to update post. ${errorMessage}`);
  //     }

  //     // Update the state with the new post content
  //     setPosts((prevPosts) =>
  //       prevPosts.map((post) =>
  //         post.id === postId ? { ...post, content: newContent } : post
  //       )
  //     );

  //     // Cancel the editing mode
  //     setEditingPost(null);

  //     console.log(`Post with ID ${postId} updated successfully.`);
  //   } catch (error) {
  //     setError(error);
  //     console.error('Error updating post:', error.message);
  //     // Handle error (show a message to the user, log, etc.)
  //   }
  // };
  const updatePostContent = (postId, newContent) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, content: newContent } : post
      )
    );
  };

  const fetchPosts = () => {
    // Fetch the blog posts when needed (you can reuse your existing logic)
    fetch('/api/posts')
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        setError(error);
        console.error('Error fetching posts:', error);
      });
  };


  return (
    <div className="container mx-auto mt-8">
      {editingPost ? (
        <EditPostForm
          // postId={editingPost}
          // originalContent={posts.find((post) => post.id === editingPost)?.content}
          // onCancel={cancelEdit}
          // onSaveChanges={saveChanges}
          onUpdatePostContent={updatePostContent}
        />
      ) : (
        <PostForm createPost={createPost} />
      )}
      <h2 className="text-3xl mb-4 text-center border-b-2 pb-2">Blog Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Postcard
            key={post.id}
            post={post}
            user={user}
            onDelete={deletePost}
            onEditPost={fetchPosts}
          />
        ))}
      </div>
    </div>
  );
}

export default Posts;
