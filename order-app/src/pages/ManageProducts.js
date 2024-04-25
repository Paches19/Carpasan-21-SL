import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const fetchProducts = async (setProducts, setLoading, setError) => {
  setLoading(true);
  try {
    const response = await fetch("http://localhost:3001/Productos");
    if (!response.ok) {
      throw new Error("Error al obtener los productos");
    }
    const data = await response.json();
    setProducts(data);
    setLoading(false);
  } catch (err) {
    setError(err.message);
    setLoading(false);
  }
};

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchProducts(setProducts, setLoading, setError);
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
  function removeProduct(id) {
    setProducts(prevProducts => prevProducts.filter(product => product.ID_Producto !== id));
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
        <button
          onClick={() => {
            navigate("/add-product");  // navegar a la página de añadir producto
          }}
        >
          Añadir Producto
        </button>
      </div>
      {filteredProducts.map((product) => (
        <ProductCard key={product.ID_Producto} product={product} removeProduct={removeProduct}/>
      ))}
    </div>
  );
}

function ProductCard({ product, removeProduct }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const handleEditClick = () => {
    navigate(`/edit-product/${product.ID_Producto}`, { state: product });
  };
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Nuevo estado para el diálogo de confirmación


  const handleDeleteClick = () => {
    setShowConfirmDialog(true);
  };

  const confirmDelete = () => {
    fetch(`http://localhost:3001/Productos/${product.ID_Producto}`, {
        method: 'DELETE'
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al eliminar el producto');
        }
        return response.json();
      })
      .then((data) => {
        console.log("Producto eliminado exitosamente");
        // Aquí puedes actualizar la lista de productos si es necesario.
      })
      .catch((err) => {
        console.error(err.message);
      });
      setShowSnackbar(true); // mostrar el snackbar
      setTimeout(() => setShowSnackbar(false), 3000);
      removeProduct(product.ID_Producto); // Aquí está el cambio
      setShowConfirmDialog(false);
  };

  return (
    <div className={`product-card ${expanded ? "expanded" : ""}`}>
      <div className="product-header" onClick={() => setExpanded(!expanded)}>
        <h2 className="product-name">{product.NombreProducto}</h2>
        <div className="header-right">
        <button className="product-mod" onClick={handleEditClick}>
            Modificar Producto
          </button>
          <button className="button3" onClick={handleDeleteClick}>Eliminar Producto</button>
          {showConfirmDialog && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h2>¿Estás seguro de que quieres eliminar el producto {product.NombreProducto}?</h2>
            <button className="button3" onClick={confirmDelete}>Sí, eliminar</button>
            <button className="button3" onClick={() => setShowConfirmDialog(false)}>Cancelar</button>
          </div>
        </div>
      )}
          {showSnackbar && (
          <div className="snackbar">Producto eliminado con éxito.</div>
        )}
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
