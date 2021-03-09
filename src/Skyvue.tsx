import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Login } from 'app/userActions';
import { AuthenticatedRoute } from 'app/routing';
import Logout from 'app/userActions/Logout';
import PublicRoute from 'app/routing/PublicRoute';
import App from 'app';
import ForgotPassword from 'app/userActions/ForgotPassword';
import PasswordReset from 'app/userActions/PasswordReset';
import DatasetWrapper from 'app/dataset/wrappers/DatasetWrapper';

import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';

if (process.env.NODE_ENV === 'production') {
  LogRocket.init('n0q2ht/skyvue');
  setupLogRocketReact(LogRocket);
}

const Skyvue = () => (
  <Router>
    <Switch>
      {/* <Route path="/signup">
        <PublicRoute>
          <SignUp />
        </PublicRoute>
      </Route> */}
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
          <Redirect to="/login" />
        </PublicRoute>
      </Route>
    </Switch>
  </Router>
);
export default Skyvue;
