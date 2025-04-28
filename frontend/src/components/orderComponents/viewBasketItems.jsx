import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";



function ViewCartItems() {
  const { restaurantId } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurantName, setRestaurantName] = useState("");
  const navigate = useNavigate();

  // Function to update the quantity
  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5003/api/cart/update/${cartItemId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === cartItemId
            ? {
                ...item,
                quantity: newQuantity,
                totalPrice: item.menuItemDetails.price * newQuantity,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Function to delete a cart item
  const removeCartItem = async (cartItemId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:5003/api/cart/${cartItemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== cartItemId)
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) =>
        total +
        (item.totalPrice || item.menuItemDetails.price * item.quantity || 0),
      0
    );
  };

  // Fetch cart items and restaurant details
  useEffect(() => {
    const fetchCartAndRestaurant = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch cart items
        const cartResponse = await axios.get(
          `http://localhost:5003/api/cart/${restaurantId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCartItems(cartResponse.data.items);

        // Fetch restaurant details
        const restaurantResponse = await axios.get(
          `http://localhost:5004/api/restaurants/${restaurantId}`
        );
        setRestaurantName(restaurantResponse.data.name || "Restaurant");
      } catch (error) {
        console.error("Error fetching data:", error);
        setRestaurantName("Restaurant"); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchCartAndRestaurant();
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Handle checkout button click (dummy for now)
  const handleCheckout = () => {
    alert("Proceeding to checkout...");
    // You can navigate to checkout page or open payment modal here
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">
        Items in Your {restaurantName} Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-gray-500 text-lg">
          No items found in your cart for this restaurant.
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center"
            >
              {/* Menu Item Image and Name */}
              <div className="flex items-center gap-4">
                {item.menuItemDetails?.imageUrl && (
                  <img
                    src={item.menuItemDetails.imageUrl}
                    alt={item.menuItemDetails.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                )}
                <h2 className="text-2xl font-semibold text-orange-500">
                  {item.menuItemDetails?.name || "Unnamed Item"}
                </h2>
              </div>

              <div className="flex gap-4 items-center">
                {/* Quantity control */}
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="bg-gray-200 text-lg px-2 py-1 rounded"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="text-xl">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="bg-gray-200 text-lg px-2 py-1 rounded"
                >
                  +
                </button>
              </div>

              <div className="text-green-600 font-bold">
                Rs{" "}
                {item.menuItemDetails?.price
                  ? (item.menuItemDetails.price * item.quantity).toFixed(2)
                  : "N/A"}
              </div>

              {/* Delete Button */}
              <button
                onClick={() => removeCartItem(item._id)}
                className="text-red-600 font-semibold text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Subtotal and Checkout Section */}
      {cartItems.length > 0 && (
        <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Subtotal</h2>
            <div className="text-green-600 font-bold text-xl">
              Rs {calculateSubtotal().toFixed(2)}
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={() =>
              navigate(`/checkout/${restaurantId}`, {
                state: { subtotal: calculateSubtotal() },
              })
            }
            className="bg-orange-500 w-full text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default ViewCartItems;
