// HeroCard.js
import React from 'react';

const HeroCard = ({ hero }) => {
  return (
    
    <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
      <img
        className="h-40 w-40 rounded-full mx-auto"
        src={hero.image}
        alt={hero.name}
      />
      <h2 className="text-xl font-semibold mt-4">{hero.name}</h2>
      <p className="text-gray-600">{hero.description}</p>
      <p className="text-gray-700 mt-2">Role: {hero.role}</p>
      <p className="text-gray-700">Health: {hero.health}</p>
    </div>
  );
};

export default HeroCard;
