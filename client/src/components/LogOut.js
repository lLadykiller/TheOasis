import React from "react";
import { useHistory } from "react-router-dom";

function Logout() {
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
        history.push("/login"); // Redirect to the login page after logout
      } else {
        // Handle logout failure (e.g., display an error message).
      }
    } catch (error) {
      console.error("Error occurred during logout:", error);
    }
  };

  return (
    <div className="mt-12 mx-auto p-8 rounded-lg bg-white shadow-md max-w-lg">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Logout from your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleLogout}>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Logout;
