import React, { useState, useEffect } from "react";
import { createPedido } from "../api/pedidos";
import "./CreateOrder.css";
import { fetchProductos } from "../api/productos";

function CreateOrder() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [opcionEnvio, setOpcionEnvio] = useState("");
  const [infoExtra, setInfoExtra] = useState("");
  const [productos, setProductos] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [error, setError] = useState("");
  const [estadoPedido, setEstadoPedido] = useState("Recibido");

  useEffect(() => {
    const loadProductos = async () => {
      try {
        const productosData = await fetchProductos();
        setProductos(productosData);

        // Inicializa selectedProducts con 0 cantidad
        const initialProductState = {};
        productosData.forEach((product) => {
          initialProductState[product.ID_Producto] = 0;
        });
        setSelectedProducts(initialProductState);
      } catch (err) {
        setError("Error al cargar productos.");
      }
    };

    loadProductos();
  }, []);

  // const handleProductChange = (productId, quantity) => {
  //   setSelectedProducts((prev) => ({
  //     ...prev,
  //     [productId]: quantity,
  //   }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const pedidoData = {
        Nombre: nombre,
        Apellido: apellido,
        Direccion: direccion,
        Telefono: telefono,
        Email: email,
        OpcionEnvio: opcionEnvio,
        InfoExtra: infoExtra,
        EstadoPedido: estadoPedido,
        Productos: Object.entries(selectedProducts).filter(
          ([id, cantidad]) => cantidad > 0
        ), // Filtra productos con cantidad 0
      };

      // Aquí estás creando el pedido
      const response = await createPedido(pedidoData);

      if (response && response.success) {
        // Si deseas, puedes agregar una notificación para el usuario de que se creó con éxito.
        alert("Pedido creado con éxito!");
      } else {
        throw new Error(response.message || "Error al crear pedido.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main>
      <header>
        <img src="/path_to_logo.png" alt="Logo Empresa" />
        <h2>Nombre de la Empresa</h2>
      </header>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Apellido:</label>
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Dirección:</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Teléfono:</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            pattern="\d*"
            maxLength="10"
          />
        </div>

        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="opcionEnvio">Opción de envío:</label>
          <select
            id="opcionEnvio"
            value={opcionEnvio}
            onChange={(e) => setOpcionEnvio(e.target.value)}
          >
            <option value="Recoger">Recoger</option>
            <option value="A domicilio">A domicilio</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="infoExtra">Información extra:</label>
          <textarea
            id="infoExtra"
            value={infoExtra}
            onChange={(e) => setInfoExtra(e.target.value)}
          ></textarea>
        </div>

        <div className="input-group">
          <label htmlFor="estadoPedido">Estado del pedido:</label>
          <select
            id="estadoPedido"
            value={estadoPedido}
            onChange={(e) => setEstadoPedido(e.target.value)}
          >
            <option value="Recibido">Recibido</option>
            <option value="Procesado">Procesado</option>
            <option value="Enviado">Enviado</option>
            <option value="Entregado">Entregado</option>
          </select>
        </div>

        {productos.map((product) => (
          <div className="input-group" key={product.ID_Producto}>
            <label>
              {product.NombreProducto} - ${product.Precio.toFixed(2)}
            </label>
            <input
              type="number"
              min="0"
              value={selectedProducts[product.ID_Producto] || 0}
              onChange={(e) =>
                setSelectedProducts((prevState) => ({
                  ...prevState,
                  [product.ID_Producto]: Number(e.target.value),
                }))
              }
            />
          </div>
        ))}
        <button type="submit">Crear Pedido</button>
      </form>
    </main>
  );
}

export default CreateOrder;
