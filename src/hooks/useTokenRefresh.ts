import parseJWT from 'lib/parseJWT';
import { useEffect, useRef, useState } from 'react';
import skyvueFetch from 'services/skyvueFetch';

const useTokenRefresh = () => {
  const [tokens, setTokens] = useState<{
    accessToken: string | null;
    error: boolean;
    disconnected: boolean;
  }>({
    accessToken: null,
    error: false,
    disconnected: false,
  });

  const refreshInterval = useRef<any>(undefined);

  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    const getTokens = async () => {
      const res = await skyvueFetch().post('/auth/user/refresh', {
        refreshToken,
      });

      if (res.error === 'Failed to fetch') {
        setTokens({
          ...tokens,
          disconnected: true,
        });
        return;
      }
      if (
        res.error ||
        res === 'JsonWebTokenError' ||
        res === 'Authorization error'
      ) {
        setTokens({
          ...tokens,
          error: true,
        });
        return;
      }

      if (res.refreshToken && res.accessToken) {
        localStorage.setItem('refreshToken', res.refreshToken);
        setTokens({
          ...res,
        });
      }
    };

    if (refreshToken && !tokens.accessToken) {
      getTokens();
    }

    refreshInterval.current = setInterval(getTokens, 600000);
    return () => {
      clearInterval(refreshInterval.current);
      refreshInterval.current = undefined;
    };
  }, [tokens]);

  return tokens;
};

export default useTokenRefresh;
