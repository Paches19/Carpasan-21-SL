import React, { useContext } from "react";
import AuthContext from "../utils/authContext";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    return null;
  }

  const getPageName = (path) => {
    if (/^\/pedido\/\d+$/.test(path)) {
      const id = path.split("/")[2];  // Separar la URL por "/" y obtener el tercer fragmento.
      return `Detalles Pedido ${id}`;
    }
  
    switch (path) {
      case "/":
        return "Inicio de Sesión";
      case "/dashboard":
        return "Dashboard";
      case "/pedido/" + Number:
        return "Detalles Pedido";
      case "/HistorialPedidos":
        return "Historial de Pedidos";
      case "/ManageOrder":
        return "Gestionar Pedidos";
      case "/EditOrder":
        return "Modificar Pedidos";
      case "/CreateOrder":
        return "Crear Pedidos";
      case "/deleteorder":
        return "Eliminar Pedidos";
      case "/estadisticas":
        return "Estadísticas de Pedidos";
      case "/alertas":
        return "Alertas y Notificaciones";
      case "/gestion-usuarios":
        return "Gestión de Usuarios";
      default:
        return "Página desconocida";
    }
  };

  return (
    <header>
      <div className="top-bar">
        <div className="container">
          {isAuthenticated && (
            <>
              <div className="logo">
                <Link to="/dashboard">
                  <img src="/images/Carpasan-min.png" alt="Carpasan Logo" />
                </Link>
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
          <h5>{getPageName(location.pathname)}</h5>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
