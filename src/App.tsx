import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css';
import { Login, SignUp } from 'app/userActions';

const App = () => (
  <Router>
    <Switch>
      <Route path="/signup">
        <SignUp />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/">
        <p>Hello world</p>
      </Route>
    </Switch>
  </Router>
);

export default App;
