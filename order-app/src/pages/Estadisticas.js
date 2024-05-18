import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';

export default function Estadisticas() {
  const [expandedChart, setExpandedChart] = useState(null);

  const handleChartClick = (chartType) => {
    setExpandedChart(expandedChart === chartType ? null : chartType);
  };

  return (
    <div>   
      <div className="charts-container">
        <div
          className={`chart-small ${expandedChart === "ventasTotales" ? "expanded" : ""}`}
          onClick={() => handleChartClick("ventasTotales")}
        >
          <h3>Ventas Totales</h3>
          {expandedChart === "ventasTotales" && <VentasTotalesChart />}
        </div>

        <div
          className={`chart-small ${expandedChart === "ventasPorProducto" ? "expanded" : ""}`}
          onClick={() => handleChartClick("ventasPorProducto")}
        >
          <h3>Ventas por Producto</h3>
          {expandedChart === "ventasPorProducto" && <VentasPorProductoChart />}
        </div>
      </div>
    </div>
  );
}

function VentasTotalesChart() {
  const [ventasTotalesData, setVentasTotalesData] = useState({});

  useEffect(() => {
    fetch("http://carpasan21.com/react/ventasTotalesPorMes")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          const meses = data.map((item) => new Date(item.fecha).getUTCMonth() + 1);
          const ventas = data.map((item) => item.TotalVentas || 0);
          data.forEach((item) => {
            console.log(item.fecha);
          });
          setVentasTotalesData({
            labels: meses.map(monthNumber => getMonthName(monthNumber)),
            datasets: [
              {
                label: "Ventas Totales por Mes",
                data: ventas,
                backgroundColor: "#800000", // Color para todas las barras
                hoverBackgroundColor: "#C04000", // Color al pasar el mouse
                borderWidth: 1,
                borderColor: "#800000", // Color del borde
                barPercentage: 0.8, // Porcentaje de ancho de las barras
              },
            ],
          });
        }
      });
  }, []);

  return Object.keys(ventasTotalesData).length > 0 ? (
    <Bar 
      data={ventasTotalesData}
      options={{
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Ventas (Euros)',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Meses',
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: context => `Ventas: ${context.parsed.y}`,
            },
          },
        },
      }} 
    />
  ) : null;
}

function VentasPorProductoChart() {
  const [ventasPorProductoData, setVentasPorProductoData] = useState({});

  useEffect(() => {
    fetch("https://carpasan21.com:3001/ventasPorProducto")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          const productos = data.map((item) => item.NombreProducto);
          const ventas = data.map((item) => item.TotalVentas || 0); // Si es null, asigna 0

          setVentasPorProductoData({
            labels: productos,
            datasets: [
              {
                label: "Ventas por Producto",
                data: ventas,
                backgroundColor: "#800000", // Color para todas las barras
                hoverBackgroundColor: "#C04000", // Color al pasar el mouse
                borderWidth: 1,
                borderColor: "#800000", // Color del borde
                barPercentage: 0.8, // Porcentaje de ancho de las barras
              },
            ],
          });
        }
      });
  }, []);

  return Object.keys(ventasPorProductoData).length > 0 ? (
    <Bar 
      data={ventasPorProductoData}
      options={{
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Ventas (Euros)',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Productos',
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: context => `Ventas: ${context.parsed.y}`,
            },
          },
        },
      }} 
    />
  ) : null;
}

function getMonthName(monthNumber) {
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  return monthNames[monthNumber - 1];
}
