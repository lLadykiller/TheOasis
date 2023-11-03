import React from 'react';
import SignupForm from './SignupForm';

function SignupPage() {
  const handleSignup = (formData) => {
    // Make a POST request to your backend API to register the user
    fetch('http://127.0.0.1:5555/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          // User registered successfully
          // Redirect to the login page or perform other actions
        } else {
          // Handle registration errors
          console.error('Failed to register the user');
        }
      });
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <SignupForm onSignup={handleSignup} />
    </div>
  );
}

export default SignupPage;
