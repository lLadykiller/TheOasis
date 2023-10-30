import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="text-white text-xl font-bold">My App</div>
          <ul className="flex space-x-4">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
            <Link to="/users">Users</Link>
            </li>
            <li>
              <Link to="/heroes">Heros</Link>
            </li>
            <li>
              <Link to="/posts">Posts</Link>
            </li>
            
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
