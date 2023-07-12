/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/07/11 14:32:18 by adpachec          #+#    #+#             */
/*   Updated: 2023/07/12 21:07:35 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// Script para el contador del carrito de compra
const cartCount = document.querySelector('.cart-count');

// Simulación de agregar elementos al carrito
let cartItemsCount = 0;

function addToCart() {
  cartItemsCount++;
  cartCount.textContent = cartItemsCount;
}

// Script para el buscador de productos en tiempo real
const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', searchProducts);

function searchProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const productos = document.querySelectorAll('.producto');

  productos.forEach((producto) => {
    const productName = producto.querySelector('h3').textContent.toLowerCase();
    if (productName.includes(searchTerm)) {
      producto.style.display = 'block';
    } else {
      producto.style.display = 'none';
    }
  });
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