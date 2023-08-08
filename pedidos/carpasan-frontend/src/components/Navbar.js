import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../utils/authContext";
// import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return null;
  }
  
  return (
      <header>
          <div className="top-bar">
              <div className="container">
                  {isAuthenticated && (
                      <>
                          <div className="logo">
                              <img src="/images/Carpasan-min.png" alt="Carpasan Logo" />
                          </div>
                          <div className="top-bar-right">
                              <h1>Carpasan 21 SL</h1>
                          </div>
                      </>
                  )}
              </div>
          </div>
          <nav>
              <div className="nav-container">
                  <ul className="nav-links">
                      {!isAuthenticated && (
                          <li>
                              <Link to="/">Iniciar Sesión</Link>
                          </li>
                      )}
                      <li>
                          <Link to="/Dashboard">Dashboard</Link>
                      </li>
                  </ul>
              </div>
          </nav>
      </header>
  );
};

export default Navbar;
