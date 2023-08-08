// src/pages/Dashboard.js

import React from 'react';
import { Link } from 'react-router-dom';
// import Navbar from '../components/Navbar';

const Dashboard = () => {
  return (
    <div className="dashboard">
  <div className="panel-seleccion">
    <Link to="/HistorialPedidos">
      <button>Historial de Pedidos</button>
    </Link>
    <Link to="/ManageOrder">
      <button>Gestionar Pedidos</button>
    </Link>
    <Link to="/EditOrder">
      <button>Modificar Pedidos</button>
    </Link>
    <Link to="/CreateOrder">
      <button>Añadir Pedido</button>
    </Link>
    <Link to="/deleteorder">
      <button>Eliminar un Pedido</button>
    </Link>
    <Link to="/estadisticas">
      <button>Estadísticas de Pedidos</button>
    </Link>
    <Link to="/alertas">
      <button>Alertas y Notificaciones</button>
    </Link>
    <Link to="/gestion-usuarios">
      <button>Gestión de Usuarios</button>
    </Link>
  </div>
</div>
  );
};

export default Dashboard;
