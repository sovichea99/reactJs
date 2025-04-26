import { useEffect, useState } from "react";
import api from "../services/api";
import EditCategoryForm from "./EditCategoryForm";
import AddCategoryForm from "./AddCategoryForm";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null); // Store the category being edited
  const [showAddForm, setShowAddForm] = useState(false);

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
    const token = localStorage.getItem("authtoken");
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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }, // Set the content type for form data
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

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authtoken");

      if (!id) {
        console.error("No ID provided for deletion!");
        return;
      }

      await api.delete(`/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update state
      setCategories(categories.filter((category) => category._id));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category.");
    }
  };

  const handleAddCategory = async (newCategory) => {
    const token = localStorage.getItem("authtoken"); // or sessionStorage if you use session
    try {
      const response = await api.post("/categories", newCategory, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      console.log("Added category:", response.data);
  
      setCategories((prevCategories) => [...prevCategories, response.data]);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };
  

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Add New Product
        </button> 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-32 gap-y-6">
        {categories.map((category) => (
          <div
            key={category._id}
            className="border rounded-lg p-2 flex flex-row space-x-80"
          >
            <h3 className="font-semibold text-md mt-3">{category.name}</h3>
            <div className="mt-2 justify-between items-center flex flex-row ml-20 space-x-2">
              <button
                onClick={() => handleEdit(category)}
                className="bg-green-500 text-white px-3 py-1 rounded w-16"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="bg-red-500 text-white px-3 py-1 rounded mt-1 mb-1"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <EditCategoryForm
          category={editingCategory}
          onUpdate={handleUpdate}
          onCancel={() => setEditingCategory(null)}
        />
      )}
        {/* Add Category Modal */}
        {showAddForm && (
        <AddCategoryForm
          onAdd={handleAddCategory}
          onCancel={() => setShowAddForm(false)}
        />
        )}
    </div>
  );
}
