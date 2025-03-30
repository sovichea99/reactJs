// src/components/EditProductForm.jsx
import { useState } from 'react';

export default function EditProductForm({ product, onUpdate, onCancel }) {
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });
  const [imageFile, setImageFile] = useState(null);

  // Log the updated product to check if it has _id
  console.log('Editing product in form:', updatedProduct);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: value,
      image_url: imageFile? URL.createObjectURL(imageFile) : product.image_url,
    }));
  };
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!updatedProduct._id) {
      console.error('Product ID is missing!');
      return;
    }

    console.log('Form submitted with product:', updatedProduct);
    onUpdate(updatedProduct, imageFile); // Pass the updated product to the handler
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
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Image</label>
            <input 
              type="file" 
              onChange={handleImageChange} 
              className="w-full p-2 border rounded"
            />
            {updatedProduct.image_url && !imageFile && (
                 <img 
                 src={updatedProduct.image_url} 
                 alt={updatedProduct.name} 
                 className="w-full h-48 object-cover mb-4"
                 />
            )}
            {imageFile && (
              <img 
                src={URL.createObjectURL(imageFile)} 
                alt="Preview" 
                className="w-full h-48 object-cover mb-4"
              />
            )}
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
