import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageOrders from './pages/ManageOrders';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/Dashboard" component={Dashboard} />
        <Route path="/gestion-pedidos" component={ManageOrders} />
        {/* Puedes agregar más rutas según sea necesario */}
      </Switch>
    </Router>
  );
}

export default App;