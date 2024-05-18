
import axios from 'axios';

const API_URL = 'http://carpasan21.com:2080'; // URL de tu backend

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/react/iniciar-sesion`, {
      username,
      password
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Error al iniciar sesión');
  }
};

export const logout = () => {
  // Elimina el token de autenticación del localStorage (o cualquier otro lugar donde lo almacenes)
  localStorage.removeItem('authToken');
};