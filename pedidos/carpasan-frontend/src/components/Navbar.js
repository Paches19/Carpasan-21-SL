import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../utils/authContext';
import { useHistory } from 'react-router-dom';

const Navbar = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const history = useHistory();

  const redirectToDashboard = () => {
    history.push("/dashboard");
  };
  return (
    <nav>
      <ul>
        {!isAuthenticated && <li><Link to="/login">Iniciar Sesión</Link></li>}
        {isAuthenticated && (
          <div className="navbar">
          <img src="/images/Carpasan.png" alt="Logo de la Empresa" /> {}
          <h1>Carpasan 21 SL</h1>
        </div>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;