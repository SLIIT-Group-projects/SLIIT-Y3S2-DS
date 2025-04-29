import { useState, useEffect } from "react";
import axios from "axios";

function AddMenuItem() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    preparationTime: "",
    ingredients: "",
    dietaryTags: [],
    cuisineType: "",
  });

  const [imagePreview, setImagePreview] = useState(null); // Store single image
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedRestaurantId = localStorage.getItem("restaurantId");
    if (storedRestaurantId) {
      setForm((prevForm) => ({ ...prevForm, restaurantId: storedRestaurantId }));
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get only the first file
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }

    // Clear previous error
    setError("");

    // Create preview URL
    const preview = URL.createObjectURL(file);
    setImagePreview({ file, preview });
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview.preview); // Free memory
      setImagePreview(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "dietaryTags") {
      setForm({ ...form, [name]: Array.from(e.target.selectedOptions, (opt) => opt.value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const storedRestaurantId = localStorage.getItem("restaurantId");
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found, please login again.");
      setIsLoading(false);
      return;
    }

    if (!storedRestaurantId) {
      setError("No restaurant selected.");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("restaurantId", storedRestaurantId);
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("preparationTime", form.preparationTime);
      formData.append("ingredients", form.ingredients);
      formData.append("cuisineType", form.cuisineType);

      // Append dietary tags
      form.dietaryTags.forEach((tag) => {
        formData.append("dietaryTags", tag);
      });

      // Append the single image (if exists)
      if (imagePreview) {
        formData.append("image", imagePreview.file); // Match backend field name
      }

      const response = await axios.post(
        "http://localhost:5004/api/menu-items",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Menu item added successfully!");
      // Reset form after successful submission
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        preparationTime: "",
        ingredients: "",
        dietaryTags: [],
        cuisineType: "",
      });
      removeImage(); // Clear image preview
    } catch (err) {
      console.error("Error adding menu item:", err);
      setError(err.response?.data?.message || "Failed to add menu item");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Menu Item</h2>
      {error && <div className="mb-4 p-2 text-red-600 bg-red-100 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
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
                src={imagePreview.preview}
                alt="Preview"
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

        {/* Rest of the form fields remain the same */}
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
        />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          name="preparationTime"
          value={form.preparationTime}
          onChange={handleChange}
          placeholder="Preparation Time (min)"
          className="w-full p-2 border rounded"
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

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 rounded text-white ${
            isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Adding..." : "Add Item"}
        </button>
      </form>
    </div>
  );
}

export default AddMenuItem;