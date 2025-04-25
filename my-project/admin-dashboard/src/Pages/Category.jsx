import { useEffect, useState } from "react";
import api from "../services/api";
import EditCategoryForm from "./EditCategoryForm";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null); // Store the category being edited

  useEffect(() => {
    api
      .get("/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleEdit = (category) => {
    console.log("Editing category:", category); // Log the category to check if it has _id
    setEditingCategory(category);
  };

  const handleUpdate = async (updatedCategory) => {
    if (!updatedCategory._id) {
      console.error("Category ID is missing!");
      return;
    }

    try {
      // Prepare data for the backend
      const formData = new FormData();
      formData.append("_id", updatedCategory._id);
      formData.append("name", updatedCategory.name);

      console.log("Updating category:", updatedCategory);

      const response = await api.post(
        `/categories/${updatedCategory._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }, // Set the content type for form data
        }
      );
      console.log("Updated response:", response.data);

      // Update the category in the state with the new data
      setCategories(
        categories.map((category) =>
          category._id === updatedCategory._id ? response.data : category
        )
      );
      setEditingCategory(null); // Close the edit form after successful update
    } catch (error) {
      console.error("Error updating Category:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-32 gap-y-6">
        {categories.map((category) => (
          <div key={category._id} className="border rounded-lg p-2 flex flex-row space-x-80">
            <h3 className="font-bold text-lg mt-3">{category.name}</h3>
            <div className="mt-2 justify-between items-center flex flex-row ml-20 space-x-2">
              <button
                onClick={() => handleEdit(category)}
                className="bg-green-500 text-white px-3 py-1 rounded w-16"
              >
                Edit
              </button>
              <button 
              
                onClick={async () => {
                  try {
                    await api.delete(`/categories/${category._id}`);
                    setCategories(categories.filter((cat) => cat._id !== category._id));
                  } catch (error) {
                    console.error("Error deleting category:", error);
                  }
                }}
              className="bg-red-500 text-white px-3 py-1 rounded mt-1 mb-1">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <EditCategoryForm
          product={editingCategory}
          onUpdate={handleUpdate}
          onCancel={() => setEditingCategory(null)}
        />
      )}
    </div>
  );
}
