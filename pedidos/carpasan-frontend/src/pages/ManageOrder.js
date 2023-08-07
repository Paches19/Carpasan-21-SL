import React, { useState, useEffect } from 'react';
import { fetchPedidos, createPedido, updatePedido, deletePedido } from '../api/pedidos';

const ManageOrders = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const getPedidos = async () => {
      const data = await fetchPedidos();
      setPedidos(data);
    };

    getPedidos();
  }, []);

  return (
    <div>
      <h1>Gestionar Pedidos</h1>
      {/* Renderizar la lista de pedidos y proporcionar opciones para crear, modificar y eliminar pedidos */}
    </div>
  );
};

export default ManageOrders;