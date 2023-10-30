import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Login from './Login'; // Import your Login component
import Dashboard from './Dashboard'; // Import your Dashboard component
import Navbar from './Navbar';
import UserRegistrationForm from './UserRegistrationForm';
import Userlist from './Userlist';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <header>
          <h1>Oasis</h1>
        </header>
        <UserRegistrationForm />
        <main>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/users" component={Userlist} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
