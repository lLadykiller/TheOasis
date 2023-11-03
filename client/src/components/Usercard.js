import React from 'react';

function Usercard({ user, handleDelete, handleInputChange}) {
  const { username, rank, battle_tag, main_hero, most_played, role, playstyle } = user;

  return (
    <div className="user-card">
      <h2>{username}</h2>
      <p><strong>Rank:</strong> {rank}</p>
      <p><strong>Battle Tag:</strong> {battle_tag}</p>
      <p><strong>Main Hero:</strong> {main_hero}</p>
      <p><strong>Most Played Hero:</strong> {most_played}</p>
      <p><strong>Role:</strong> {role}</p>
      <p><strong>Playstyle:</strong> {playstyle}</p>
     
    </div>
  );
}

export default Usercard;
