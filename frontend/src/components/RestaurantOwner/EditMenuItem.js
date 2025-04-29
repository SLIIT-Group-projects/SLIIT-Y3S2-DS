import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditMenuItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    isAvailable: true,
    preparationTime: "",
    ingredients: "",
    dietaryTags: [],
    cuisineType: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // In your fetchMenuItem function inside useEffect:
const fetchMenuItem = async () => {
  try {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:5004/api/menu-items/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const item = res.data;
    setForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      isAvailable: item.isAvailable,
      preparationTime: item.preparationTime?.toString() || "",
      ingredients: item.ingredients?.join(", ") || "",
      dietaryTags: item.dietaryTags || [],
      cuisineType: item.cuisineType
    });
    
    // Set image preview - ensure the URL is properly formatted
    if (item.imageUrl) {
      // Check if it's a Cloudinary URL or needs modification
      const previewUrl = item.imageUrl.startsWith('http') ? 
        item.imageUrl : 
        `http://localhost:5004/${item.imageUrl}`;
      setImagePreview(previewUrl);
    }
  } catch (err) {
    console.error("Failed to fetch menu item", err);
    setError("Failed to load menu item");
  } finally {
    setIsLoading(false);
  }
};

    fetchMenuItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (name === "dietaryTags") {
      setForm({ ...form, [name]: Array.from(e.target.selectedOptions, opt => opt.value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPEG, PNG, etc.)");
      return;
    }

    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    URL.revokeObjectURL(imagePreview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
  
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("isAvailable", form.isAvailable);
      formData.append("preparationTime", form.preparationTime);
      formData.append("ingredients", form.ingredients);
      formData.append("cuisineType", form.cuisineType);
      
      // Append dietary tags
      form.dietaryTags.forEach(tag => {
        formData.append("dietaryTags", tag);
      });
  
      // Append image if it's a new file
      if (imageFile) {
        formData.append("image", imageFile);
      }
  
      await axios.put(
        `http://localhost:5004/api/menu-items/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      alert("Menu item updated successfully!");
      navigate(-1);
    } catch (err) {
      console.error("Error updating menu item:", err);
      setError(err.response?.data?.message || "Failed to update menu item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5004/api/menu-items/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Menu item deleted successfully!");
      navigate("/restaurant-dash");
    } catch (err) {
      console.error("Error deleting menu item:", err);
      setError("Failed to delete menu item");
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading menu item...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Menu Item</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload Section */}
        <div>
          <label className="block mb-2 font-medium">Item Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
          {imagePreview && (
            <div className="mt-2 relative">
              <img
                src={imagePreview}
                alt="Menu item preview"
                className="h-48 w-full object-contain rounded border"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
          rows="3"
        />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full p-2 border rounded"
          required
          min="0"
          step="0.01"
        />

        <input
          type="number"
          name="preparationTime"
          value={form.preparationTime}
          onChange={handleChange}
          placeholder="Preparation Time (minutes)"
          className="w-full p-2 border rounded"
          min="0"
        />

        <input
          type="text"
          name="ingredients"
          value={form.ingredients}
          onChange={handleChange}
          placeholder="Ingredients (comma separated)"
          className="w-full p-2 border rounded"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="Appetizer">Appetizer</option>
          <option value="Main Course">Main Course</option>
          <option value="Pizza">Pizza</option>
          <option value="Dessert">Dessert</option>
          <option value="Beverage">Beverage</option>
          <option value="Special">Special</option>
          <option value="Rice and Curry">Rice and Curry</option>
          <option value="Fish and Seafood">Fish and Seafood</option>
          <option value="Poultry and Meat">Poultry and Meat</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Pasta">Pasta</option>
          <option value="Noodles">Noodles</option>
        </select>

        <select
          name="cuisineType"
          value={form.cuisineType}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Cuisine Type</option>
          <option value="Indian">Indian</option>
          <option value="Chinese">Chinese</option>
          <option value="Italian">Italian</option>
          <option value="Mexican">Mexican</option>
          <option value="Japanese">Japanese</option>
          <option value="French">French</option>
          <option value="Greek">Greek</option>
          <option value="Spanish">Spanish</option>
          <option value="Thai">Thai</option>
          <option value="Turkish">Turkish</option>
          <option value="Korean">Korean</option>
          <option value="Sri Lankan">Sri Lankan</option>
        </select>

        <select
          multiple
          name="dietaryTags"
          value={form.dietaryTags}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Vegetarian">Vegetarian</option>
          <option value="Vegan">Vegan</option>
          <option value="Gluten-Free">Gluten-Free</option>
          <option value="Halal">Halal</option>
          <option value="Spicy">Spicy</option>
        </select>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isAvailable"
            name="isAvailable"
            checked={form.isAvailable}
            onChange={handleChange}
            className="mr-2 h-5 w-5"
          />
          <label htmlFor="isAvailable" className="text-gray-700">
            Currently Available
          </label>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded transition duration-200"
            disabled={isLoading}
          >
            Delete Item
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Item"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditMenuItem;