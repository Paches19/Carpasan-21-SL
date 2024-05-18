/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   products.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/07/11 19:12:25 by adpachec          #+#    #+#             */
/*   Updated: 2024/05/18 13:59:47 by adpachec         ###   ########.fr       */
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
let filtros = [
  "Todo",
  "Vacuno",
  "Pollo",
  "Cerdo",
  "Obrador",
  "Embutido",
  "Cordero",
  "Oveja",
  "Adobados",
  "Especiales",
  "Packs",
];

let productos;
let productosMostrados;
let columnasSeleccionadas = 3;

let CartCountOnLoad = function () {
  let cartCount = document.getElementById("cart-count");
  let carrito = JSON.parse(localStorage.getItem("carrito")) || {};
  let count = Object.keys(carrito).length;
  cartCount.textContent = count;
};

window.onload = async function () {
  let response = await fetch("https://carpasan21.com/api/get-products");
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
  productos.forEach((producto) => {
    producto.tags = producto.tags.filter((tag) => tag && tag.trim() !== "");
  });
  productosMostrados = [...productos];
  generarFiltros();
  let searchParam = new URLSearchParams(window.location.search).get("search");

  if (searchParam) {
    let searchTerm = decodeURIComponent(searchParam).toLowerCase();
    let matchingProducts = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(searchTerm)
    );
    mostrarProductos(matchingProducts);
  } else {
    mostrarProductos(productos);
  }
  CartCountOnLoad();
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
    productosMostrados = productos.filter((producto) =>
      producto.tags.some(
        (t) => t.trim().toLowerCase() === tag.trim().toLowerCase()
      )
    );
  }
  mostrarProductos(productosMostrados);
  if (window.innerWidth < 1025) {
      var filtroTags = document.querySelector('#filtroTags');
    if (filtroTags.style.display === 'block') {
      filtroTags.style.display = 'none';
    } else {
      filtroTags.style.display = 'block';
    }
  }
}

function seleccionarColumnas(columnas) {
  columnasSeleccionadas = columnas;
  mostrarProductos(productosMostrados);
}

function mostrarProductos(productosMostrar) {
  let div = document.querySelector("#gridProductos");
  div.innerHTML = "";
  if (window.innerWidth < 768)
    div.style.gridTemplateColumns = `repeat(2, 1fr)`;
  else
    div.style.gridTemplateColumns = `repeat(${columnasSeleccionadas}, 1fr)`;
  

  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  if (searchTerm != "") {
    productosMostrar = productosMostrar.filter((producto) =>
      producto.nombre.toLowerCase().includes(searchTerm)
    );
  }

  if (!Array.isArray(productosMostrar)) {
    console.error("productosMostrar debe ser un array");
    return; // Salir de la función si productosMostrar no es un array
  }
  
  if (columnasSeleccionadas > 3) {
    for (let producto of productosMostrar) {
      let divProducto = document.createElement("div");
      divProducto.className = "producto";
      divProducto.innerHTML = `
              <img src="${producto.imagen}" alt="${producto.nombre}">
              <h2>${producto.nombre}</h2>
              <p class="descripcion">${producto.descripcion}</p>
              <div class="price-cart3">
                <p2 class="precio">Precio: ${producto.precio} €/kg</p2>
                <button class="add-to-cart" data-product="${producto.nombre}" data-price="${producto.precio}">
                  <img src="/images/CarritoCompra-min.png" alt="Añadir al carrito">
                </button>
              </div>
          `;
      div.appendChild(divProducto);
    }
  } else {
    for (let producto of productosMostrar) {
      let divProducto = document.createElement("div");
      divProducto.className = "producto";
      divProducto.innerHTML = `
              <img src="${producto.imagen}" alt="${producto.nombre}">
              <h2>${producto.nombre}</h2>
              <p class="descripcion">${producto.descripcion}</p>
              <div class="price-cart3">
                <p class="precio">Precio: ${producto.precio} €/kg</p>
                <button class="add-to-cart" data-product="${producto.nombre}" data-price="${producto.precio}">
                  <img src="/images/CarritoCompra-min.png" alt="Añadir al carrito">
                </button>
              </div>
          `;
      div.appendChild(divProducto);
    }
  }

  document.querySelectorAll(".add-to-cart").forEach(function (button) {
    button.addEventListener("click", function () {
      let nombreProducto = button.dataset.product;
      let precioProducto = parseFloat(button.dataset.price);
      showModal(nombreProducto, precioProducto);
    });
  });
}

