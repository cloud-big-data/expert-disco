const skyvueFetch = (
  accessToken?: string,
): {
  get: (url: string) => Promise<any>;
  post: (url: string, body: { [key: string]: any }) => Promise<any>;
  postFile: (url: string, file: FormData) => Promise<any>;
  patch: (url: string, body: { [key: string]: any }) => Promise<any>;
  delete: (url: string, body: { [key: string]: any }) => Promise<any>;
} => {
  const baseUrl = process.env.REACT_APP_SKYVUE_API_URL;

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'x-refresh-token': localStorage.getItem('refreshToken') ?? '',
    // 'Content-Type': 'application/json',
  };

  const makeCall = async (url: string, options: any) => {
    const finalUrl = `${baseUrl}${url}`;
    try {
      const res = await fetch(finalUrl, {
        headers: options.file
          ? { ...headers }
          : {
              ...headers,
              'Content-Type': 'application/json',
            },
        method: options.method,
        body: options.file ?? JSON.stringify(options.body),
      });

      try {
        const json = await res.json();
        return json;
      } catch (e) {
        return {
          error: e.message,
        };
      }
    } catch (e) {
      return {
        error: e.message,
      };
    }
  };

  return {
    get: async (url: string) =>
      makeCall(url, {
        method: 'GET',
      }),
    post: async (url: string, body: { [key: string]: any }) =>
      makeCall(url, { method: 'POST', body }),
    postFile: async (url: string, file: FormData) =>
      makeCall(url, { method: 'POST', file }),
    patch: async (url: string, body: { [key: string]: any }) =>
      makeCall(url, { method: 'PATCH', body }),
    delete: async (url: string, body: { [key: string]: any }) =>
      makeCall(url, { method: 'DELETE', body }),
  };
};

export default skyvueFetch;
