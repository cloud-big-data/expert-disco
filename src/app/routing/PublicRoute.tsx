import { Redirect } from 'react-router-dom';
import React from 'react';

const PublicRoute: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <>
    {localStorage.getItem('refreshToken') ? (
      <Redirect to="/home" />
    ) : (
      <>{children}</>
    )}
  </>
);

export default PublicRoute;
