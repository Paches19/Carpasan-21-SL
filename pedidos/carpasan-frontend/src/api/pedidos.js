import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const fetchPedidos = async () => {
  try {
    const response = await axios.get(`${API_URL}/pedidos`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los pedidos.');
  }
};

export const createPedido = async (pedido) => {
  try {
    const response = await axios.post(`${API_URL}/pedidos`, pedido);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el pedido.');
  }
};

export const updatePedido = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/pedido/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar el pedido.');
  }
};

export const deletePedido = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/pedido/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar el pedido.');
  }
};