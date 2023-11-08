import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Userlist() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch user data from your backend
    fetch('http://127.0.0.1:5555/users', {
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
        setUsers(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleDelete = (userId) => {
    fetch(`http://127.0.0.1:5555/users/${userId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setUsers(users.filter((user) => user.id !== userId));
        } else {
          console.error('Failed to delete the user');
        }
      });
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <ul className="divide-y divide-gray-100">
        {users
          .filter((user) => {
            const username = user.username ? user.username.toLowerCase() : '';
            const email = user.email ? user.email.toLowerCase() : '';
            const role = user.role ? user.role.toLowerCase() : '';
            const rank = user.rank ? user.rank.toLowerCase() : '';
            const battle_tag = user.battle_tag ? user.battle_tag.toLowerCase() : '';
            const main_hero = user.main_hero ? user.main_hero.toLowerCase() : '';
            const playstyle = user.playstyle ? user.playstyle.toLowerCase() : '';
            const most_played = user.most_played ? user.most_played.toLowerCase() : '';
            return (
              username.includes(searchQuery.toLowerCase()) ||
              email.includes(searchQuery.toLowerCase()) ||
              role.includes(searchQuery.toLowerCase()) ||
              rank.includes(searchQuery.toLowerCase()) ||
              main_hero.includes(searchQuery.toLowerCase()) ||
              playstyle.includes(searchQuery.toLowerCase()) ||
              most_played.includes(searchQuery.toLowerCase()) ||
              
              battle_tag.includes(searchQuery.toLowerCase()) 
            );
          })
          .map((user) => (
            <li key={user.id} className="flex justify-between gap-6 py-5">
              <div className="flex min-w-0 gap-4 p-3">
               
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                  
                </div>
              </div>
              <div className="hidden shrink sm:flex sm:flex-col sm:items-end">
                <p className="text-sm text-gray-900">{user.role}</p>
                <p className="text-sm text-gray-900">{user.rank}</p>
                <p className="text-sm text-gray-900">{user.battle_tag}</p>
                <p className="text-sm text-gray-900">{user.main_hero}</p>
                <p className="text-sm text-gray-900">{user.most_played}</p>
                <p className="text-sm text-gray-900">{user.playstyle}</p>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-sm  text-red-500"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Userlist;
