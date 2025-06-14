import { useState } from "react";

export default function EditCategoryForm({ category, onUpdate, onCancel }) {
  const [updatedCategory, setUpdatedCategory] = useState(() => {
    const normalized = { ...category };
    if (normalized.id && !normalized._id) {
      normalized._id = normalized.id;
    }
    return normalized;
  });
  // const [updatedCategory, setUpdatedCategory] = useState(...category);

  // Log the updated category to check if it has _id
  console.log("Editing category in form:", updatedCategory);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!updatedCategory._id) {
      console.error("Category ID is missing!", updatedCategory);
      return;
    }

    console.log("Form submitted with category:", updatedCategory);
    onUpdate(updatedCategory); // Pass the updated Category to the handler
  };

  return (
    <div className="modal fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="modal-content bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={updatedCategory.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
