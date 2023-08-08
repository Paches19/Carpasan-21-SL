import React, { useState } from 'react';

function OrderHistory({ orders }) {
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

  return (
    <div className={`order-card ${expanded ? 'expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
      <div className="order-header">
        <span>Pedido #{order.ID_Pedido} por {order.Nombre} {order.Apellido}</span>
        <span className="order-status">{order.EstadoPedido}</span>
      </div>
      <div className="order-details">
        <div>Dirección: {order.Direccion}</div>
        <div>Email: {order.Email}</div>
        <div>Teléfono: {order.Telefono}</div>
        <div>Opción de Envío: {order.OpcionEnvio}</div>
        <div>Info Extra: {order.InfoExtra}</div>
        {order.productos.map(product => (
          <div className="product-item" key={product.ID_Producto}>
            <span className="product-name">{product.NombreProducto}</span>
            <span className="product-price">${product.Precio}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderHistory;
