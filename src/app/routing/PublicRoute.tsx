import React from 'react';
import { Redirect } from 'react-router-dom';

const PublicRoute: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <React.Fragment>
      {localStorage.getItem('refreshToken') ? (
        <Redirect to="/home" />
      ) : (
        <React.Fragment>
          { children }
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default PublicRoute;