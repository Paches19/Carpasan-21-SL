import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getOrders } from '../api/pedidos';

const HistorialPedidos = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <Navbar />
      <h2>Historial de Pedidos</h2>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            Pedido {order.id}: {order.description} - {order.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistorialPedidos;