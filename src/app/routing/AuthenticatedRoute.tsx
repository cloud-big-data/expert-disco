import UserContext from 'contexts/userContext';
import React, { useEffect, useState } from 'react';
import useTokenRefresh from 'hooks/useTokenRefresh';
import parseJWT from 'lib/parseJWT';
import { Redirect } from 'react-router-dom';
import ErrorScreen from 'components/ErrorScreen';

const AuthenticatedRoute: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [userContext, setUserContextValue] = useState<{
    userId: string | null;
    accessToken: string | null;
    email: string | null;
  }>({
    userId: null,
    accessToken: null,
    email: null,
  });
  const [isLoaded, toggleIsLoaded] = useState(false);
  const { accessToken, error, disconnected } = useTokenRefresh();

  useEffect(() => {
    if (accessToken && !userContext.accessToken) {
      const decodedToken = accessToken ? parseJWT(accessToken) : {};
      setUserContextValue({
        userId: decodedToken.userId,
        accessToken,
        email: decodedToken.email,
      });
    }
  }, [accessToken, userContext.accessToken]);

  if (disconnected) {
    return <ErrorScreen />;
  }

  if (!localStorage.getItem('refreshToken')) {
    return <Redirect to="/login" />;
  }

  if (error) {
    localStorage.removeItem('refreshToken');
    return <Redirect to="/login" />;
  }

  if (accessToken && !isLoaded) {
    toggleIsLoaded(true);
  }

  if (isLoaded && !accessToken) return <Redirect to="/login" />;
  return (
    <UserContext.Provider
      value={{
        accessToken,
        userId: userContext.userId,
        email: userContext.email,
        setUserContextValue,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default AuthenticatedRoute;
