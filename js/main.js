/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/07/11 14:32:18 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/20 11:02:34 by adpachec         ###   ########.fr       */
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

let productos;
//  = [
//   new Producto(
//     "Lomo de vaca",
//     19.99,
//     "/Carpasan-21-SL/images/vaca.jpg",
//     ["vacuno"],
//     ""
//   ),
//   new Producto(
//     "Chuleton de buey",
//     12.99,
//     "/Carpasan-21-SL/images/chuleton.png",
//     ["vacuno"],
//     "Chuleton de buey gallego madurado 60 días"
//   ),
//   new Producto(
//     "Lomo de cerdo",
//     11.99,
//     "/Carpasan-21-SL/images/cerdo.jpg",
//     ["cerdo"],
//     ""
//   ),
//   new Producto(
//     "Chuletas de cerdo",
//     10.99,
//     "/Carpasan-21-SL/images/chuletacerdo.jpg",
//     ["cerdo"],
//     ""
//   ),
//   new Producto(
//     "Pechuga de pollo",
//     9.99,
//     "/Carpasan-21-SL/images/pechugaPollo.jpg",
//     ["pollo"],
//     ""
//   ),
//   new Producto(
//     "Alitas de pollo",
//     1.99,
//     "/Carpasan-21-SL/images/alitas.png",
//     ["pollo"],
//     ""
//   ),
//   new Producto(
//     "Chorizo dulce",
//     120.99,
//     "/Carpasan-21-SL/images/chorizoDulce.png",
//     ["embutido"],
//     ""
//   ),
//   new Producto(
//     "Chorizo picante",
//     102.99,
//     "/Carpasan-21-SL/images/chorizo.png",
//     ["embutido"],
//     ""
//   ),
// ];

window.onload = async function () {
  let response = await fetch("http://localhost:3019/get-products");
  let data = await response.json();

  productos = data.map((producto) => {
    return new Producto(
      producto.nombre,
      producto.precio,
      producto.imagen,
      producto.tags,
      producto.descripcion
    );
  });
};

// Script para el contador del carrito de compra
const cartCount = document.querySelector('.cart-count');

// Simulación de agregar elementos al carrito
let cartItemsCount = 0;

function addToCart() {
  cartItemsCount++;
  cartCount.textContent = cartItemsCount;
}

const searchInput = document.getElementById('search-input');
const searchResultsList = document.getElementById('search-results-list');
const searchCart = document.querySelector('.search-cart');

searchInput.addEventListener('input', updateSearchResults);
document.addEventListener('click', closeSearchResults);

function updateSearchResults() {
  const searchTerm = escapeInput(searchInput.value).toLowerCase();
  const matchingProducts = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchTerm)
  );

  showSearchResults(matchingProducts);
}

function showSearchResults(results) {
  let resultsHTML = '';

  results.forEach((producto) => {
    resultsHTML += `
    <a href="/Carpasan-21-SL/html/products.html?search=${encodeURIComponent(producto.nombre)}">
    <li>
      <img class="product-image" src="${producto.imagen}" alt="${producto.nombre}" />
      <div class="product-info">
        <span>${producto.nombre}</span>
        <span class="product-price">${producto.precio} €/kg</span>
      </div>
    </li>
  </a>
    `;
  });

  searchResultsList.innerHTML = resultsHTML;
  searchResultsList.style.display = results.length ? 'block' : 'none'; // Mostrar resultados si hay coincidencias, ocultar si no las hay
  searchResultsList.style.border = results.length ? "4px solid #ccc" : "none"; 
   
  const searchResultItems = document.querySelectorAll('li');
  searchResultItems.forEach((item) => {
    item.addEventListener('click', redirectToProductPage);
  });
}

function closeSearchResults(event) {
  if (!searchCart.contains(event.target) && event.target !== searchInput) {
    searchResultsList.style.display = 'none'; // Ocultar resultados al hacer clic fuera del área de búsqueda
  }
}

function escapeInput(input) {
  // Función para escapar caracteres peligrosos en la entrada del usuario.
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

const carousel = document.querySelector('.carousel');
const carouselItems = carousel.querySelectorAll('.carousel-item');
const prevButton = document.querySelector('.carousel-control.prev');
const nextButton = document.querySelector('.carousel-control.next');
let currentIndex = 0;

function showItem(index) {
  carouselItems[currentIndex].classList.remove('active');
  currentIndex = (index + carouselItems.length) % carouselItems.length;
  carouselItems[currentIndex].classList.add('active');
}

prevButton.addEventListener('click', () => {
  showItem(currentIndex - 1);
});

nextButton.addEventListener('click', () => {
  showItem(currentIndex + 1);
});

// Rotación automática de las imágenes
let intervalId;

function startAutoRotation() {
  intervalId = setInterval(() => {
    showItem(currentIndex + 1);
  }, 5000);
}

function stopAutoRotation() {
  clearInterval(intervalId);
}

startAutoRotation();

carousel.addEventListener('mouseover', stopAutoRotation);
carousel.addEventListener('mouseout', startAutoRotation);

function moverCarrusel(direccion) {
  const carouselItems = document.querySelectorAll('.carousel-item');
  const activeItem = document.querySelector('.carousel-item.active');
  const activeIndex = Array.from(carouselItems).indexOf(activeItem);
  const totalItems = carouselItems.length;

  let newIndex = activeIndex + direccion;
  if (newIndex < 0) {
    newIndex = totalItems - 1;
  } else if (newIndex >= totalItems) {
    newIndex = 0;
  }

  activeItem.classList.remove('active');
  carouselItems[newIndex].classList.add('active');
}

// section-slider.addEventListener('mouseover', stopAutoRotation);
// section-slider.addEventListener('mouseout', startAutoRotation);

// function moverSlider(direccion) {
//   const sliderItems = document.querySelectorAll('.slider-item');
//   const activeItem = document.querySelector('.slider-item.active');
//   const activeIndex = Array.from(sliderItems).indexOf(activeItem);
//   const totalItems = sliderItems.length;

//   let newIndex = activeIndex + direccion;
//   if (newIndex < 0) {
//     newIndex = totalItems - 1;
//   } else if (newIndex >= totalItems) {
//     newIndex = 0;
//   }

//   activeItem.classList.remove('active');
//   sliderItems[newIndex].classList.add('active');
// }

function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active');
}