const skyvueFetch = (accessToken?: string) => {
  const baseUrl = process.env.REACT_APP_SKYVUE_API_URL;

  const refreshToken = localStorage.getItem('refreshToken')
  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
    'x-refresh-token': refreshToken ?? '',
    'Content-Type': 'application/json',
  })

  const makeCall = async (url: string, options: any) => {
    const finalUrl = `${baseUrl}${url}`
    const res = await fetch(finalUrl, {
      headers,
      method: options.method,
      body: options.body,
    });
    const json = await res.json();

    return json;
  }

  return {
    get: async (url: string) =>
      makeCall(url, {
        method: 'GET',
      }),
    post: async (url: string, body: { [key: string]: any }) =>
      makeCall(url, { method: "POST", body }),
    patch: async (url: string, body: { [key: string]: any }) =>
      makeCall(url, { method: "PATCH", body }),
    delete: async (url: string, body: { [key: string]: any }) =>
      makeCall(url, { method: "DELETE", body }),
  }
}

export default skyvueFetch;