  import React, { useState, useContext } from "react";
  import { login } from "../api/auth";
  import { useNavigate } from "react-router-dom";
  import AuthContext from "../utils/authContext";

  const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const data = await login(username, password);
        if (data.message === "Inicio de sesión exitoso.") {
          loginUser(data.token);
          navigate("/dashboard");
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(
          "Hubo un problema al intentar iniciar sesión. Por favor, inténtalo de nuevo."
        );
      }
    };

    return (
      <div className="login-container">
        <div className="branding">
          <img src="/images/Carpasan-min.png" alt="" className="brand-logo" />
          <h1 className="brand-name">Carpasan 21 SL</h1>
        </div>
        <div className="login-box">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Ingresar</button>
            {error && <p>{error}</p>}
          </form>
        </div>
      </div>
    );
  };

  export default Login;
