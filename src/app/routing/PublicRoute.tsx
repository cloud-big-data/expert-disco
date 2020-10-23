import React from 'react';
import { Redirect } from 'react-router-dom';

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
