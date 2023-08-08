import React, { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // hook para manejar la navegación

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const data = await login(username, password);
        
        // Verifica si el campo 'message' indica un inicio de sesión exitoso
        if (data.message === 'Inicio de sesión exitoso.') {
            
            // Almacenar el usuario o cualquier otra información en el estado global o en localStorage
            localStorage.setItem("user", JSON.stringify(data.user));
            
            // Redirige al dashboard
            navigate("/dashboard");
            
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
}

export default Login;