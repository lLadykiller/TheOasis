import React, { useState } from 'react';
import axios from 'axios';

function Profile() {
  const [formData, setFormData] = useState({
    rank: '',
    battleTag: '',
    mainHero: '',
    mostPlayed: '',
    role: '',
    playstyle: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const profileData = {
      rank: formData.rank,
      battle_tag: formData.battleTag,
      main_hero: formData.mainHero,
      most_played: formData.mostPlayed,
      role: formData.role,
      playstyle: formData.playstyle,
    };
  
    // Send a POST request to create the user profile
    fetch('/profile/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData), // Convert to JSON and send in the body
    })
      .then((response) => {
        if (response.ok) {
          // Handle success, e.g., show a success message or redirect
          console.log('Profile created successfully');
          // Redirect or perform other actions as needed
        } else {
          console.error('Failed to create the user profile');
        }
      })
      .catch((error) => {
        // Handle errors, e.g., display an error message
        console.error(error);
      });
  };

  return (
    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <div className="sm:col-span-3">
        <label htmlFor="rank" className="block text-sm font-medium leading-6 text-gray-900">
          Rank
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="rank"
            id="rank"
            autoComplete="rank"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={formData.rank}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="sm:col-span-3">
        <label htmlFor="battleTag" className="block text-sm font-medium leading-6 text-gray-900">
          BattleTag
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="battleTag"
            id="battleTag"
            autoComplete="battleTag"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={formData.battleTag}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="sm:col-span-3">
        <label htmlFor="mainHero" className="block text-sm font-medium leading-6 text-gray-900">
          Main Hero
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="mainHero"
            id="mainHero"
            autoComplete="mainHero"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={formData.mainHero}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="sm:col-span-3">
        <label htmlFor="mostPlayed" className="block text-sm font-medium leading-6 text-gray-900">
          Most Played Hero
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="mostPlayed"
            id="mostPlayed"
            autoComplete="mostPlayed"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={formData.mostPlayed}
            onChange={handleChange}
            />
          </div>
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
            Role
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="role"
              id="role"
              autoComplete="role"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={formData.role}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="playstyle" className="block text-sm font-medium leading-6 text-gray-900">
            Playstyle
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="playstyle"
              id="playstyle"
              autoComplete="playstyle"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={formData.playstyle}
              onChange={handleChange}
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
          onClick={handleSubmit}
        >
          Save Profile
        </button>
      </div>
    );
  }
  
export default Profile;
