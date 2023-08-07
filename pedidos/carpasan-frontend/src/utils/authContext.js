import { createContext } from 'react';

const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {}
});

export default AuthContext;