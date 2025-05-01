import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ViewBasket() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantsInCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5003/api/cart/restaurants", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setRestaurants(response.data.restaurants);
      } catch (error) {
        console.error("Error fetching cart restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantsInCart();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Your Basket</h1>

      {restaurants.length === 0 ? (
        <div className="text-gray-500 text-lg">Your cart is empty.</div>
      ) : (
        <div className="space-y-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-gradient-to-br from-orange-100 via-white to-orange-50 rounded-xl shadow-md p-6 flex flex-col gap-3 cursor-pointer
               hover:shadow-xl hover:brightness-105 transition-all duration-300 ease-in-out"
            >
              <h2 className="text-2xl font-semibold text-orange-500">{restaurant.name}</h2>
              <p className="text-gray-600">{restaurant.description || "No description available"}</p>

              <div className="text-sm text-gray-700 space-y-1">
                {/* 🏠 Address */}
                <div>
                  🏠 Address:{" "}
                  {restaurant.address
                    ? `${restaurant.address.buildingNumber}, ${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.district}, ${restaurant.address.postalCode}`
                    : "Address not available"}
                </div>

                {/* ☎️ Contact Phone */}
                <div>
                  ☎️ Contact: {restaurant.contact?.phone || "Not available"}
                </div>

                {/* 📧 Contact Email */}
                <div>
                  📧 Email: {restaurant.contact?.email || "Not available"}
                </div>

                {/* ⏰ Opening Hours */}
                <div>
                  ⏰ Opening Hours:
                  {restaurant.openingHours && restaurant.openingHours.length > 0 ? (
                    <ul className="list-disc list-inside ml-4">
                      {restaurant.openingHours.map((hours, idx) => (
                        <li key={idx}>
                          {hours.day}: {hours.open} - {hours.close}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    " Not available"
                  )}
                </div>
              </div>

              <button
                onClick={() => navigate(`/viewBasketItems/${restaurant._id}`)}
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md"
              >
                View Basket
              </button>
            </div>
          ))}
        </div>
      )}

      {restaurants.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
          <button
            onClick={() => navigate("/orderHistory")}
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-8 rounded-full text-lg shadow-lg"
          >
            View Orders
          </button>
        </div>
      )}
    </div>
  );
}

export default ViewBasket;
