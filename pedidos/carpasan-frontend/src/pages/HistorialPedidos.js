import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function applyFilters(orders, searchTerm, startMonth, endMonth, specificDate) {
  return orders
    .filter((order) => {
      if (searchTerm) {
        const fullName = `${order.Nombre} ${order.Apellido}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      }
      return true;
    })
    .filter((order) => {
      if (startMonth) {
        const orderDate = new Date(order.FechaPedido);
        const startDate = new Date(startMonth);
        return orderDate >= startDate;
      }
      return true;
    })
    .filter((order) => {
      if (endMonth) {
        const orderDate = new Date(order.FechaPedido);
        const endDate = new Date(endMonth);
        endDate.setMonth(endDate.getMonth() + 1); // Para que sea inclusive
        return orderDate < endDate;
      }
      return true;
    })
    .filter((order) => {
    if (specificDate) {
      const orderDate = new Date(order.FechaPedido);
      const filterDate = new Date(specificDate);
      return orderDate >= filterDate;
       
    }
    return true;
    });
  }

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startMonth, setStartMonth] = useState(null);
  const [endMonth, setEndMonth] = useState(null);
  const [specificDate, setSpecificDate] = useState(null);

  const filteredOrders = useMemo(
    () => applyFilters(orders, searchTerm, startMonth, endMonth, specificDate),
    [orders, searchTerm, startMonth, endMonth, specificDate]
  );

  useEffect(() => {
    fetch("http://localhost:3001/HistorialPedidos")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los pedidos");
        }
        return response.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="orders-container">
        {" "}
        <h6>No hay pedidos disponibles</h6>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="filter-section">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <input
          type="month"
          placeholder="Desde mes (inclusive)"
          value={startMonth}
          onChange={(e) => setStartMonth(e.target.value)}
        />

        <input
          type="month"
          placeholder="Hasta mes (inclusive)"
          value={endMonth}
          onChange={(e) => setEndMonth(e.target.value)}
        />

        <input
          type="date"
          placeholder="Desde una fecha concreta"
          value={specificDate || ""}
          onChange={(e) => setSpecificDate(e.target.value)}
        />

        <button
          onClick={() => {
            setSearchTerm("");
            setStartMonth("");
            setEndMonth("");
            setSpecificDate(""); // Añade esto para restablecer el filtro de fecha concreta
          }}
        >
          Limpiar Filtros
        </button>
      </div>
      {filteredOrders.map((order) => (
        <OrderCard key={order.ID_Pedido} order={order} />
      ))}
    </div>
  );
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const formattedDate = new Date(order.FechaPedido).toLocaleString();
  const navigate = useNavigate();

  return (
    <div className={`order-card ${expanded ? "expanded" : ""}`}>
      <div className="order-header" onClick={() => setExpanded(!expanded)}>
        <h2>Pedido #{order.ID_Pedido}</h2>
        <div className="header-right">
          <button
            className="button3"
            onClick={() => navigate(`/pedido/${order.ID_Pedido}`)}
          >
            Abrir Pedido
          </button>
          <span className="order-status">{order.EstadoPedido}</span>
        </div>
      </div>
      <div className="order-client">
        👤 {order.Nombre} {order.Apellido}
      </div>
      <div className="order-details">
        <div>
          📍 <det>Dirección:</det> {order.Direccion}
        </div>
        <div>
          ✉️ <det>Email:</det> {order.Email}
        </div>
        <div>
          📞 <det>Teléfono:</det> {order.Telefono}
        </div>
        <div>
          🚚 <det>Opción de Envío:</det> {order.OpcionEnvio}
        </div>
        <div>
          📝 <det>Info Extra:</det> {order.InfoExtra}
        </div>
        <div>
          📅 <det>Fecha de pedido:</det> {formattedDate}
        </div>
      </div>
    </div>
  );
}

export default OrderHistory;
