import React, { useState, useEffect } from 'react';
import Usercard from './Usercard';

function Userlist() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch user data from your backend
    fetch('http://localhost:5555/users', {
      method: 'GET',
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch user data');
        }
      })
      .then((data) => {
        setUsers(data); // Update the state with the fetched user data
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="user-list">
      {users.map((user, index) => (
        <Usercard key={index} user={user} />
      ))}
    </div>
  );
}

export default Userlist;
