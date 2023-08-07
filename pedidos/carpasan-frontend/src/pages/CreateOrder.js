import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './CreateOrder.css';

const API_URL = 'http://localhost:3000';

const CreateOrder = () => {
  const [formData, setFormData] = useState({
      productName: '',
      quantity: '',
      // ...otros campos relacionados con el pedido
  });
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleChange = (e) => {
      setFormData({
          ...formData,
          [e.target.name]: e.target.value
      });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          await axios.post(`${API_URL}/pedidos`, formData);
          history.push('/dashboard'); // redirige al usuario al dashboard después de crear el pedido
      } catch (err) {
          setError('Error al crear el pedido. Inténtelo de nuevo.');
      }
  };

  return (
      <div>
          <header>
              {/* Aquí puedes colocar tu logo y el nombre de la empresa */}
          </header>

          <main>
              <h2>Crear Pedido</h2>
              {error && <div className="error">{error}</div>}

              <form onSubmit={handleSubmit}>
                  <div>
                      <label>Nombre del Producto:</label>
                      <input type="text" name="productName" value={formData.productName} onChange={handleChange} required />
                  </div>
                  <div>
                      <label>Cantidad:</label>
                      <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
                  </div>
                  {/* ...otros campos del formulario relacionados con el pedido... */}

                  <button type="submit">Crear Pedido</button>
              </form>
          </main>
      </div>
  );
}

export default CreateOrder;