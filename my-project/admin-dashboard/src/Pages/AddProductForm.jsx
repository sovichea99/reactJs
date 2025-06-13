import { useState } from "react";

export default function AddProductForm({ onAdd, onCancel }) {
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    image: null,
  });
  const [image, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newProduct, image);
  };

  return (
    <div className="modal fixed z-10 inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="modal-content bg-white p-4 rounded-xl shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-3">Add Product</h2>
        <form onSubmit={handleSubmit}>
          {/* Row 1: Name + Price */}
          <div className="flex gap-2 mb-3">
            <div className="w-1/2">
              <label className="block text-xs font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleChange}
                className="w-full p-1.5 text-sm border rounded"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-medium mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={newProduct.price}
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
                value={newProduct.stock}
                onChange={handleChange}
                className="w-full p-1.5 text-sm border rounded"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-medium mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={newProduct.category}
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
              value={newProduct.description}
              onChange={handleChange}
              className="w-full p-1.5 text-sm border rounded"
            />
          </div>
          {/* Image Upload */}
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1">Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full text-sm"
            />
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-full h-52 object-cover mt-2 rounded"
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-green-500 text-white text-sm px-3 py-1.5 rounded"
            >
              Add Now
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
