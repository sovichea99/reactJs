// src/components/EditProductForm.jsx
import { useState } from "react";

export default function EditProductForm({ product, onUpdate, onCancel }) {
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });
  const [imageFile, setImageFile] = useState(null);

  // Log the updated product to check if it has _id
  console.log("Editing product in form:", updatedProduct);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: value,
      image_url: imageFile ? URL.createObjectURL(imageFile) : product.image_url,
    }));
  };
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!updatedProduct._id) {
      console.error("Product ID is missing!");
      return;
    }

    console.log("Form submitted with product:", updatedProduct);
    onUpdate(updatedProduct, imageFile); // Pass the updated product to the handler
  };

  return (
    <div className="modal fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="modal-content bg-white p-4 rounded-xl shadow-lg w-[400px]">
        {" "}
        {/* Changed from w-96 to w-80 and padding */}
        <h2 className="text-xl font-bold mb-3">Edit Product</h2>{" "}
        {/* Smaller title */}
        <form onSubmit={handleSubmit}>
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

          {/* Image Upload */}
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1">Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full text-sm"
            />
            {updatedProduct.image_url && !imageFile && (
              <img
                src={updatedProduct.image_url}
                alt={updatedProduct.name}
                className="w-full h-[300px]  mt-5 rounded"
              />
            )}
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="w-full h-32 object-cover mt-2 rounded"
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-green-500 text-white text-sm px-3 py-1.5 rounded"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-red-500 text-white text-sm px-3 py-1.5 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
