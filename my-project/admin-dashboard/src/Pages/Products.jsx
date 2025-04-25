// src/components/Products.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import EditProductForm from './EditProductForm';

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

  const handleUpdate = async (updatedProduct, imageFile) => {
    if (!updatedProduct._id) {
      console.error('Product ID is missing!');
      return;
    }

    try {
      // Prepare data for the backend
      const formData = new FormData();
      formData.append('_id', updatedProduct._id);
      formData.append('name', updatedProduct.name);
      formData.append('price', updatedProduct.price);
      formData.append('stock', updatedProduct.stock);
      formData.append('category', updatedProduct.category);

      // Append the image file if it exists
      if (imageFile) {
        formData.append('image', imageFile);
      }

      console.log('Updating product:', updatedProduct);

      const response = await api.post(`/products/${updatedProduct._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' } // Set the content type for form data
      });
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
              src={product.image_url} 
              alt={product.name} 
              className="w-[200px] h-52 mx-auto mb-4"
            />
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-gray-600">${product.price}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-gray-500">Stock: {product.stock}</span>
              <button 
                onClick={() => handleEdit(product)} 
                className="bg-red-500 text-white px-3 py-1 rounded"
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
