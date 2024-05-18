import axios from 'axios';

const API_URL = 'http://carpasan21.com';

export const fetchProductos = async () => {
  try {
    const response = await axios.get(`${API_URL}/react/productos`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los productos.');
  }
};
