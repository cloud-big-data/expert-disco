import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { Login, SignUp } from 'app/userActions';
import Home from 'app/home';
import { AuthenticatedRoute } from 'app/routing';
import Logout from 'app/userActions/Logout';
import PublicRoute from 'app/routing/PublicRoute';
import App from 'app';
import ForgotPassword from 'app/userActions/ForgotPassword';
import PasswordReset from 'app/userActions/PasswordReset';
import DatasetWrapper from 'app/dataset/wrappers/DatasetWrapper';

const Skyvue = () => (
  <Router>
    <Switch>
      <Route path="/signup">
        <PublicRoute>
          <SignUp />
        </PublicRoute>
      </Route>
      <Route path="/login">
        <PublicRoute>
          <Login />
        </PublicRoute>
      </Route>
      <Route exact path="/forgot_password">
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      </Route>
      <Route path="/forgot_password/:token">
        <PublicRoute>
          <PasswordReset />
        </PublicRoute>
      </Route>
      <Route path="/logout">
        <Logout />
      </Route>
      <Route path="/home">
        <AuthenticatedRoute>
          <App />
        </AuthenticatedRoute>
      </Route>
      <Route path="/dataset/:datasetId">
        <AuthenticatedRoute>
          <DatasetWrapper />
        </AuthenticatedRoute>
      </Route>
      <Route path="/">
        <PublicRoute>
          <Home />
        </PublicRoute>
      </Route>
    </Switch>
  </Router>
);

export default Skyvue;
