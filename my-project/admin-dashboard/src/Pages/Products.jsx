// src/components/Products.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import EditProductForm from "./EditProductForm";
import AddProductForm from "./AddProductForm";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null); // Store the product being edited
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  useEffect(() => {
    api
      .get("/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleEdit = (product) => {
    console.log("Editing product:", product); // Log the product to check if it has _id
    setEditingProduct(product);
  };
  const handleAddProduct = async (newProduct, image) => {
    try {
      // Prepare data for the backend
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", newProduct.price);
      formData.append("stock", newProduct.stock);
      formData.append("category", newProduct.category);
      formData.append("description", newProduct.description);

      // Append the image file if it exists
      if (image) {
        formData.append("image", image);
      }

      console.log("Adding product:", newProduct);

      const response = await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" }, // Set the content type for form data
      });
      console.log("Added response:", response.data);

      // Update the products state with the new product
      setProducts([...products, response.data]);
      setShowAddForm(false); // Close the add form after successful addition
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
  // --- NEW: Function to handle product deletion ---
  const handleDelete = async (productId, productName) => {
    // Show a confirmation dialog for safety
    if (
      !window.confirm(
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`
      )
    ) {
      return; // Stop if the user clicks "Cancel"
    }

    try {
      //Laravel backend expects a DELETE request at this endpoint
      await api.delete(`/products/${productId}`);

      // Update the state by removing the deleted product, no need to re-fetch
      setProducts(products.filter((product) => product.id !== productId));

      console.log(`Product "${productName}" deleted successfully.`);
    } catch (error) {
      console.error(
        "Error deleting product:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to delete product.");
    }
  };
  const handleUpdate = async (updatedProduct, imageFile) => {
    if (!updatedProduct.id) {
      console.error("Product ID is missing!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("_method", "POST");
      formData.append("id", updatedProduct.id); //line to include the product ID
      formData.append("name", updatedProduct.name);
      formData.append("price", updatedProduct.price);
      formData.append("stock", updatedProduct.stock);
      formData.append("category", updatedProduct.category);
      formData.append("description", updatedProduct.description);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      console.log("Updating product:", updatedProduct);

      const response = await api.post(
        `/products/${updatedProduct.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token
          },
        }
      );

      // Update the product in state
      setProducts(
        products.map((product) =>
          product.id === updatedProduct.id ? response.data : product
        )
      );
      setEditingProduct(null);
    } catch (error) {
      console.error("Update error:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        // Redirect to login if needed
      }
    }
  };
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(filterQuery.toLowerCase())
  );
  return (
    <div className="bg-white rounded-lg shadow z-auto p-6">
      <div
        className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm 
             p-4 border-b border-gray-200/60 shadow-sm
             flex flex-col gap-4
             md:flex-row md:items-center md:justify-between md:rounded-full md:py-3 md:px-6"
      >
        <div className="flex items-center justify-between w-full md:w-auto">
          <h2 className="text-sm xl:text-xl  font-bold">Products</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-500 hover:bg-green-600 text-xs xl:text-xl text-white px-3 py-1.5 rounded-lg transition-colors
                 md:hidden"
          >
            Add Products
          </button>
        </div>

        {/* Search Input */}
        <div className="w-full md:flex-grow md:max-w-sm">
          <input
            type="text"
            placeholder="Search product name..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                 focus:ring-1 focus:ring-green-500 focus:border-green-500 transition focus:outline-none"
          />
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors
               hidden md:block"
        >
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-contain object-center mb-4 rounded-t-lg"
            />
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-red-600 font-bold">${product.price}</p>
            <p className="text-gray-400 text-xs">{product.description}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Stock: {product.stock}
              </span>
              {/* --- NEW: Container for action buttons --- */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-green-400 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                >
                  Edit
                </button>
                {/* --- NEW: Delete button --- */}
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded-md text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onUpdate={handleUpdate}
          onCancel={() => setEditingProduct(null)}
        />
      )}

      {/* Add Product Modal */}
      {showAddForm && (
        <AddProductForm
          onAdd={handleAddProduct}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}
