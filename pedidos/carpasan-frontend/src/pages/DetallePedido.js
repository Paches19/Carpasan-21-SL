import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function toggleProcesado(pedidoId, productId, producto, setPedido) {
    fetch(`/api/pedido/${pedidoId}/producto/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ procesado: !producto.procesado }),
    })
        .then(() => {
            setPedido(prev => {
                const updatedProductos = prev.productos.map(p => {
                    if (p.ID_Producto === productId) {
                        return { ...p, procesado: !p.procesado };
                    }
                    return p;
                });
                return { ...prev, productos: updatedProductos };
            });
        })
        .catch(err => console.error(err));
}

function PedidoDetalle() {
    const { id: pedidoId } = useParams();
    const [pedido, setPedido] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		console.log(`Fetching pedido with ID: ${pedidoId}`);
		fetch(`/api/pedido/${pedidoId}`)
			.then(res => {
				if (!res.ok) {
					throw new Error(`Error ${res.status}: ${res.statusText}`);
				}
				return res.json();
			})
			.then(data => {
				console.log("Data from server:", data);
				setPedido(data);
			})
			.catch(err => {
				console.error(err);
				setError(err.message);
			});
	}, [pedidoId]);

	if (error) return <div>Error: {error}</div>;
    if (!pedido) return <div>Cargando...</div>;

    return (
        <div className="pedido-detalle-container">
            <h2>Detalles del Pedido #{pedido.ID_Pedido}</h2>
            <div className="cliente-info">
                <div><strong>Nombre:</strong> {pedido.Nombre} {pedido.Apellido}</div>
                <div><strong>Dirección:</strong> {pedido.Direccion}</div>
                <div><strong>Email:</strong> {pedido.Email}</div>
                <div><strong>Teléfono:</strong> {pedido.Telefono}</div>
                <div><strong>Opción de Envío:</strong> {pedido.OpcionEnvio}</div>
                <div><strong>Info Extra:</strong> {pedido.InfoExtra}</div>
            </div>
            <h3>Productos:</h3>
            <ul className="productos-lista">
                {pedido.productos.map(producto => (
                    <li key={producto.ID_Producto} className="producto-item">
                        <span>{producto.NombreProducto} - {producto.Cantidad} unidades</span>
                        <input 
                            type="checkbox" 
                            checked={producto.procesado} 
                            onChange={() => toggleProcesado(pedidoId, producto.ID_Producto, producto, setPedido)}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PedidoDetalle;
