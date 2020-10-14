import userContext from 'globals/userContext';
import useTokenRefresh from 'hooks/useTokenRefresh';
import parseJWT from 'lib/parseJWT';
import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';

const AuthenticatedRoute: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [userContextValue, setUserContextValue] = useState<{
    userId: string | null;
    accessToken: string | null;
  }>({
    userId: null,
    accessToken: null,
  });
  const [isLoaded, toggleIsLoaded] = useState(false);
  const UserContext = useContext(userContext);

  const { accessToken, error } = useTokenRefresh(
    localStorage.getItem('refreshToken'),
    UserContext.accessToken,
  );

  console.log(error);

  if (!localStorage.getItem('refreshToken')) {
    return <Redirect to="/login" />
  }

  if (error) {
    localStorage.removeItem('refreshToken');
    return <Redirect to="/login" />;
  }

  if (accessToken && !isLoaded) {
    toggleIsLoaded(true);
  }

  const decodedToken = parseJWT(accessToken!);

  if (isLoaded) {
    setUserContextValue({
      userId: decodedToken.userId,
      accessToken,
    })
  }

  if (isLoaded && !accessToken) return <Redirect to="/login" />
  return (
    <userContext.Provider value={{
      accessToken: userContextValue.accessToken,
      userId: userContextValue.userId,
      setUserContextValue,
    }}>
      {children}
    </userContext.Provider>
  )
}

export default AuthenticatedRoute;