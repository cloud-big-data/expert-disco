import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import './App.css';
import { Login, SignUp } from 'app/userActions';
import Home from 'app/home';
import { AuthenticatedRoute } from 'app/routing';
import Logout from 'app/userActions/Logout';
import userContext from 'globals/userContext';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/logout">
          <Logout />
        </Route>
        <Route path="/home">
          <AuthenticatedRoute>
            <p>Home</p>
          </AuthenticatedRoute>
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  )
};

export default App;
