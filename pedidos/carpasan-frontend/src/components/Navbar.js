import React from "react";
import { useAuth } from "../utils/authContext";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { authToken, logoutUser } = useAuth();
  const location = useLocation();

  if (!authToken) {
    return null;
  }

  const getPageName = (path) => {
    if (/^\/pedido\/\d+$/.test(path)) {
      const id = path.split("/")[2]; // Separar la URL por "/" y obtener el tercer fragmento.
      return `Detalles Pedido ${id}`;
    }

    if (/^\/edit-product\/\d+$/.test(path)) {
      return "Modificar Producto";
    }

    if (/^\/modificarPedido\/\d+$/.test(path)) {
      return "Modificar Pedido";
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
      case "/ManageProducts":
        return "Gestionar Productos";
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
      case "/edit-product":
        return "Editar Producto";
      case "/add-product":
        return "Añadir Producto";
      case "/modificarPedido":
        return "Modifica Pedido";
      case "/crearPedido":
        return "Crear Pedido";
      default:
        return "Pagina desconocida";
    }
  };

  return (
    <header>
      <div className="top-bar">
        <div className="container">
          {authToken && (
            <>
              <div className="logo">
                <Link to="/dashboard">
                  <img src="/images/Carpasan-min.png" alt="Carpasan Logo" />
                </Link>
              </div>
              <div className="top-bar-right">
                <h1>Carpasan 21 SL</h1>
              </div>
              <div className="logout-wrapper">
                <div className="logout-container">
                  <button onClick={logoutUser}>Cerrar sesión</button>
                </div>
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
