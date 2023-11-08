import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Login from "./Login"; // Import your Login component
import Dashboard from "./Dashboard"; // Import your Dashboard component
import Navbar from "./Navbar";

import Userlist from "./Userlist";
import Posts from "./Posts";
import Heroes from "./Heroes";
import SignupPage from "./SignupPage";
import Logout from "./LogOut";
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
      <div className="app">
        <Navbar setUser={setUser} user={user} />

        <main>
          <Switch>
            <Route path="/signuppage" component={SignupPage} />
            <Route exact path="/Login">
              <Login setUser={setUser} />
            </Route>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/users" component={Userlist} />
            <Route path="/posts" component={Posts} />
            <Route path="/heroes" component={Heroes} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
