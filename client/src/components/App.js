import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Navbar from "./Navbar";
import Userlist from "./Userlist";
import Posts from "./Posts";
import Heroes from "./Heroes";
import SignupPage from "./SignupPage";
import Logout from "./LogOut";

// Create a context for user-related data
export const UserContext = createContext();

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((u) => {
          setUser(u);
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <Router>
      {/* Provide the UserContext value with the user state and setUser function */}
      <UserContext.Provider value={{ user, setUser }}>
        <div className="app">
          <Navbar setUser={setUser} user={user} />
          <main>
            <Switch>
              <Route path="/signuppage" component={SignupPage} />
              <Route exact path="/Login">
                {/* Remove setUser prop since it's now provided by context */}
                <Login />
              </Route>
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/users" component={Userlist} />
              <Route exact path="/posts">
                <Posts />
              </Route>
              <Route path="/heroes" component={Heroes} />
            </Switch>
          </main>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
