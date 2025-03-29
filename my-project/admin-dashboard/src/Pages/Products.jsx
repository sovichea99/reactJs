import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null); // Store the product being edited

  useEffect(() => {
    api.get('/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleEdit = (product) => {
    console.log('Editing product:', product); // Log the product to check if it has _id
    setEditingProduct(product);
  };

  const handleUpdate = async (updatedProduct) => {
    if (!updatedProduct._id) {
      console.error('Product ID is missing!');
      return;
    }

    try {
      console.log('Updating product:', updatedProduct);
      const response = await api.put(`/products/${updatedProduct._id}`, updatedProduct);
      console.log('Updated response:', response.data);

      // Update the product in the state with the new data
      setProducts(products.map((product) =>
        product._id === updatedProduct._id ? response.data : product
      ));
      setEditingProduct(null); // Close the edit form after successful update
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border rounded-lg p-4">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-48 object-cover mb-4"
            />
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-gray-600">${product.price}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-gray-500">Stock: {product.stock}</span>
              <button 
                onClick={() => handleEdit(product)} 
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
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
    </div>
  );
}

function EditProductForm({ product, onUpdate, onCancel }) {
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });

  // Log the updated product to check if it has _id
  console.log('Editing product in form:', updatedProduct);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!updatedProduct._id) {
      console.error('Product ID is missing!');
      return;
    }

    console.log('Form submitted with product:', updatedProduct);
    onUpdate(updatedProduct); // Pass the updated product to the handler
  };

  return (
    <div className="modal fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="modal-content bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input 
              type="text" 
              name="name" 
              value={updatedProduct.name} 
              onChange={handleChange} 
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Price</label>
            <input 
              type="number" 
              name="price" 
              value={updatedProduct.price} 
              onChange={handleChange} 
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Stock</label>
            <input 
              type="number" 
              name="stock" 
              value={updatedProduct.stock} 
              onChange={handleChange} 
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Category</label>
            <input 
              type="text" 
              name="category" 
              value={updatedProduct.category} 
              onChange={handleChange} 
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-between">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Update</button>
            <button type="button" onClick={onCancel} className="bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
