import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function EditProductPage() {
  const location = useLocation();
  const product = location.state;
  const [productName, setProductName] = useState(product.NombreProducto);
  const [productDescription, setProductDescription] = useState(product.Descripcion);
  const [productPrice, setProductPrice] = useState(product.Precio);
  const [productTags, setProductTags] = useState(product.Tags);
  const navigate = useNavigate();
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleUpdateProduct = () => {
    const updatedProduct = {
      ...product,
      nombre: productName,
      descripcion: productDescription,
      precio: productPrice,
      tags: productTags,
    };
    fetch(`http://localhost:3001/Productos/${product.ID_Producto}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Producto actualizado exitosamente");
        // Puedes redirigir a la página de detalles del producto o realizar otras acciones
      })
      .catch((error) => {
        console.error("Error al actualizar el producto:", error);
      });
	  setShowSnackbar(true); // mostrar el snackbar
	  setTimeout(() => setShowSnackbar(false), 3000);
  };

  return (
    <div className="edit-product-page">
      <button
        className="back-button"
        onClick={() => navigate("/ManageProducts")}  // navegación a ManageProducts
      >
        ← Volver
      </button>
      
      <h2>Editar Producto</h2>
      <div>
        <label>Nombre:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>
      <div>
        <label>Descripción:</label>
        <textarea
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
        />
      </div>
      <div>
        <label>Precio:</label>
        <input
          type="number"
          step="0.01"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
        />
      </div>
      <div>
        <label>Tags:</label>
        <input
          type="text"
          value={productTags}
          onChange={(e) => setProductTags(e.target.value)}
        />
      </div>
      <button onClick={handleUpdateProduct}>Guardar Cambios</button>
	  {showSnackbar && (
        <div className="snackbar">
          Producto actualizado con éxito.
        </div>
      )}
    </div>
  );
}

export default EditProductPage;
