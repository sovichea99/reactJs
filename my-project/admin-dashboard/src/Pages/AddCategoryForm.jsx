import { useState } from "react";

export default function AddCategoryForm({ onAdd, onCancel }) {
  const [newCategory, setNewCategory] = useState({
    name: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newCategory);
    setNewCategory({ name: '' }); // Reset the form after submission
  }


  return (
    <div className="modal fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="modal-content bg-white p-4 rounded-xl shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-3">Add Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 mb-3">
            <div className="w-1/2">
              <label className="block text-xs font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleChange}
                className="w-full p-1.5 text-sm border rounded"
              />
            </div>
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
