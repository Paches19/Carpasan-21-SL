import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/DashBoard';
import ManageOrders from './pages/ManageOrder';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} exact />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/gestion-pedidos" element={<ManageOrders />} />
        {/* Puedes agregar más rutas según sea necesario  */}
      </Routes>
    </Router>
  );
}

export default App;