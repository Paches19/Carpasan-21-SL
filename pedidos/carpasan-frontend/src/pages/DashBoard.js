// src/pages/Dashboard.js

import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Navbar />
      <div className="panel-seleccion">
        <Link to="/historial">Historial de Pedidos</Link>
        <Link to="/manageorders">Modificar Pedidos</Link>
        <Link to="/createorder">Añadir Pedido</Link>
        <Link to="/deleteorder">Eliminar un Pedido</Link>
        {/* Aquí puedes agregar más links a otras funcionalidades, por ejemplo: */}
        <Link to="/estadisticas">Estadísticas de Pedidos</Link>
        <Link to="/alertas">Alertas y Notificaciones</Link>
        <Link to="/gestion-usuarios">Gestión de Usuarios</Link>
      </div>
    </div>
  );
};

export default Dashboard;
