import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import React, { useEffect } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Login, SignUp } from 'app/userActions';
import Home from 'app/home';
import { AuthenticatedRoute } from 'app/routing';
import Logout from 'app/userActions/Logout';
import PublicRoute from 'app/routing/PublicRoute';
import App from 'app';
import ForgotPassword from 'app/userActions/ForgotPassword';
import PasswordReset from 'app/userActions/PasswordReset';
import DatasetWrapper from 'app/dataset/wrappers/DatasetWrapper';

const Skyvue = () => {
  useEffect(() => {
    if (
      process.env.NODE_ENV === 'production' &&
      !window.location.host.includes('app.')
    ) {
      window.location.href = `https://app.skyvue.io${window.location.pathname}${window.location.search}`;
    }
  });
  return (
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
};

export default Skyvue;
