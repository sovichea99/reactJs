// src/components/EditProductForm.jsx
import { useState } from "react";

export default function EditProductForm({ product, onUpdate, onCancel }) {
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });
  const [imageFile, setImageFile] = useState(null);

  // Debugging: Let's see what prop we receive. It should have `_id`.
  console.log("Product received in form:", product);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!updatedProduct.id) {
    console.error("Product id is missing!");
    return;
  }

  const formData = new FormData();
  formData.append("id", updatedProduct.id); // Add this line
  formData.append("name", updatedProduct.name);
  formData.append("price", updatedProduct.price);
  formData.append("stock", updatedProduct.stock);
  formData.append("category", updatedProduct.category);
  formData.append("description", updatedProduct.description);

  if (imageFile) {
    formData.append("image", imageFile);
  }
  
  // Pass the formData and imageFile separately
  onUpdate(updatedProduct, imageFile);
};

  return (
    <div className="modal fixed z-10 inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 overflow-y-auto py-6">
      <div className="modal-content bg-white p-4 rounded-xl shadow-lg w-[400px] max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-3">Edit Product</h2>
        <form onSubmit={handleSubmit}>
          {/* All your input fields remain the same... */}
          {/* Row 1: Name + Price */}
          <div className="flex gap-2 mb-3">
            <div className="w-1/2">
              <label className="block text-xs font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={updatedProduct.name}
                onChange={handleChange}
                className="w-full p-1.5 text-sm border rounded"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-medium mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={updatedProduct.price}
                onChange={handleChange}
                className="w-full p-1.5 text-sm border rounded"
              />
            </div>
          </div>

          {/* Row 2: Stock + Category */}
          <div className="flex gap-2 mb-3">
            <div className="w-1/2">
              <label className="block text-xs font-medium mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={updatedProduct.stock}
                onChange={handleChange}
                className="w-full p-1.5 text-sm border rounded"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-medium mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={updatedProduct.category}
                onChange={handleChange}
                className="w-full p-1.5 text-sm border rounded"
              />
            </div>
          </div>
          {/* Description */}
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={updatedProduct.description || ''} // Handle if description is null
              onChange={handleChange}
              className="w-full p-1.5 text-sm border rounded"
            />
          </div>
          {/* Image Upload */}
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1">Replace Image (Optional)</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full text-sm"
              accept="image/*"
            />
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : updatedProduct.image}
              alt="Preview"
              className="w-full h-48 object-cover mt-2 rounded"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-green-400 text-white text-sm px-3 py-1.5 rounded"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-red-400 text-white text-sm px-3 py-1.5 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}