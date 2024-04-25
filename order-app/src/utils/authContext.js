import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null); // Estado para almacenar el token
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setAuthToken(token); // Guardar el token en el estado
    }
    setIsLoading(false);
  }, []);

  const loginUser = (token) => {
    setAuthToken(token);
    sessionStorage.setItem("token", token);
  };

  const logoutUser = () => {
    setAuthToken(null); // Limpiar el token del estado
    sessionStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ loginUser, logoutUser, authToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext); // Devuelve el contexto completo, incluido el valor
};

export default AuthContext;
