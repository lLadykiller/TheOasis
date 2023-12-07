import React from "react";
import { Link, useHistory } from "react-router-dom";
import Oasis from "./Oasis.png";

const Navbar = ({ user, setUser }) => {
  const history = useHistory();

  const handleLogout = async () => {
    try {
      const response = await fetch("/logout", {
        method: "POST", // You can use POST or GET as needed
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setUser(null);
        history.push("/login"); // Redirect to the login page after logout
      } else {
        // Handle logout failure (e.g., display an error message).
      }
    } catch (error) {
      console.error("Error occurred during logout:", error);
    }
  };

  return (
    <nav className="bg-white p-2">
      <img src={Oasis} alt="logo" className=" h-1/6 w-1/6  " />
      <div className="container mx-auto">
        <div className="flex justify-between items-center ">
          <div className="text-orange-500 text-xl font-bold"></div>
          <ul className="flex space-x-4">
            <li className="text-orange-500 text-xl font-bold">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="text-orange-500 text-xl font-bold">
              <Link to="/users">Users</Link>
            </li>
            <li className="text-orange-500 text-xl font-bold">
              <Link to="/heroes">Heroes</Link>
            </li>
            <li className="text-orange-500 text-xl font-bold">
              <Link to="/posts">Posts</Link>
            </li>
            {user === undefined ? null : user ? (
              <li className="text-orange-500 text-xl font-bold">
                <button onClick={handleLogout}>Log Out</button>
              </li>
            ) : (
              <>
                <li className="text-orange-500 text-xl font-bold">
                  <Link to="/signuppage">SignUp</Link>
                </li>
                <li className="text-orange-500 text-xl font-bold">
                  <Link to="/Login">Log In</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;