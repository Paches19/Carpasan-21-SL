import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function applyFilters(
  orders,
  searchTerm,
  startMonth,
  endMonth,
  specificDate,
  selectedStates
) {
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
    })
    .filter((order) => {
      if (selectedStates.length > 0) {
        return selectedStates.includes(order.EstadoPedido);
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
  const [selectedStates, setSelectedStates] = useState([]);
  const navigate = useNavigate();

  const filteredOrders = useMemo(
    () =>
      applyFilters(
        orders,
        searchTerm,
        startMonth,
        endMonth,
        specificDate,
        selectedStates
      ),
    [orders, searchTerm, startMonth, endMonth, specificDate, selectedStates]
  );

  const handleStateSelection = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedStates((prev) => [...prev, value]);
    } else {
      setSelectedStates((prev) => prev.filter((state) => state !== value));
    }
  };

  useEffect(() => {
    fetch("http://carpasan21.com:2080/react/HistorialPedidos")
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
        <div className="state-filter-section">
          <h5>Filtrar por estado</h5>
          <label className="state-checkbox">
            <input
              type="checkbox"
              value="Recibido"
              checked={selectedStates.includes("Recibido")}
              onChange={(e) => handleStateSelection(e)}
            />{" "}
            Recibido
          </label>
          <label className="state-checkbox">
            <input
              type="checkbox"
              value="Procesado"
              checked={selectedStates.includes("Procesado")}
              onChange={(e) => handleStateSelection(e)}
            />{" "}
            Procesado
          </label>
          <label className="state-checkbox">
            <input
              type="checkbox"
              value="Enviado"
              checked={selectedStates.includes("Enviado")}
              onChange={(e) => handleStateSelection(e)}
            />{" "}
            Enviado
          </label>
          <label className="state-checkbox">
            <input
              type="checkbox"
              value="Entregado"
              checked={selectedStates.includes("Entregado")}
              onChange={(e) => handleStateSelection(e)}
            />{" "}
            Entregado
          </label>
        </div>
        <button
          onClick={() => {
            setSearchTerm("");
            setStartMonth("");
            setEndMonth("");
            setSpecificDate("");
            setSelectedStates([]);
          }}
        >
          Limpiar Filtros
        </button>
        <button
          className="add-order-button"
          onClick={() => navigate(`/crearPedido`)} // Asume que la URL para crear un nuevo pedido es "/nuevoPedido"
        >
          Añadir Pedido
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

  const getOrderStatusClass = (estado) => {
    switch (estado) {
      case "Procesado":
        return "order-status-procesado";
      case "Enviado":
        return "order-status-enviado";
      case "Entregado":
        return "order-status-entregado";
      default:
        return "";
    }
  };

  const handleDelete = (orderId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este pedido?")) {
      if (orderId)
      {
        fetch(`http://carpasan21.com:2080/react/pedidos/${orderId}`, {
          method: 'DELETE',
        })
        navigate("/Dashboard");
          setTimeout(() => {
            navigate("/HistorialPedidos");
          }, 50);
      }
      else
        console.log("Error orderId: " + orderId);
    }
  };

  return (
    <div className={`order-card ${expanded ? "expanded" : ""}`}>
      <div className="order-header" onClick={() => setExpanded(!expanded)}>
        <h2>Pedido #{order.ID_Pedido}</h2>
        <div className="header-right">
          <button
            className="button4"
            onClick={() => navigate(`/modificarPedido/${order.ID_Pedido}`)}
          >
            Modificar Pedido
          </button>
          <button
            className="button3"
            onClick={() => navigate(`/pedido/${order.ID_Pedido}`)}
          >
            Abrir Pedido
          </button>
          <span
            className={`order-status ${getOrderStatusClass(
              order.EstadoPedido
            )}`}
          >
            {order.EstadoPedido}
          </span>
          <button
          className="button3"
          onClick={() => handleDelete(order.ID_Pedido)}
        >
          Eliminar Pedido
        </button>
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
