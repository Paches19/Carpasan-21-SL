/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tradition.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/07/13 12:38:41 by adpachec          #+#    #+#             */
/*   Updated: 2024/04/25 13:51:44 by adpachec         ###   ########.fr       */
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

window.onload = async function () {
  let response = await fetch("http://localhost:3000/get-products");
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

let sliderIndex = 0;
const sliderItems = document.getElementsByClassName('slider-item');
let intervalId;

function moverSlider(n) {
  sliderIndex += n;
  if (sliderIndex < 0) {
    sliderIndex = sliderItems.length - 1;
  } else if (sliderIndex >= sliderItems.length) {
    sliderIndex = 0;
  }
  mostrarSlider();
}

function mostrarSlider() {
  for (let i = 0; i < sliderItems.length; i++) {
    sliderItems[i].classList.remove('active');
  }
  sliderItems[sliderIndex].classList.add('active');
}

function iniciarRotacionAutomatica() {
  intervalId = setInterval(() => {
    moverSlider(1);
  }, 4000);
}

function detenerRotacionAutomatica() {
  clearInterval(intervalId);
}

iniciarRotacionAutomatica();

const sliderContainer = document.querySelector('.slider-container');
sliderContainer.addEventListener('mouseover', detenerRotacionAutomatica);
sliderContainer.addEventListener('mouseout', iniciarRotacionAutomatica);

document.addEventListener("DOMContentLoaded", function () {
  let cartIconButton = document.getElementById("cart-icon-button");
  let cartCount = document.getElementById("cart-count");
  let orderSummaryModal = document.getElementById("order-summary-modal");
  let orderSummaryContent = document.getElementById("order-summary-content");
  let carrito = JSON.parse(localStorage.getItem("carrito")) || {};

  let updateCartCount = function () {
    let count = Object.keys(carrito).length;
    cartCount.textContent = count;
  };

  updateCartCount();
  function showOrderSummary() {
    // Limpiar el contenido anterior
    orderSummaryContent.innerHTML = "";

    // Crear elementos para mostrar el resumen del pedido
    let total = 0;
    for (let producto in carrito) {
      let productoInfo = productos.find((p) => p.nombre === producto);
      let subtotal = carrito[producto] * productoInfo.precio;

      let divProducto = document.createElement("div");
      divProducto.className = "order-item";
      divProducto.innerHTML = `
              <span class="product-name">${producto}</span>
              <input type="number" step="0.1" class="order-quantity" min="0.0" value="${
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
    orderSummaryModal.style.display = "none";
    checkoutModal.style.display = "block";
  });

  checkoutCloseButton.addEventListener("click", function () {
    checkoutModal.style.display = "none";
  });

  let confirmOrderButton = document.getElementById("confirm-order");
  confirmOrderButton.addEventListener("click", function () {
    event.preventDefault();
    orderSummaryModal.style.display = "none";
    confirmOrder();
  });

  let errorContainer = document.getElementById("error-container");

  function showGeneralError(message) {
    errorContainer.textContent = message;
    errorContainer.style.color = "red";
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
    }, 10000);
  }

  function confirmOrder() {
    let firstName = document.getElementById("first-name");
    let lastName = document.getElementById("last-name");
    let address = document.getElementById("address");
    let phone = document.getElementById("phone");
    let email = document.getElementById("email");
    let deliveryOption = document.getElementById("delivery-option");
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
    hideErrorField(privacyCheckbox);
    hideErrorField(firstName);

    if (firstName.value === "") {
      showErrorField(firstName, "Por favor, introduce tu nombre.");
      isEmptyField = true;
    }

    if (lastName.value === "") {
      showErrorField(lastName, "Por favor, introduce tus apellidos.");
      isEmptyField = true;
    }

    if (address.value === "") {
      showErrorField(address, "Por favor, introduce tu dirección.");
      isEmptyField = true;
    }

    let phoneRegex = /^\d{9}$|^\d{3} \d{3} \d{3}$/;

    if (phone.value === "") {
      showErrorField(phone, "Por favor, introduce tu teléfono de contacto.");
      isEmptyField = true;
    } else if (!phone.value.match(phoneRegex)) {
      showErrorField(
        phone,
        "Por favor, introduce un número de teléfono válido. Formato: 123456789 o 123 456 789"
      );
      isEmptyField = true;
    }

    if (email.value === "") {
      showErrorField(email, "Por favor, introduce tu email.");
      isEmptyField = true;
    }

    if (!privacyCheckbox.checked) {
      let privacyLabel = document.querySelector('label[for="privacy-policy"]');
      privacyLabel.style.color = "red";
      isEmptyField = true;
    } else {
      let privacyLabel = document.querySelector('label[for="privacy-policy"]');
      privacyLabel.style.color = "#000";
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
    };

    fetch("http://localhost:3000/submit-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
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