/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   products.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/07/11 19:12:25 by adpachec          #+#    #+#             */
/*   Updated: 2023/07/12 20:37:31 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

class Producto {
    constructor(nombre, precio, imagen, tags, descripcion) {
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.tags = tags;
        this.descripcion = descripcion;
    }
}

let productos = [
    new Producto('Lomo de vaca', 19.99, '/Carpasan-21-SL/images/vaca.jpg', ['vaca'], ''),
    new Producto('Chuleton de buey', 12.99, '/Carpasan-21-SL/images/chuleton.png', ['vaca'], 'Chuleton de buey gallego madurado 60 días'),
    new Producto('Lomo de cerdo', 11.99, '/Carpasan-21-SL/images/cerdo.jpg', ['cerdo'], ''),
    new Producto('Chuletas de cerdo', 10.99, '/Carpasan-21-SL/images/chuletacerdo.jpg', ['cerdo'], ''),
    new Producto('Pechuga de pollo', 9.99, '/Carpasan-21-SL/images/pechugaPollo.jpg', ['pollo'], ''),
    new Producto('Alitas de pollo', 1.99, '/Carpasan-21-SL/images/alitas.png', ['pollo'], ''),
    new Producto('Chorizo dulce', 120.99, '/Carpasan-21-SL/images/chorizoDulce.png', ['embutido'], ''),
    new Producto('Chorizo picante', 102.99, '/Carpasan-21-SL/images/chorizo.png', ['embutido'], ''),
];

let filtros = ['Todo', 'Vaca', 'Pollo', 'Cerdo', 'Embutido', 'Especiales', 'Packs'];
let productosMostrados = [...productos]; // Array para almacenar los productos mostrados
let columnasSeleccionadas = 3; // Columnas seleccionadas por defecto

window.onload = function() {
    generarFiltros();
    mostrarProductos(productosMostrados);
};

function generarFiltros() {
    let ul = document.querySelector('#filtroTags');
    for(let filtro of filtros) {
        let li = document.createElement('li');
        li.innerHTML = `<button onclick="filtrarProductos('${filtro.toLowerCase()}')">${filtro}</button>`;
        ul.appendChild(li);
    }
}

function filtrarProductos(tag) {
    if (tag === 'todo') {
        productosMostrados = [...productos];
    } else {
        productosMostrados = productos.filter(p => p.tags.includes(tag));
    }
    mostrarProductos(productosMostrados);
}

function mostrarProductos(productosMostrar) {
    let div = document.querySelector('#gridProductos');
    div.innerHTML = '';
    div.style.gridTemplateColumns = `repeat(${columnasSeleccionadas}, 1fr)`;

    for(let producto of productosMostrar) {
        let divProducto = document.createElement('div');
        divProducto.className = 'producto';
        divProducto.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h2>${producto.nombre}</h2>
            <p class="descripcion">${producto.descripcion}</p>
            <p class="precio">Precio: ${producto.precio} €/kg</p>
        `;

        div.appendChild(divProducto);
    }
}

function seleccionarColumnas(columnas) {
    columnasSeleccionadas = columnas;
    mostrarProductos(productosMostrados);
}

document.addEventListener('DOMContentLoaded', function () {
	let ordenarSelect = document.getElementById('ordenar');
	ordenarSelect.addEventListener('change', function () {
	ordenarProductos(ordenarSelect.value);
});

function ordenarProductos(criterio) {
	switch (criterio) {
		case 'menorPrecio':
		productosMostrados.sort((a, b) => a.precio - b.precio);
		break;
		case 'mayorPrecio':
		productosMostrados.sort((a, b) => b.precio - a.precio);
		break;
		case 'alfabetico':
		productosMostrados.sort((a, b) =>
			a.nombre.localeCompare(b.nombre)
		);
		break;
		case 'destacado':
		productosMostrados = productos.filter((p) =>
			p.tags.includes('destacado')
		);
		break;
		case 'valorado':
		// Implementa tu lógica de ordenación por valoración aquí
		productosMostrados = [...productos]; // Muestra todos los productos sin ordenar por ahora
		break;
		default:
		productosMostrados = [...productos]; // Restablece el orden original
		break;
	}
	mostrarProductos(productosMostrados);
	}

	// Mostrar los productos inicialmente
	mostrarProductos(productosMostrados);
});