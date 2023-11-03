import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Login from './Login'; // Import your Login component
import Dashboard from './Dashboard'; // Import your Dashboard component
import Navbar from './Navbar';

import Userlist from './Userlist';
import Posts from './Posts';
import Heroes from './Heroes';
import SignupPage from './SignupPage';
function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <header>
          <h1>Oasis</h1>
        </header>
        
        <main>
          <Switch>
            <Route path="/signuppage" component={SignupPage} />
            <Route exact path="/" component={Login} />
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
