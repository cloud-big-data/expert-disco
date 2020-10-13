import { useEffect, useState } from 'react';
import skyvueFetch from 'services/skyvueFetch';

const useTokenRefresh = (refreshToken: string | null, accessToken: string | null) => {
  const [tokens, setTokens] = useState<{
    accessToken: string | null;
    refreshToken: string | null;
    error: boolean;
  }>({
    accessToken,
    refreshToken,
    error: false,
  });

  useEffect(() => {
    const getTokens = async () => {
      const res = await skyvueFetch().post('/auth/user/refresh', {
        refreshToken: localStorage.getItem('refreshToken'),
      })

      if (res.error) {
        setTokens({
          ...tokens,
          error: true,
        })
        return;
      }

      if (res.refreshToken) {
        localStorage.setItem('refreshToken', res.refreshToken);
      }
    }

    if (refreshToken && !accessToken) {
      getTokens();
    }
  }, [refreshToken, accessToken, tokens])

  return tokens;
}

export default useTokenRefresh;