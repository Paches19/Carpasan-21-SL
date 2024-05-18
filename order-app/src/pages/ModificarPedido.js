import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";

function ModificarPedido() {
  const { id: pedidoId } = useParams();
  const [pedido, setPedido] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [opcionEnvio, setOpcionEnvio] = useState("");
  const [infoExtra, setInfoExtra] = useState("");
  const [estadoPedido, setEstadoPedido] = useState("");
  const [detallesPedidos, setDetallesPedidos] = useState([]);
  const [todosLosProductos, setTodosLosProductos] = useState([]);

  useEffect(() => {
    fetch("http://carpasan21.com/react/productos")
      .then((res) => res.json())
      .then((data) => {
        setTodosLosProductos(data);
      });
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://carpasan21.com/react/pedido/${pedidoId}`)
      .then((res) => res.json())
      .then((data) => {
        setPedido(data);
        setNombre(data.Nombre);
        setApellido(data.Apellido);
        setDireccion(data.Direccion);
        setTelefono(data.Telefono);
        setEmail(data.Email);
        setOpcionEnvio(data.OpcionEnvio);
        setInfoExtra(data.InfoExtra);
        setEstadoPedido(data.EstadoPedido);
        setDetallesPedidos(data.productos);
      });
  }, [pedidoId]);

  const handleSave = () => {
    // Save the main order data
    fetch(`http://carpasan21.com/react/modificarPedido/${pedidoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Nombre: nombre,
        Apellido: apellido,
        Direccion: direccion,
        Telefono: telefono,
        Email: email,
        OpcionEnvio: opcionEnvio,
        InfoExtra: infoExtra,
        EstadoPedido: estadoPedido,
        Productos: detallesPedidos,
      }),
    })
      .then(() => {
        navigate(`/pedido/${pedidoId}`);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const opcionesProductos = todosLosProductos.map((producto) => ({
    value: producto.ID_Producto,
    label: producto.NombreProducto,
  }));

  const handleProductoChange = (index, selectedOption) => {
    const newID = selectedOption.value;
    const newDetalles = [...detallesPedidos];
    newDetalles[index].ID_Producto = newID;
    setDetallesPedidos(newDetalles);
  };

  const handleCantidadChange = (index, e) => {
    const newCantidad = e.target.value; // Aquí actualizamos
    const newDetalles = [...detallesPedidos];
    newDetalles[index].Cantidad = newCantidad;
    setDetallesPedidos(newDetalles);
  };

  const handleRemoveProduct = (index) => {
    const newDetalles = [...detallesPedidos];
    newDetalles.splice(index, 1);
    setDetallesPedidos(newDetalles);
  };

  const handleAddProduct = () => {
    setDetallesPedidos([
      ...detallesPedidos,
      { ID_Producto: null, Cantidad: 1 },
    ]);
  };

  return (
    <div className="modificar-pedido-container">
      <button
        className="back-button"
        onClick={() => navigate("/HistorialPedidos")}
      >
        ← Volver
      </button>
      <form>
        <div className="input-group">
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Apellido</label>
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
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
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
          <label>Opción de Envío:</label>
          <select
            value={opcionEnvio}
            onChange={(e) => setOpcionEnvio(e.target.value)}
          >
            <option value="recoger">recoger</option>
            <option value="domicilio">a domicilio</option>
          </select>
        </div>

        <div className="input-group">
          <label>Información Extra:</label>
          <textarea
            rows="4"
            value={infoExtra}
            onChange={(e) => setInfoExtra(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Estado del Pedido:</label>
          <select
            value={estadoPedido}
            onChange={(e) => setEstadoPedido(e.target.value)}
          >
            <option value="Recibido">Recibido</option>
            <option value="Procesado">Procesado</option>
            <option value="Enviado">Enviado</option>
            <option value="Entregado">Entregado</option>
          </select>
        </div>

        <div className="input-group">
          <label>Productos </label>
          <div>
            {" "}
            <button
              type="button"
              className="button-outline"
              onClick={handleAddProduct}
            >
              Añadir Producto
            </button>
          </div>

          {detallesPedidos.map((detalle, index) => {
            const productoSeleccionado = todosLosProductos.find(
              (producto) => producto.ID_Producto === detalle.ID_Producto
            );

            const productoNombre = productoSeleccionado
              ? productoSeleccionado.NombreProducto
              : "";
            return (
              <div className="product-group" key={index}>
                <div className="product-select">
                  <Select
                    className="custom-select"
                    options={opcionesProductos}
                    value={{
                      value: detalle.ID_Producto,
                      label: productoNombre,
                    }}
                    onChange={(selectedOption) =>
                      handleProductoChange(index, selectedOption)
                    }
                  />
                </div>
                <div className="product-quantity">
                  <input
                    type="number"
                    value={detalle.Cantidad}
                    onChange={(e) => handleCantidadChange(index, e)}
                  />
                  <span>kg</span>
                </div>
                <button
                  type="button"
                  className="button-outline"
                  onClick={() => handleRemoveProduct(index)}
                >
                  Eliminar
                </button>
              </div>
            );
          })}
        </div>

        <div className="button-group">
          <button type="button" onClick={handleSave}>
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}

export default ModificarPedido;
