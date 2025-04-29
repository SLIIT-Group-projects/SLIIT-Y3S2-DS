import { useState , useEffect} from "react";
import axios from "axios";

 function AddMenuItem() {
  const [form, setForm] = useState({
    restaurantId: "",
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    preparationTime: "",
    ingredients: "",
    dietaryTags: [],
    cuisineType: ""
  });

  useEffect(() => {
    const storedRestaurantId = localStorage.getItem("restaurantId");
    if (storedRestaurantId) {
      setForm((prevForm) => ({ ...prevForm, restaurantId: storedRestaurantId }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "dietaryTags") {
      setForm({ ...form, [name]: Array.from(e.target.selectedOptions, opt => opt.value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      price: parseFloat(form.price),
      preparationTime: parseInt(form.preparationTime),
      ingredients: form.ingredients.split(',').map(i => i.trim())
    };

    try {
      const res = await axios.post('http://localhost:5004/api/menu-items', data);
      alert('Menu item added!');
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert('Error adding item');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Menu Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input type="text" name="restaurantId" value={form.restaurantId} onChange={handleChange} readOnly className="w-full p-2 border rounded" required />

        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" required />

        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />

        <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price" className="w-full p-2 border rounded" required />

        <input type="text" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Image URL" className="w-full p-2 border rounded" />

        <input type="number" name="preparationTime" value={form.preparationTime} onChange={handleChange} placeholder="Preparation Time (min)" className="w-full p-2 border rounded" />

        <input type="text" name="ingredients" value={form.ingredients} onChange={handleChange} placeholder="Ingredients (comma separated)" className="w-full p-2 border rounded" />

        <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded" required>
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

        <select name="cuisineType" value={form.cuisineType} onChange={handleChange} className="w-full p-2 border rounded" required>
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

        <select multiple name="dietaryTags" value={form.dietaryTags} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="Vegetarian">Vegetarian</option>
          <option value="Vegan">Vegan</option>
          <option value="Gluten-Free">Gluten-Free</option>
          <option value="Halal">Halal</option>
          <option value="Spicy">Spicy</option>
        </select>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Add Item</button>
      </form>
    </div>
  );
}

export default AddMenuItem;