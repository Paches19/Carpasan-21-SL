// src/pages/Dashboard.js

import React from 'react';
import { Link } from 'react-router-dom';
// import Navbar from '../components/Navbar';

const Dashboard = () => {
  return (
    <div className="dashboard">
  <div className="panel-seleccion">
    <Link to="/HistorialPedidos">
      <button2>Historial de Pedidos</button2>
    </Link>
    <Link to="/ManageProducts">
      <button2>Gestionar Productos</button2>
    </Link>
    <Link to="/EditOrder">
      <button2>Modificar Pedidos</button2>
    </Link>
    <Link to="/CreateOrder">
      <button2>Añadir Pedido</button2>
    </Link>
    <Link to="/deleteorder">
      <button2>Eliminar un Pedido</button2>
    </Link>
    <Link to="/estadisticas">
      <button2>Estadísticas de Pedidos</button2>
    </Link>
    <Link to="/alertas">
      <button2>Alertas y Notificaciones</button2>
    </Link>
    <Link to="/gestion-usuarios">
      <button2>Gestión de Usuarios</button2>
    </Link>
  </div>
</div>
  );
};

export default Dashboard;
