import axios from 'axios';

const API_URL = 'https://carpasan21.com:3000';

export const fetchProductos = async () => {
  try {
    const response = await axios.get(`${API_URL}/productos`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los productos.');
  }
};
