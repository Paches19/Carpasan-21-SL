/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   products.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/07/11 19:12:25 by adpachec          #+#    #+#             */
/*   Updated: 2023/07/12 13:33:07 by adpachec         ###   ########.fr       */
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
    new Producto('Lomo de vaca', 19.99, '/Carpasan-21-SL/images/Carpasan.PNG', ['vaca'], ''),
    new Producto('Chuleton de buey', 12.99, '/Carpasan-21-SL/images/Carpasan.PNG', ['vaca'], 'Chuleton de buey gallego madurado 60 días'),
    new Producto('Lomo de cerdo', 12.99, '/Carpasan-21-SL/images/Carpasan.PNG', ['cerdo'], ''),
    new Producto('Chuletas de cerdo', 12.99, '/Carpasan-21-SL/images/Carpasan.PNG', ['cerdo'], ''),
    new Producto('Pechuga de pollo', 12.99, '/Carpasan-21-SL/images/Carpasan.PNG', ['pollo'], ''),
    new Producto('Alitas de pollo', 12.99, '/Carpasan-21-SL/images/Carpasan.PNG', ['pollo'], ''),
    new Producto('Chorizo dulce', 12.99, '/Carpasan-21-SL/images/Carpasan.PNG', ['embutido'], ''),
    new Producto('Chorizo picante', 12.99, '/Carpasan-21-SL/images/Carpasan.PNG', ['embutido'], ''),
];

let filtros = ['Todo', 'Vaca', 'Pollo', 'Cerdo', 'Embutido', 'Especiales', 'Packs'];

window.onload = function() {
    generarFiltros();
    mostrarProductos(3);
};

function generarFiltros() {
    let ul = document.querySelector('#filtroTags');
    for(let filtro of filtros) {
        let li = document.createElement('li');
        li.innerHTML = `<button onclick="filtrarProductos('${filtro.toLowerCase()}')">${filtro}</button>`;
        ul.appendChild(li);
    }
}

function mostrarProductos(columnas) {
    let div = document.querySelector('#gridProductos');
    div.innerHTML = '';
    div.style.gridTemplateColumns = `repeat(${columnas}, 1fr)`;

    for(let producto of productos) {
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

function filtrarProductos(tag) {
    let productosFiltrados = productos.filter(p => p.tags.includes(tag) || tag === 'todo');
    mostrarProductos(productosFiltrados, 3);
}

$(document).ready(function() {
    var $ordenar = $('#ordenar');
    var $ordenarWidth = $('#ordenarWidth');
  
    $ordenar.on('change', function () {
        $ordenarWidth.html($ordenar.find('option:selected').text());
        $ordenar.width($ordenarWidth.width());
    });

    $ordenar.trigger('change');
});