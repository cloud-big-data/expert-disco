import userContext from 'globals/userContext';
import parseJWT from 'lib/parseJWT';
import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import skyvueFetch from 'services/skyvueFetch';

const Logout: React.FC = () => {
  const UserContext = useContext(userContext);
  const refreshToken = localStorage.getItem('refreshToken');

  if (refreshToken) {
    const { userId } = parseJWT(refreshToken);
    skyvueFetch().post('/auth/user/revokeToken', {
      userId,
    })
    localStorage.removeItem('refreshToken');
  }

  UserContext.setUserContextValue({
    accessToken: null,
  })

  return <Redirect to="/login" />
}

export default Logout;