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

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight  text-orange-500">Overwatch 2 Heroes</h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {heroes.map((hero) => (
            <div key={hero.id} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img
                  src={hero.image}  // Update this with your hero image source
                  alt={hero.name}    // Update this with your hero name
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-lg font-bold text-orange-500 flex justify-center">
                    
                      <span aria-hidden="true" className="absolute inset-0" />
                      {hero.name} 
                    
                  </h3>

                  <p className="mt-1 text-sm font-bold flex justify-center text-orange-500">{hero.role}</p>  
                  <p className="mt-1 text-sm text-gray-500 ">{hero.description}</p>
                </div>
                <p className="text-sm font-medium text-gray-500">{hero.health}</p>  
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Heroes;
