import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/HistorialPedidos')
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al obtener los pedidos");
        }
        return response.json();
      })
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!orders || orders.length === 0) {
    return <div className="orders-container"> <h6>No hay pedidos disponibles</h6></div>;
  }

  return (
    <div className="orders-container">
      {orders.sort((a, b) => b.ID_Pedido - a.ID_Pedido).map(order => (
        <OrderCard key={order.ID_Pedido} order={order} />
      ))}
    </div>
  );
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const formattedDate = new Date(order.FechaPedido).toLocaleString();

  return (
    <div className={`order-card ${expanded ? 'expanded' : ''}`}>
    <div className="order-header" onClick={() => setExpanded(!expanded)}>  
        <h2>Pedido #{order.ID_Pedido}</h2>
        <span className="order-status">{order.EstadoPedido}</span>
    </div>
    <div className="order-client">👤 {order.Nombre} {order.Apellido}</div>
    <div className="order-details">
        <div>📍 Dirección: {order.Direccion}</div>
        <div>✉️ Email: {order.Email}</div>
        <div>📞 Teléfono: {order.Telefono}</div>
        <div>🚚 Opción de Envío: {order.OpcionEnvio}</div>
        <div>📝 Info Extra: {order.InfoExtra}</div>
        <div>📅 Fecha de pedido: {formattedDate}</div>
    </div>
    <Link to={`/pedido/${order.ID_Pedido}`}>Ver Detalles</Link>
</div>
  );
}

export default OrderHistory;