document.querySelector('#sidebar hs').addEventListener('click', function() {
  if (window.innerWidth < 1025) {
    var filtroTags = document.querySelector('#filtroTags');
    if (filtroTags.style.display === 'block') {
      filtroTags.style.display = 'none';
    } else {
      filtroTags.style.display = 'block';
    }
  }
});

// Cuando se haga clic en el botón "Añadir al carrito", se añade el producto al carrito
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

document.addEventListener("DOMContentLoaded", function () {
  let addToCartFromModal = document.getElementById("addToCartFromModal");
  let cartIconButton = document.getElementById("cart-icon-button");
  let cartCount = document.getElementById("cart-count");
  let orderSummaryModal = document.getElementById("order-summary-modal");
  let orderSummaryContent = document.getElementById("order-summary-content");
  let ordenarSelect = document.getElementById("ordenar");
  let carrito = JSON.parse(localStorage.getItem("carrito")) || {};

  ordenarSelect.addEventListener("change", function () {
    ordenarProductos(ordenarSelect.value);
  });

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    // Verificar que searchInput no sea null
    searchInput.addEventListener("input", () => {
      mostrarProductos(productosMostrados);
    });
  }

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

  let updateCartCount = function () {
    let count = Object.keys(carrito).length;
    cartCount.textContent = count;
  };

  let total = 0;
  
  function showOrderSummary() {
    // Limpiar el contenido anterior
    orderSummaryContent.innerHTML = "";

    // Crear elementos para mostrar el resumen del pedido
    total = 0;
    for (let producto in carrito) {
      let productoInfo = productos.find((p) => p.nombre === producto);
      let subtotal = carrito[producto] * productoInfo.precio;

      let divProducto = document.createElement("div");
      divProducto.className = "order-item";
      divProducto.innerHTML = `
              <span class="product-name">${producto}</span>
              <input type="number" step="0.1" class="order-quantity" min="0.1" value="${
                carrito[producto]
              }">
              <span class="subtotal">${subtotal.toFixed(2)} €</span>
              <button class="remove-item" data-product="${producto}">Eliminar</button>
          `;
      orderSummaryContent.appendChild(divProducto);

      total += subtotal;
    }

    let clearCartButton = document.getElementById("clear-cart");
    clearCartButton.addEventListener("click", function () {
      carrito = {}; // Vaciamos el objeto carrito
      localStorage.setItem("carrito", JSON.stringify(carrito));
      updateCartCount();
      showOrderSummary();
    });

    function updateCartItem(productName, quantity) {
      carrito[productName] = quantity;
      localStorage.setItem("carrito", JSON.stringify(carrito));
      showOrderSummary();
      updateCartCount();
    }

    let totalContainer = document.querySelector(".left-section");

    // Mostrar el total del pedido
    let totalElement = document.createElement("span");
    totalElement.className = "total";
    totalElement.textContent = `Total: ${total.toFixed(2)} €`;

    // Asegurémonos de que el contenedor esté vacío
    totalContainer.innerHTML = "";

    // Agrega el totalElement al contenedor correcto
    totalContainer.appendChild(totalElement);

    // Mostrar el modal del resumen del pedido
    orderSummaryModal.style.display = "block";

    // Añadir escuchadores de eventos a los botones "Eliminar"
    let removeItemButtons = document.querySelectorAll(".remove-item");
    removeItemButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        let product = e.target.getAttribute("data-product");
        delete carrito[product];
        localStorage.setItem("carrito", JSON.stringify(carrito));
        showOrderSummary(); // Actualizar el resumen del pedido
        updateCartCount();
      });
    });

    // Añadir escuchador de eventos a los inputs de cantidad
    let quantityInputs = document.querySelectorAll(
      ".order-item .order-quantity"
    );
    quantityInputs.forEach((input) => {
      input.addEventListener("change", function (e) {
        let product =
          e.target.parentNode.querySelector(".product-name").textContent;
        let newQuantity = parseFloat(e.target.value);
        updateCartItem(product, newQuantity);
      });
    });

    // Añadir escuchador de eventos al botón "Eliminar Todo"
    clearCartButton.addEventListener("click", function () {
      carrito = {};
      localStorage.setItem("carrito", JSON.stringify(carrito));
      showOrderSummary(); // Actualizar el resumen del pedido
      updateCartCount();
    });
  }

  function addToCart(productName, quantity) {
    if (carrito[productName]) {
      carrito[productName] += quantity;
    } else {
      carrito[productName] = quantity;
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    // updateCartCount();
  }

  addToCartFromModal.addEventListener("click", function () {
    let modal = document.getElementById("modal"); // Obtén el modal donde el evento de clic sucedió
    let nombreProducto = modal.querySelector(".product-name").textContent; // En lugar de seleccionar el producto de la página entera, seleccionamos el producto desde el modal
    let cantidad = parseFloat(modal.querySelector(".quantity").value); // La cantidad se selecciona de la misma manera
    if (isNaN(cantidad) || cantidad <= 0) {
      alert("Por favor, introduce una cantidad válida.");
      return;
    }
    addToCart(nombreProducto, cantidad);
    modal.style.display = "none";
    updateCartCount();
  });

  cartIconButton.addEventListener("click", showOrderSummary);

  // Cierra el modal del resumen del pedido al hacer clic en el botón de cierre
  let closeButton = document.querySelector(".close");
  closeButton.addEventListener("click", function () {
    orderSummaryModal.style.display = "none";
  });

  // Cierra el modal del resumen del pedido al hacer clic fuera de él
  window.addEventListener("click", function (event) {
    if (event.target == orderSummaryModal) {
      orderSummaryModal.style.display = "none";
    }
  });

  let checkoutButton = document.getElementById("checkout");
  let checkoutModal = document.getElementById("checkout-modal");
  let checkoutCloseButton = document.querySelector("#checkout-modal .close");

  checkoutButton.addEventListener("click", function () {
    // Redirecciona a la página de productos
    orderSummaryModal.style.display = "none";
    if (window.innerWidth < 768)
      checkoutModal.style.display = "flex";
    else
      checkoutModal.style.display = "block";
  });

  checkoutCloseButton.addEventListener("click", function () {
    checkoutModal.style.display = "none";
  });

  document.getElementById('delivery-option').addEventListener('change', function() {
    var seleccion = this.value;
    var contenedorLocalidades = document.getElementById('localidades-container');
    
    if (seleccion === 'domicilio') {
        contenedorLocalidades.style.display = 'block';
    } else {
        contenedorLocalidades.style.display = 'none';
    }
});

  let confirmOrderButton = document.getElementById("confirm-order");
  confirmOrderButton.addEventListener("click", function () {
    event.preventDefault(); // Evitar que el formulario se envíe automáticamente
    orderSummaryModal.style.display = "none";
    confirmOrder();
  });

  let errorContainer = document.getElementById("error-container");

  function showGeneralError(message) {
    errorContainer.textContent = message;
    errorContainer.style.color = "red";
  }

  function hideGeneralError() {
    errorContainer.textContent = "";
  }

  function showErrorField(element, message) {
    // Crear el div de error específico del campo
    let errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;

    // Insertar el div de error después del elemento de campo
    element.parentNode.insertBefore(errorDiv, element.nextSibling);

    // Establecer estilos de error específicos del campo
    element.style.borderColor = "red";
  }

  function hideErrorField(element) {
    // Eliminar el div de error específico del campo, si existe
    let errorDiv = element.nextElementSibling;
    if (errorDiv && errorDiv.className === "error-message") {
      errorDiv.parentNode.removeChild(errorDiv);
    }

    // Restablecer estilos del campo
    element.style.borderColor = "#ccc";
  }

  function showConfirmationMessage() {
    // Crear el elemento del mensaje de confirmación
    let confirmationMessage = document.createElement("div");
    confirmationMessage.style.display = "block";
    confirmationMessage.id = "confirmation-message";
    confirmationMessage.className = "confirmation-message";
    confirmationMessage.innerHTML = `
    <h2>¡Pedido confirmado!</h2>
    <p>Gracias por tu compra. Pronto recibirás un correo electrónico con los detalles de tu pedido.</p>
    <p> Nota: Debido a la naturaleza de nuestro negocio, las cantidades y precios finales pueden variar ligeramente y serán confirmados en el momento del pago.</p>
    <span id="close-confirmation-message">X</span>
  `;

    // Primero, añadir el mensaje de confirmación al DOM
    document.body.appendChild(confirmationMessage);

    // Luego, una vez que el botón está en el DOM, añadirle el evento "click"
    document
      .getElementById("close-confirmation-message")
      .addEventListener("click", function () {
        confirmationMessage.style.display = "none";
      });

    setTimeout(function () {
      confirmationMessage.style.display = "none";
    }, 15000);
  }

  function confirmOrder() {
    let firstName = document.getElementById("first-name");
    let lastName = document.getElementById("last-name");
    let address = document.getElementById("address");
    let phone = document.getElementById("phone");
    let email = document.getElementById("email");
    let deliveryOption = document.getElementById("delivery-option");
    let localidad = document.getElementById("localidad-option");
    let extraInfo = document.getElementById("extra-info");
    let privacyCheckbox = document.getElementById("privacy-policy");
    let tramModal = document.getElementById("checkout-modal");
    let carritoEnd = JSON.parse(localStorage.getItem("carrito")) || {};

    // Verificar si algún campo está vacío
    let isEmptyField = false;
    hideErrorField(firstName);
    hideErrorField(lastName);
    hideErrorField(address);
    hideErrorField(phone);
    hideErrorField(email);
    hideErrorField(localidad);
    hideErrorField(privacyCheckbox);
    hideErrorField(firstName);

    if (firstName.value === "") {
      showErrorField(firstName, "Por favor, introduce tu nombre.");
      isEmptyField = true;
      return ;
    }

    if (lastName.value === "") {
      showErrorField(lastName, "Por favor, introduce tus apellidos.");
      isEmptyField = true;
      return ;
    }

    if (address.value === "") {
      showErrorField(address, "Por favor, introduce tu dirección.");
      isEmptyField = true;
      return ;
    }

    let phoneRegex = /^\d{9}$|^\d{3} \d{3} \d{3}$/;

    if (phone.value === "") {
      showErrorField(phone, "Por favor, introduce tu teléfono de contacto.");
      isEmptyField = true;
      return ;
    } else if (!phone.value.match(phoneRegex)) {
      showErrorField(
        phone,
        "Por favor, introduce un número de teléfono válido. Formato: 123456789 o 123 456 789"
      );
      isEmptyField = true;
      return ;
    }

    if (email.value === "") {
      showErrorField(email, "Por favor, introduce tu email.");
      isEmptyField = true;
      return ;
    }

    if(deliveryOption.value === 'domicilio' && localidad.value === "")
    {
      showErrorField(localidad, "Por favor, introduce localidad de envío.");
      isEmptyField = true;
      return ;
    }

    if (!privacyCheckbox.checked) {
      let privacyLabel = document.querySelector('label[for="privacy-policy"]');
      privacyLabel.style.color = "red";
      showErrorField(privacyCheckbox, "Por favor, acepta los términos y condiciones de uso.");
      isEmptyField = true;
      return ;
    }

    if (isEmptyField) {
      showGeneralError(
        "Debes completar todos los campos antes de confirmar el pedido."
      );
      return;
    }

    // hideGeneralError();
    let order = {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      phone: phone.value,
      email: email.value,
      deliveryOption: deliveryOption.value,
      extraInfo: extraInfo.value,
      cart: carritoEnd,
      total: total
    };

    fetch("https://carpasan21.com/api/submit-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`https error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(
          "Pedido enviado correctamente. Respuesta del servidor:",
          data
        );
      })
      .catch((error) => {
        console.error("Error al enviar el pedido:", error);
      });

    // Mostrar un mensaje de confirmación al usuario
    showConfirmationMessage();

    carrito = {};
    localStorage.setItem("carrito", JSON.stringify(carrito));

    showOrderSummary();
    updateCartCount();
    document.getElementById("checkout-form").reset();
    tramModal.style.display = "none";
    orderSummaryModal.style.display = "none";
  }

  document
    .getElementById("show-policy")
    .addEventListener("click", function (event) {
      event.preventDefault(); // Evitar que el enlace realice la acción por defecto
      document.getElementById("privacy-modal").style.display = "block";
    });
  document
    .getElementsByClassName("close-privacy")[0]
    .addEventListener("click", function () {
      document.getElementById("privacy-modal").style.display = "none";
    });
});

