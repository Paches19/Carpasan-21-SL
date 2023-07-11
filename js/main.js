/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/07/11 14:32:18 by adpachec          #+#    #+#             */
/*   Updated: 2023/07/11 14:33:39 by adpachec         ###   ########.fr       */
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
