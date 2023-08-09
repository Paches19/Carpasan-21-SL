import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function toggleProcesado(pedidoId, productId, producto, setPedido) {
  fetch(`/api/pedido/${pedidoId}/producto/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ procesado: !producto.procesado }),
  })
    .then(() => {
      setPedido((prev) => {
        const updatedProductos = prev.productos.map((p) => {
          if (p.ID_Producto === productId) {
            return { ...p, procesado: !p.procesado };
          }
          return p;
        });
        return { ...prev, productos: updatedProductos };
      });
    })
    .catch((err) => console.error(err));
}

function PedidoDetalle() {
  const { id: pedidoId } = useParams();
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(`Fetching pedido with ID: ${pedidoId}`);
    fetch(`http://localhost:3001/pedido/${pedidoId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Data from server:", data);
        setPedido(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, [pedidoId]);

  if (error) return <div>Error: {error}</div>;
  if (!pedido) return <div>Cargando...</div>;

  return (
    <div className="pedido-detalle-container">
      <h4>Detalles del Pedido #{pedido.ID_Pedido}</h4>
      <div className="cliente-info">
        <div>
          <h7>Nombre:</h7> <h8>{pedido.Nombre} {pedido.Apellido}</h8>
        </div>
        <div>
          <h7>Dirección:</h7> <h8>{pedido.Direccion}</h8>
        </div>
        <div>
          <h7>Email:</h7> <h8>{pedido.Email}</h8>
        </div>
        <div>
          <h7>Teléfono:</h7> <h8>{pedido.Telefono}</h8>
        </div>
        <div>
          <h7>Opción de Envío:</h7> <h8>{pedido.OpcionEnvio}</h8>
        </div>
        <div>
          <h7>Info Extra:</h7> <h8>{pedido.InfoExtra}</h8>
        </div>
      </div>
      <h3>Productos</h3>
      <ul className="productos-lista">
        {pedido.productos.map((producto) => (
          <li key={producto.ID_Producto} className="producto-item">
            <span className="producto-item-name">
              {producto.NombreProducto}
            </span>
            <span className="producto-item-quantity">
              {producto.Cantidad} kg
            </span>
            <span className="producto-item-check">
              <input
                type="checkbox"
                checked={producto.procesado}
                onChange={() =>
                  toggleProcesado(
                    pedidoId,
                    producto.ID_Producto,
                    producto,
                    setPedido
                  )
                }
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PedidoDetalle;
