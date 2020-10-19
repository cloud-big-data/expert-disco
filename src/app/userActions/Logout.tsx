import Loading from 'components/ui/Loading';
import userContext from 'contexts/userContext';
import parseJWT from 'lib/parseJWT';
import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components/macro';
import skyvueFetch from 'services/skyvueFetch';

const LoadingContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

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
  
  return (
    UserContext.accessToken ? (
      <LoadingContainer>
        <Loading />
      </LoadingContainer>
    ) : (
      <Redirect to="/" />
    )
  )
}

export default Logout;