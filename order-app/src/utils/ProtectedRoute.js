import React from 'react';
import { useAuth } from "./authContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ component: Component, ...props }) {
  const { authToken, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;  // Puedes poner aquí un spinner o algo similar
  }

  return authToken ? <Component {...props} /> : <Navigate to="/" />;
}