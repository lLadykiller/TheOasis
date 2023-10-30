import React, { useState } from 'react';

function UserRegistrationForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    rank: '',
    battle_tag: '',
    main_hero: '',
    most_played: '',
    role: '',
    playstyle: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform any submission logic here, such as sending the form data to a server.

    // Example: Send form data to a server using fetch or another method

    // After successful submission, you can clear the form or perform other actions

    // Example: Clear the form data
    setFormData({
      email: '',
      password: '',
      username: '',
      rank: '',
      battle_tag: '',
      main_hero: '',
      most_played: '',
      role: '',
      playstyle: '',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Input fields for user registration */}
      {/* ... (your input fields) */}
      <button type="submit">Register</button>
    </form>
  );
}

export default UserRegistrationForm;
