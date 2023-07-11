/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   products.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/07/11 19:12:25 by adpachec          #+#    #+#             */
/*   Updated: 2023/07/11 20:01:08 by adpachec         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

document.addEventListener('DOMContentLoaded', function() {
	const categories = document.querySelectorAll('.category');
  
	// Agregar evento de clic a cada categoría
	categories.forEach(category => {
	  category.addEventListener('click', function() {
		// Mostrar o ocultar las subcategorías al hacer clic en la categoría
		const subcategories = this.nextElementSibling;
		subcategories.style.display = subcategories.style.display === 'none' ? 'block' : 'none';
	  });
	});
  });

  const products = [
	{
	  name: 'Lomo de vaca',
	  price: 19.99,
	  image: '/Carpasan-21-SL/images/Carpasan.PNG',
	  tags: ['vaca'],
	  description: ''
	},
	{
	  name: 'Chuleton de buey',
	  price: 12.99,
	  image: '/Carpasan-21-SL/images/Carpasan.PNG',
	  tags: ['vaca'],
	  description: 'Chuleton de buey gallego madurado 60 días'
	},
	{
		name: 'Lomo de cerdo',
		price: 12.99,
		image: '/Carpasan-21-SL/images/Carpasan.PNG',
		tags: ['cerdo'],
		description: ''
	},
	{
		name: 'Chuletas de cerdo',
		price: 12.99,
		image: '/Carpasan-21-SL/images/Carpasan.PNG',
		tags: ['cerdo'],
		description: ''
	},
	{
		name: 'Pechuga de pollo',
		price: 12.99,
		image: '/Carpasan-21-SL/images/Carpasan.PNG',
		tags: ['pollo'],
		description: ''
	},
	{
		name: 'Alitas de pollo',
		price: 12.99,
		image: '/Carpasan-21-SL/images/Carpasan.PNG',
		tags: ['pollo'],
		description: ''
	},
	{
		name: 'Chorizo dulce',
		price: 12.99,
		image: '/Carpasan-21-SL/images/Carpasan.PNG',
		tags: ['embutido'],
		description: ''
	},
	{
		name: 'Chorizo picante',
		price: 12.99,
		image: '/Carpasan-21-SL/images/Carpasan.PNG',
		tags: ['embutido'],
		description: ''
	},
	// Agrega más productos aquí
  ];
  document.addEventListener('DOMContentLoaded', function() {
	const categories = document.querySelectorAll('.category');
	
	// Agregar evento de clic a cada categoría
	categories.forEach(category => {
	  category.addEventListener('click', function() {
		const filter = this.dataset.filter;
		filterProductsByTag(filter);
	  });
	});
  });
  
  function renderProducts(products) {
	productContainer.innerHTML = '';
  
	products.forEach(product => {
	  const productItem = document.createElement('div');
	  productItem.classList.add('product-item');
	  productItem.innerHTML = `
		<img src="${product.image}" alt="${product.name}">
		<h3>${product.name}</h3>
		<h2>${product.description}</h2>
		<span class="price">${product.price.toFixed(2)} €/kg</span>
	  `;
	  productContainer.appendChild(productItem);
	});
  }
  
  function filterProductsByTag(tag) {
	if (tag === 'all') {
	  renderProducts(products);
	} else {
	  const filteredProducts = products.filter(product => product.tags.includes(tag));
	  renderProducts(filteredProducts);
	}
  }
  
  const productContainer = document.getElementById('product-container');
  
  // Mostrar todos los productos al cargar la página
  renderProducts(products);

  function switchGrid(columns) {
	const productItems = document.querySelectorAll('.product-item');
	productItems.forEach(item => {
	  item.style.width = `${100 / columns}%`;
	});
  }
  
  function toggleActiveButton(button) {
	const gridButtons = document.querySelectorAll('.grid-button');
	gridButtons.forEach(btn => btn.classList.remove('active'));
	button.classList.add('active');
  }
  