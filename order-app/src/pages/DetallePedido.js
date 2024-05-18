import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function toggleProcesado(pedidoId, productId, producto, setPedido) {
  fetch(`http://carpasan21.com:2080/react/pedido/${pedidoId}/producto/${productId}`, {
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
  const navigate = useNavigate();
  const estadosPosibles = ["Recibido", "Procesado", "Enviado", "Entregado"];
  const [estadoActual, setEstadoActual] = useState(
    pedido ? pedido.EstadoPedido : ""
  );

  useEffect(() => {
    console.log(`Fetching pedido with ID: ${pedidoId}`);
    fetch(`http://carpasan21.com:2080/react/pedido/${pedidoId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Data from server:", data);
        setPedido(data);
        setEstadoActual(data.EstadoPedido); // Establecer estadoActual con base en la respuesta
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, [pedidoId]);

  if (error) return <div>Error: {error}</div>;
  if (!pedido) return <div>Cargando...</div>;

  const calcularTotal = () =>
  pedido.productos.reduce(
    (total, producto) => total + producto.Cantidad * producto.Precio,
    0
  );

  const handleEstadoChange = (e) => {
    const nuevoEstado = e.target.value;
    setEstadoActual(nuevoEstado);

    fetch(`http://carpasan21.com:2080/pedido/${pedidoId}/estado`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado: nuevoEstado }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setPedido((prev) => ({ ...prev, EstadoPedido: nuevoEstado }));
        } else {
          console.error(
            "Error al actualizar estado: ",
            data.message || "Sin detalles"
          );
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');

    printWindow.document.write(`
    <html>
    <head>
      <title>Detalle del Pedido ${pedido.ID_Pedido}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        header, .container { text-align: center; }
        .logo img { max-width: 100px; }
        h1, h2, h3 { color: #333; }
        ul { list-style-type: none; padding: 0; }
        .producto-item { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .producto-item > span { flex: 1; text-align: right; }
        .producto-item > span:first-child { text-align: left; }
        .total { text-align: right; }
      </style>
    </head>
    <body>
      <header>
        <div class="logo">
          <img src="/Carpasan-21-SL/images/Carpasan-min.png" alt="Logo" />
        </div>
        <h1>Carnicería Carpasan 21 SL</h1>
        <h2>El sabor de la tradición</h2>
      </header>
      <hr>
      <h2>Información del Pedido</h2>
      <p><strong>Pedido #:</strong> ${pedido.ID_Pedido}</p>
      <p><strong>Cliente:</strong> ${pedido.Nombre} ${pedido.Apellido}</p>
      <p><strong>Dirección:</strong> ${pedido.Direccion}</p>
      <p><strong>Email:</strong> ${pedido.Email}</p>
      <p><strong>Teléfono:</strong> ${pedido.Telefono}</p>
      <p><strong>Opción de Envío:</strong> ${pedido.OpcionEnvio}</p>
      <p><strong>Info Extra:</strong> ${pedido.InfoExtra || 'N/A'}</p>
      <hr>
      <h2>Productos</h2>
      <ul>
        ${pedido.productos.map(producto => `
          <li class="producto-item">
            <span>${producto.NombreProducto}</span>
            <span>${producto.Cantidad} kg</span>
            <span>Subtotal: ${producto.Precio.toFixed(2)} €</span>
          </li>
        `).join('')}
      </ul>
      <h3 class="total">Total: ${calcularTotal().toFixed(2)} €</h3>
    </body>
  </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
  };

  return (
    <div className="detalles-wrapper">
      <button
        className="back-button"
        onClick={() => navigate("/HistorialPedidos")}
      >
        ← Volver
      </button>
      <div className="pedido-detalle-container">
        <div className="estado-pedido-container">
          <h4>Detalles del Pedido #{pedido.ID_Pedido}</h4>
          <div className={`estado-pedido ${estadoActual}`}>
            <h2>Estado: </h2>
            <select
              id="estadoSelect"
              value={estadoActual}
              onChange={handleEstadoChange}
              className="hiddenSelect"
            >
              {estadosPosibles.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="cliente-info">
          <div>
            <h7>Nombre:</h7>{" "}
            <h8>
              {pedido.Nombre} {pedido.Apellido}
            </h8>
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
              <span className="producto-item-quantity">
              Subtotal: {(producto.Cantidad * producto.Precio).toFixed(2)} €
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
          <h4>Total: {calcularTotal().toFixed(2)} €</h4>
          <div className="print-container">
          <button class="print-button" onClick={handlePrint}>Imprimir Pedido</button>
          </div>
      </div>
    </div>
  );
}

export default PedidoDetalle;
