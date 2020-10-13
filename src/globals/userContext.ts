import { createContext } from 'react';

const userContext = createContext<{
  accessToken: string | null;
  userId: string | null;
  setUserContextValue: (content: any) => void,
}>({
  accessToken: null,
  userId: null,
  setUserContextValue: (content: any) => null,
})

export default userContext;