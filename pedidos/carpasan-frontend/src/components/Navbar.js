import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../utils/authContext";
// import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { isAuthenticated } = useContext(AuthContext);
  // const navigate = useNavigate();

  // const redirectToDashboard = () => {
  //   navigate("/dashboard");
  // };

  return (
    <nav>
      <div>Estado de autenticación: {String(isAuthenticated)}</div>
      <ul>
        {!isAuthenticated && (
          <li>
            <Link to="/">Iniciar Sesión</Link>
          </li>
        )}
        {isAuthenticated && (
          <div className="navbar">
            <img src="../../images/Carpasan-min.png" alt="" /> {}
            <h1>Carpasan 21 SL</h1>
          </div>
        )}
      </ul>
      {/* <Link to="/">Inicio</Link> */}
      <Link to="/Dashboard">Dashboard</Link>
    </nav>
  );
};

export default Navbar;
