import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/Productos")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products
    .filter((product) => {
      if (searchTerm) {
        return product.NombreProducto.toLowerCase().includes(
          searchTerm.toLowerCase()
        );
      }
      return true;
    })
    .filter((product) => {
      if (selectedTags.length > 0) {
        const productTags = product.Tags.split(",");
        return selectedTags.some((tag) => productTags.includes(tag));
      }
      return true;
    });

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!products || products.length === 0) {
    return (
      <div className="products-container">No hay productos disponibles</div>
    );
  }

  return (
    <div className="products-container">
      <div className="filter-section">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="tag-filter-section">
          {/* Puedes crear checkboxes para los tags aquí */}
        </div>
        <button
          onClick={() => {
            setSearchTerm("");
            setSelectedTags([]);
          }}
        >
          Limpiar Filtros
        </button>
      </div>
      {filteredProducts.map((product) => (
        <ProductCard key={product.ID_Producto} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const handleEditClick = () => {
    navigate(`/edit-product/${product.ID_Producto}`, { state: product });
  };

  return (
    <div className={`product-card ${expanded ? "expanded" : ""}`}>
      <div className="product-header" onClick={() => setExpanded(!expanded)}>
        <h2 className="product-name">{product.NombreProducto}</h2>
        <div className="header-right">
        <button className="product-mod" onClick={handleEditClick}>
            Modificar Producto
          </button>
          <button className="button3">Eliminar Producto</button>
        </div>
      </div>
      <div className="product-details">
        <div className="product-price">💰 {product.Precio} €</div>
        <div className="product-description">📝 {product.Descripcion}</div>
        <div className="product-tags">🏷 {product.Tags}</div>
      </div>
    </div>
  );
}

export default ProductList;
