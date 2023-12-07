import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [profileData, setProfileData] = useState({});
  const [formData, setFormData] = useState({
    rank: '',
    battleTag: '',
    mainHero: '',
    mostPlayed: '',
    role: '',
    playstyle: '',
  });
  const heroOptions = [
    'MAUGA', 'ANA', 'ASHE', 'BAPTISTE', 'BASTION', 'BRIGITTE', 'CASSIDY', 'D.VA', 'DOOMFIST', 'ECHO',
    'GENJI', 'HANZO', 'ILLARI', 'JUNKER QUEEN', 'JUNKRAT', 'KIRIKO', 'LIFEWEAVER', 'LÚCIO', 'MEI',
    'MERCY', 'MOIRA', 'ORISA', 'PHARAH', 'RAMATTRA', 'REAPER', 'REINHARDT', 'ROADHOG', 'SIGMA',
    'SOJOURN', 'SOLDIER: 76', 'SOMBRA', 'SYMMETRA', 'TORBJÖRN', 'TRACER', 'WIDOWMAKER', 'WINSTON',
    'WRECKING BALL', 'ZARYA', 'ZENYATTA',
  ];
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode((prevEditMode) => !prevEditMode);
  };

  useEffect(() => {
    // Fetch the user profile data when the component mounts
    axios.get('/profile/get')
      .then((response) => {
        // Set the fetched data to the component state
        setProfileData(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
   // Empty dependency array ensures this effect runs only once when the component mounts

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    setLoading(true);

    const updatedProfileData = {
      rank: formData.rank,
      battle_tag: formData.battleTag,
      main_hero: formData.mainHero,
      most_played: formData.mostPlayed,
      role: formData.role,
      playstyle: formData.playstyle,
    };
    
    axios.patch(`/users/update`, updatedProfileData)
  
    .then((response) => {
      
      // Handle success, e.g., show a success message or update the state
      console.log('Profile updated successfully:', response.data);
      // Update the local state or trigger a fetch to get the updated user data
      setProfileData(response.data);
    })
    .catch((error) => {
      // Handle errors, e.g., display an error message
      console.error('Failed to update the user profile:', error);
      alert('Failed to update the user profile. Please try again.');
    })
    .finally(() => {
      setLoading(false);
      setEditMode(false); // Exit edit mode after submitting the form
    });
  };

  return (
    <div>
      <h3 className="text-base font-semibold leading-7 text-gray-900 p-5">User Profile</h3>

      <div className="mt-6 border-t border-gray-100 p-5">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Username</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{profileData.username}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Email</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{profileData.email}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Rank</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{profileData.rank}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Battle Tag</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{profileData.battle_tag}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Role</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{profileData.role}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Playstyle</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{profileData.playstyle}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Main Hero</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{profileData.main_hero}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Most Played Hero</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{profileData.most_played}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        {!editMode ? (
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
            onClick={toggleEditMode}
          >
            Edit Profile
          </button>
        ) : (
          <>
            <div className="sm:col-span-3">
              <label htmlFor="rank" className="block text-sm font-medium leading-6 text-gray-900">
                Rank
              </label>
              <div className="mt-2">
                <select
                  name="rank"
                  id="rank"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={formData.rank}
                  onChange={handleChange}
                >
                  <option value="">Select Rank</option>
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Diamond">Diamond</option>
                  <option value="Masters">Masters</option>
                  <option value="GrandMasters">GrandMasters</option>
                  <option value="Top500">Top 500</option>
                </select>
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
                <select
                  name="mainHero"
                  id="mainHero"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={formData.mainHero}
                  onChange={handleChange}
                >
                  <option value="">Select Main Hero</option>
                  {heroOptions.map(hero => (
                    <option key={hero} value={hero}>{hero}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="mostPlayed" className="block text-sm font-medium leading-6 text-gray-900">
                Most Played Hero
              </label>
              <div className="mt-2">
                <select
                  name="mostPlayed"
                  id="mostPlayed"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={formData.mostPlayed}
                  onChange={handleChange}
                >
                  <option value="">Select Most Played Hero</option>
                  {heroOptions.map(hero => (
                    <option key={hero} value={hero}>{hero}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
                Role
              </label>
              <div className="mt-2">
                <select
                  name="role"
                  id="role"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  <option value="Tank">Tank</option>
                  <option value="Damage">Damage</option>
                  <option value="Support">Support</option>
                </select>
              </div>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="playstyle" className="block text-sm font-medium leading-6 text-gray-900">
                Playstyle
              </label>
              <div className="mt-2">
                <select
                  name="playstyle"
                  id="playstyle"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={formData.playstyle}
                  onChange={handleChange}
                >
                  <option value="">Select Playstyle</option>
                  <option value="Passive">Passive</option>
                  <option value="Aggressive">Aggressive</option>
                  <option value="Plays with Team">Plays with Team</option>
                  <option value="Rounded">Rounded</option>
                </select>
              </div>
            </div>
          </>
        )}

        {editMode && (
          <>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300"
              onClick={toggleEditMode}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
              onClick={handleSubmit}
            >
              Save
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;