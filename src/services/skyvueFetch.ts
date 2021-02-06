const makeBaseUrl = () => {
  if (process.env.REACT_APP_NETLIFY_CONTEXT) {
    const lookup: { [key: string]: string | undefined } = {
      preview: process.env.REACT_APP_SKYVUE_API_URL_PREVIEW,
      production: process.env.REACT_APP_SKYVUE_API_URL_PRODUCTION,
    };
    return lookup[process.env.REACT_APP_NETLIFY_CONTEXT];
  }

  return process.env.REACT_APP_SKYVUE_API_URL;
};

const skyvueFetch = (
  accessToken?: string | null,
): {
  get: (url: string) => Promise<any>;
  post: (url: string, body: { [key: string]: any }) => Promise<any>;
  postFile: (url: string, file: FormData) => Promise<any>;
  patch: (url: string, body: { [key: string]: any }) => Promise<any>;
  delete: (url: string, body: { [key: string]: any }) => Promise<any>;
} => {
  const baseUrl = makeBaseUrl();
  console.log(
    `selected ${baseUrl} because REAT_APP_NETLIFY_CONTEXT === ${process.env.REACT_APP_NETLIFY_CONTEXT}`,
  );

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
          status: e.status,
        };
      }
    } catch (e) {
      return {
        error: e.message,
        status: e.status,
      };
    }
  };

  return {
    get: (url: string) =>
      makeCall(url, {
        method: 'GET',
      }),
    post: (url: string, body: { [key: string]: any }) =>
      makeCall(url, { method: 'POST', body }),
    postFile: (url: string, file: FormData) =>
      makeCall(url, { method: 'POST', file }),
    patch: (url: string, body: { [key: string]: any }) =>
      makeCall(url, { method: 'PATCH', body }),
    delete: (url: string, body: { [key: string]: any }) =>
      makeCall(url, { method: 'DELETE', body }),
  };
};

export default skyvueFetch;
