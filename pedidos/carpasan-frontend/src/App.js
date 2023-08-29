import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { AuthProvider } from "./utils/authContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/DashBoard";
import HistorialPedidos from "./pages/HistorialPedidos";
import DetallePedido from "./pages/DetallePedido";
import ManageProducts from "./pages/ManageProducts";
import EditProductPage from "./pages/EditProductPage";
import ProtectedRoute from "./utils/ProtectedRoute";
import AddProduct from "./pages/AddProduct";
import Estadisticas from "./pages/Estadisticas";
import ModificarPedido from "./pages/ModificarPedido";
import CreateOrder from "./pages/CreateOrder";
import "./App.css"


function App() {
  
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
          <Route path="/HistorialPedidos" element={<ProtectedRoute component={HistorialPedidos} />} />
          <Route path="/pedido/:id" element={<ProtectedRoute component={DetallePedido} />} />
          <Route path="/ManageProducts" element={<ProtectedRoute component={ManageProducts} />} />
          <Route path="/edit-product/:id" element={<ProtectedRoute component={EditProductPage} />} />
          <Route path="/add-product" element={<ProtectedRoute component={AddProduct} />} />
          <Route path="/estadisticas" element={<ProtectedRoute component={Estadisticas} />} />
          <Route path="/modificarPedido/:id"  element={<ProtectedRoute component={ModificarPedido} />} />
          <Route path="/crearPedido"  element={<ProtectedRoute component={CreateOrder} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;