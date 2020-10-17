import { createContext } from 'react';

const UserContext = createContext<{
  accessToken: string | null;
  userId: string | null;
  email: string | null;
  setUserContextValue: (content: any) => void,
}>({
  accessToken: null,
  userId: null,
  email: null,
  setUserContextValue: (content: any) => null,
})

export default UserContext;