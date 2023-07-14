/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   products.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/07/11 19:12:25 by adpachec          #+#    #+#             */
/*   Updated: 2023/07/14 14:12:25 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

let carrito = JSON.parse(localStorage.getItem("carrito")) || {};

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
  new Producto(
    "Lomo de vaca",
    19.99,
    "/Carpasan-21-SL/images/vaca.jpg",
    ["vacuno"],
    ""
  ),
  new Producto(
    "Chuleton de buey",
    12.99,
    "/Carpasan-21-SL/images/chuleton.png",
    ["vacuno"],
    "Chuleton de buey gallego madurado 60 días"
  ),
  new Producto(
    "Lomo de cerdo",
    11.99,
    "/Carpasan-21-SL/images/cerdo.jpg",
    ["cerdo"],
    ""
  ),
  new Producto(
    "Chuletas de cerdo",
    10.99,
    "/Carpasan-21-SL/images/chuletacerdo.jpg",
    ["cerdo"],
    ""
  ),
  new Producto(
    "Pechuga de pollo",
    9.99,
    "/Carpasan-21-SL/images/pechugaPollo.jpg",
    ["pollo"],
    ""
  ),
  new Producto(
    "Alitas de pollo",
    1.99,
    "/Carpasan-21-SL/images/alitas.png",
    ["pollo"],
    ""
  ),
  new Producto(
    "Chorizo dulce",
    120.99,
    "/Carpasan-21-SL/images/chorizoDulce.png",
    ["embutido"],
    ""
  ),
  new Producto(
    "Chorizo picante",
    102.99,
    "/Carpasan-21-SL/images/chorizo.png",
    ["embutido"],
    ""
  ),
];

let filtros = [
  "Todo",
  "Vacuno",
  "Pollo",
  "Cerdo",
  "Embutido",
  "Especiales",
  "Packs",
];

let productosMostrados = [...productos]; // Array para almacenar los productos mostrados
let columnasSeleccionadas = 3; // Columnas seleccionadas por defecto

window.onload = function () {
  generarFiltros();
  mostrarProductos(productosMostrados);
};

function generarFiltros() {
  let ul = document.querySelector("#filtroTags");
  for (let filtro of filtros) {
    let li = document.createElement("li");
    li.innerHTML = `<button onclick="filtrarProductos('${filtro.toLowerCase()}')">${filtro}</button>`;
    ul.appendChild(li);
  }
}

function filtrarProductos(tag) {
  if (tag === "todo") {
    productosMostrados = [...productos];
  } else {
    productosMostrados = productos.filter((p) => p.tags.includes(tag));
  }
  mostrarProductos(productosMostrados);
}

function seleccionarColumnas(columnas) {
  columnasSeleccionadas = columnas;
  mostrarProductos(productosMostrados);
}

document.addEventListener("DOMContentLoaded", function () {
  let ordenarSelect = document.getElementById("ordenar");
  ordenarSelect.addEventListener("change", function () {
    ordenarProductos(ordenarSelect.value);
  });

  function ordenarProductos(criterio) {
    switch (criterio) {
      case "menorPrecio":
        productosMostrados.sort((a, b) => a.precio - b.precio);
        break;
      case "mayorPrecio":
        productosMostrados.sort((a, b) => b.precio - a.precio);
        break;
      case "alfabetico":
        productosMostrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "destacado":
        productosMostrados = productos.filter((p) =>
          p.tags.includes("destacado")
        );
        break;
      case "valorado":
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

function mostrarProductos(productosMostrar) {
  let div = document.querySelector("#gridProductos");
  div.innerHTML = "";
  div.style.gridTemplateColumns = `repeat(${columnasSeleccionadas}, 1fr)`;

  for (let producto of productosMostrar) {
    let divProducto = document.createElement("div");
    divProducto.className = "producto";
    divProducto.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h2>${producto.nombre}</h2>
            <p class="descripcion">${producto.descripcion}</p>
            <div class="price-cart">
              <p class="precio">Precio: ${producto.precio} €/kg</p>
              <button class="add-to-cart" data-product="${producto.nombre}" data-price="${producto.precio}">
                <img src="/Carpasan-21-SL/images/CarritoCompra.png" alt="Añadir al carrito">
              </button>
            </div>
        `;
    div.appendChild(divProducto);
  }

  document.querySelectorAll(".add-to-cart").forEach(function (button) {
    button.addEventListener("click", function () {
      let nombreProducto = button.dataset.product;
      let precioProducto = parseFloat(button.dataset.price);
      showModal(nombreProducto, precioProducto);
    });
  });
}

function añadirAlCarrito(nombreProducto, peso) {
  if (carrito[nombreProducto]) {
    carrito[nombreProducto] += peso;
  } else {
    carrito[nombreProducto] = peso;
  }

  // Guardar la información del carrito en localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));

  // Actualizar el contador de productos
  let contador = document.getElementById("cart-count");
  contador.textContent = Object.keys(carrito).length;
}

// Cuando se haga clic en el botón "Añadir al carrito", se añade el producto al carrito
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

document.addEventListener("DOMContentLoaded", function() {
    let addToCartFromModal = document.getElementById("addToCartFromModal");
    let cartIconButton = document.getElementById("cart-icon-button");
    let cartCount = document.getElementById("cart-count");
    let orderSummaryModal = document.getElementById("order-summary-modal");
    let orderSummaryContent = document.getElementById("order-summary-content");
  
    let carrito = {}; // Objeto para almacenar los productos del carrito
  
    let updateCartCount = function() {
      let count = Object.keys(carrito).length;
      cartCount.textContent = count;
    };
  
    let addToCart = function(nombreProducto, cantidad) {
      if (carrito[nombreProducto]) {
        carrito[nombreProducto] += cantidad;
      } else {
        carrito[nombreProducto] = cantidad;
      }
      updateCartCount();
    };
  
    function showOrderSummary() {
        let modal = document.getElementById("order-summary-modal");
        let modalContent = document.getElementById("order-summary-content");
    
        // Limpiar el contenido anterior
        modalContent.innerHTML = "";
    
        // Crear elementos para mostrar el resumen del pedido
        let total = 0;
        for (let producto in carrito) {
            let productoInfo = productos.find(p => p.nombre === producto);
            let subtotal = carrito[producto] * productoInfo.precio;
    
            let divProducto = document.createElement("div");
            divProducto.className = "order-item";
            divProducto.innerHTML = `
                <span class="product-name">${producto}</span>
                <span class="order-quantity">${carrito[producto]} kg</span>
                <span class="subtotal">${subtotal.toFixed(2)} €</span>
            `;
            modalContent.appendChild(divProducto);
    
            total += subtotal;
        }
    
        // Mostrar el total del pedido
        let totalElement = document.createElement("div");
        totalElement.className = "total";
        totalElement.textContent = `Total: ${total.toFixed(2)} €`;
        modalContent.appendChild(totalElement);
    
        // Mostrar el modal del resumen del pedido
        modal.style.display = "block";
    }
  
    addToCartFromModal.addEventListener("click", function() {
      let nombreProducto = document.querySelector(".product-name").textContent;
      let cantidad = parseFloat(document.querySelector(".quantity").value);
      if (isNaN(cantidad) || cantidad <= 0) {
        alert("Por favor, introduce una cantidad válida.");
        return;
      }
      addToCart(nombreProducto, cantidad);
      document.querySelector("#modal").style.display = "none";
    });
  
    cartIconButton.addEventListener("click", showOrderSummary);
  
    // Cierra el modal del resumen del pedido al hacer clic en el botón de cierre
    let closeButton = document.querySelector(".close");
    closeButton.addEventListener("click", function() {
      orderSummaryModal.style.display = "none";
    });
  
    // Cierra el modal del resumen del pedido al hacer clic fuera de él
    window.addEventListener("click", function(event) {
      if (event.target == orderSummaryModal) {
        orderSummaryModal.style.display = "none";
      }
    });
  });
  
// document.addEventListener("DOMContentLoaded", function() {
//     let addToCartFromModal = document.getElementById("addToCartFromModal");
//     let cartIconButton = document.getElementById("cart-icon-button");
//     let cartCount = document.getElementById("cart-count");
//     let orderSummaryModal = document.getElementById("order-summary-modal");
//     let orderSummaryContent = document.getElementById("order-summary-content");
  
//     let carrito = {}; // Objeto para almacenar los productos del carrito
  
//     let updateCartCount = function() {
//       let count = Object.keys(carrito).length;
//       cartCount.textContent = count;
//     };
  
//     let addToCart = function(nombreProducto, cantidad) {
//       if (carrito[nombreProducto]) {
//         carrito[nombreProducto] += cantidad;
//       } else {
//         carrito[nombreProducto] = cantidad;
//       }
//       updateCartCount();
//     };
  
//     let showOrderSummary = function() {
//       let modal = document.getElementById("order-summary-modal");
//       let modalContent = document.getElementById("order-summary-content");
  
//       // Limpiar el contenido anterior
//       modalContent.innerHTML = "";
  
//       // Crear elementos para mostrar el resumen del pedido
//       for (let producto in carrito) {
//         let divProducto = document.createElement("div");
//         divProducto.className = "order-item";
//         divProducto.innerHTML = `
//           <span class="product-name">${producto}</span>
//           <span class="quantity">${carrito[producto]} kg</span>
//           <span class="subtotal">${carrito[producto] * precioProducto} €</span>
//           <button class="remove-item" data-product="${producto}">Eliminar</button>
          
//         `;
//         modalContent.appendChild(divProducto);
//       }
  
//       // Mostrar el total del pedido
//       let total = Object.keys(carrito).reduce((acc, producto) => {
//         return acc + carrito[producto] * precioProducto;
//       }, 0);
//       let totalElement = document.createElement("div");
//       totalElement.className = "total";
//       totalElement.textContent = `Total: ${total} €`;
//       modalContent.appendChild(totalElement);
  
//       // Mostrar el modal del resumen del pedido
//       modal.style.display = "block";
//     };
  
//     addToCartFromModal.addEventListener("click", function() {
//       let nombreProducto = document.querySelector(".product-name").textContent;
//       let cantidad = parseFloat(document.querySelector(".quantity").value);
//       if (isNaN(cantidad) || cantidad <= 0) {
//         alert("Por favor, introduce una cantidad válida.");
//         return;
//       }
//       addToCart(nombreProducto, cantidad);
//       document.querySelector("#modal").style.display = "none";
//       showOrderSummary();
//     });
  
//     cartIconButton.addEventListener("click", showOrderSummary);
  
//     // Cierra el modal del resumen del pedido al hacer clic en el botón de cierre
//     let closeButton = document.querySelector("#order-summary-modal .close");
//     closeButton.addEventListener("click", function() {
//       orderSummaryModal.style.display = "none";
//     });
  
//     // Cierra el modal del resumen del pedido al hacer clic fuera de él
//     window.addEventListener("click", function(event) {
//       if (event.target == orderSummaryModal) {
//         orderSummaryModal.style.display = "none";
//       }
//     });
//   });
  
  

function showModal(nombreProducto, precioProducto) {
  let modal = document.querySelector("#modal");
  modal.style.display = "block";
  modal.querySelector(".product-name").textContent = nombreProducto;
  modal.querySelector(".quantity").value = "";
  modal.querySelector(".subtotal").textContent = "Subtotal: 0 €";

  modal.querySelector(".quantity").addEventListener("input", function () {
    let peso = parseFloat(modal.querySelector(".quantity").value);
    let subtotal = isNaN(peso) ? 0 : peso * precioProducto;
    modal.querySelector(".subtotal").textContent =
      "Subtotal: " + subtotal.toFixed(2) + " €";
  });

  // Cierra el modal cuando se haga clic fuera de él
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // Cierra el modal cuando se presione el botón de cierre
  modal.querySelector(".close").onclick = function () {
    modal.style.display = "none";
  };
}
