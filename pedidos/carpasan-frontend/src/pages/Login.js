import React, { useState } from "react";
import { login } from "../api/auth";
import { useHistory } from "react-router-dom";

const history = useHistory(); // hook para manejar la navegación

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = await login(username, password);
    // Suponiendo que la respuesta contiene un token o algún dato de autenticación
    if (data.token) {
      // Aquí puedes almacenar el token en el estado global o en localStorage por ejemplo
      localStorage.setItem("authToken", data.token);

      // Redirigir al dashboard
      history.push("/dashboard");
    } else {
      setError("Datos de inicio de sesión inválidos.");
    }
  } catch (err) {
    setError(err.message);
  }
};

return (
  <div>
    <h2>Iniciar Sesión</h2>
    {error && <p>{error}</p>}
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nombre de usuario"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />
      <button type="submit">Ingresar</button>
    </form>
  </div>
);

export default Login;
