import React, { useState, useEffect } from 'react';
import HeroCard from './HeroCard';

function Heroes() {
    const [heroes, setHeroes] = useState([]);

    useEffect(() => {
      // Fetch hero data when the component mounts
      fetch('http://127.0.0.1:5555/heroes', {
        method: 'GET',
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to fetch hero data');
          }
        })
        .then((data) => {
          setHeroes(data); // Update the state with the fetched hero data
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);

const [users, setUsers] = useState([]);

 


  return (
    <div>
      <h2>Overwatch 2 Heroes</h2>
      <div className="hero-list">
        {heroes.map((hero) => (
          <HeroCard key={hero.id} hero={hero} heroes={heroes} />
        ))}
      </div>
    </div>
  );
}

export default Heroes;
