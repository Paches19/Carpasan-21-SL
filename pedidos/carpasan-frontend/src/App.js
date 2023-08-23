import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/DashBoard";
import HistorialPedidos from "./pages/HistorialPedidos";
import DetallePedido from "./pages/DetallePedido";
import ManageProducts from "./pages/ManageProducts";
import EditProductPage from "./pages/EditProductPage";
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
          <Route path="/pedido/:id" element={<DetallePedido />} />
          <Route path="/ManageProducts" element={<ManageProducts />} />
          <Route path="/edit-product/:id" element={<EditProductPage />} />
          {/* Puedes agregar más rutas según sea necesario  */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
