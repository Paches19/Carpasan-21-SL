import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productTags, setProductTags] = useState("");
  const [productImage, setProductImage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const navigate = useNavigate();
  const tagsList = [
    "Vacuno",
    "Pollo",
    "Cerdo",
    "Embutido",
    "Cordero",
    "Oveja",
    "Adobados",
    "Obrador",
    "Especiales",
    "Packs",
  ];

  const toggleTag = (tag) => {
    setProductTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleAddProduct = () => {
    if (productName === "" || productPrice === "") {
      alert("El nombre del producto y el precio son obligatorios.");
      return;
    }

    fetch("http://carpasan21.com/react/add-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: productName,
        precio: productPrice,
        descripcion: productDescription,
        tags: productTags,
        imagen: productImage,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Producto añadido exitosamente");
      })
      .catch((error) => {
        console.error("Error al añadir el producto:", error);
      });
    setShowSnackbar(true); // mostrar el snackbar
    setTimeout(() => {
      setShowSnackbar(false);
      navigate("/ManageProducts");
    }, 1000);
  };

  return (
	<div className="edit-product-page">
	<button
		className="back-button"
		onClick={() => navigate("/ManageProducts")} // navegación a ManageProducts
	>
		← Volver
	</button>
	<div>
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
		<div className="tags-container">
			{tagsList.map((tag, index) => (
			<div className="tag-item" key={index}>
				<input
				type="checkbox"
				checked={productTags.includes(tag)}
				onChange={() => toggleTag(tag)}
				/>
				<label>{tag}</label>
			</div>
			))}
		</div>
		</div>
		<div>
		<label>Imagen:</label>
		<input
			type="text"
			value={productImage}
			onChange={(e) => setProductImage(e.target.value)}
		/>
		</div>
		<button onClick={handleAddProduct}>Añadir Producto</button>
		{showSnackbar && (
		<div className="snackbar">Producto añadido con éxito.</div>
		)}
	</div>
	</div>
  );
}

export default AddProduct;