function showModal(nombreProducto, precioProducto) {
  let modal = document.getElementById("modal");
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

function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active');
}

function loadPolicyContent() {
  const policyContent = document.getElementById('policy-content');
  policyContent.innerHTML = `
  <h1>Política de privacidad</h1>
  <p>En Carpasan 21 SL, nos tomamos muy en serio la privacidad de nuestros usuarios. Esta política de privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos la información personal que nos proporcionas. Al utilizar nuestro sitio web Carpasan21.com y nuestros servicios, aceptas los términos y condiciones de esta política.</p>

  <h2>Información que recopilamos</h2>
  <p>Recopilamos la siguiente información personal:</p>
  <ul>
    <li>Nombre y apellidos</li>
    <li>Dirección de correo electrónico</li>
    <li>Dirección postal</li>
    <li>Número de teléfono</li>
  </ul>

  <h2>Uso de la información</h2>
  <p>Utilizamos la información personal recopilada para los siguientes fines:</p>
  <ul>
    <li>Procesar tus pedidos y entregas</li>
    <li>Proporcionar asistencia al cliente</li>
    <li>Mejorar nuestros productos y servicios</li>
    <li>Enviar comunicaciones de marketing y promocionales</li>
  </ul>

  <h2>Compartir información con terceros</h2>
  <p>No compartimos tu información personal con terceros sin tu consentimiento, excepto en los siguientes casos:</p>
  <ul>
    <li>Proveedores de servicios: Podemos compartir tu información con terceros que nos ayudan a proporcionar servicios, como el procesamiento de pagos o el envío de pedidos.</li>
    <li>Requisitos legales: Podemos divulgar tu información personal cuando creemos de buena fe que la divulgación es necesaria para cumplir con una obligación legal, proteger tus derechos o responder a una solicitud gubernamental.</li>
  </ul>

  <h2>Seguridad de la información</h2>
  <p>Tomamos medidas razonables para proteger la información personal que recopilamos. Sin embargo, no podemos garantizar la seguridad absoluta de la información transmitida a través de Internet.</p>

  <h2>Tus derechos</h2>
  <p>Tienes derecho a acceder, corregir, actualizar y eliminar tu información personal. Si deseas ejercer alguno de estos derechos, por favor contáctanos a través de los datos de contacto proporcionados al final de esta política.</p>

  <h2>Cambios en la política de privacidad</h2>
  <p>Podemos actualizar nuestra política de privacidad de vez en cuando. Te recomendamos revisar esta página periódicamente para estar al tanto de los cambios. Al continuar utilizando nuestros servicios después de cualquier modificación de esta política, aceptas los términos actualizados.</p>


<h1>Términos y condiciones</h1>
  <p>Estos términos y condiciones rigen el uso de nuestro sitio web Carpasan21.com y los servicios que ofrecemos. Al utilizar nuestro sitio web y nuestros servicios, aceptas cumplir con estos términos y condiciones. Si no estás de acuerdo con alguno de los siguientes términos, por favor no utilices nuestro sitio web ni nuestros servicios.</p>

  <h2>Propiedad intelectual</h2>
  <p>Todos los derechos de propiedad intelectual relacionados con nuestro sitio web y nuestros servicios son propiedad exclusiva de Carpasan21 SL a menos que se indique lo contrario. No está permitida la reproducción, distribución, modificación o uso no autorizado de ningún contenido protegido por derechos de autor sin nuestro consentimiento previo por escrito.</p>

  <h2>Uso del sitio web</h2>
  <p>Estás autorizado a utilizar nuestro sitio web y nuestros servicios únicamente para fines legítimos y de acuerdo con estos términos y condiciones. No debes utilizar nuestro sitio web de ninguna manera que pueda causar daños o perjuicios a nosotros, a otros usuarios o a terceros.</p>

  <h2>Limitación de responsabilidad</h2>
  <p>No seremos responsables por ningún daño directo, indirecto, incidental, consecuente o especial que resulte del uso de nuestro sitio web o nuestros servicios. Nos esforzamos por proporcionar información precisa y actualizada, pero no garantizamos la exactitud, integridad o actualidad de la información.</p>

  <h2>Enlaces a otros sitios web</h2>
  <p>Nuestro sitio web puede contener enlaces a sitios web de terceros que no están bajo nuestro control. No asumimos ninguna responsabilidad por el contenido, políticas de privacidad o prácticas de los sitios web de terceros. Recomendamos leer las políticas de privacidad y los términos y condiciones de dichos sitios web antes de utilizarlos.</p>

  <h2>Modificaciones de los términos y condiciones</h2>
  <p>Podemos actualizar estos términos y condiciones en cualquier momento sin previo aviso. Te recomendamos revisar esta página periódicamente para estar al tanto de los cambios. Al continuar utilizando nuestro sitio web y nuestros servicios después de cualquier modificación de estos términos y condiciones, aceptas los términos actualizados.</p>

  <h2>Contacto</h2>
  <p>Si tienes alguna pregunta o inquietud acerca de nuestra política de privacidad o términos y condiciones, por favor contáctanos a través de:</p>
  <ul>
    <li>Teléfono: 613 69 39 62</li>
    <li>Correo electrónico: carpasan21sl@gmail.com</li>
    <li>Dirección postal: 28360</li>
  </ul>
  `;
}

// Asegúrate de llamar a esta función cuando sea necesario, por ejemplo, al abrir el modal.
document.getElementById('show-policy').addEventListener('click', function (event) {
  event.preventDefault();
  loadPolicyContent();
  document.getElementById('privacy-modal').style.display = 'block';
});

document.getElementsByClassName('close-privacy')[0].addEventListener('click', function () {
  document.getElementById('privacy-modal').style.display = 'none';
});