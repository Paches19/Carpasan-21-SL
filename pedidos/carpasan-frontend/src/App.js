import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/DashBoard";
import HistorialPedidos from "./pages/HistorialPedidos";
import ManageOrders from "./pages/ManageOrder";
import { AuthProvider } from "./utils/authContext";
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} exact />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/HistorialPedidos" element={<HistorialPedidos />} />
          <Route path="/gestion-pedidos" element={<ManageOrders />} />
          {/* Puedes agregar más rutas según sea necesario  */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
