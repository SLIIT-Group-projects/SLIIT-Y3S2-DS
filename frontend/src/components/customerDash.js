function CustomerDash() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const navigateToDeliveryDriver = () => {
    window.location.href = "/delivery-form";
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">Customer Dashboard</h2>
      <p>
        Welcome, Customer! You can browse restaurants, order food, and track
        deliveries.
      </p>
      <div className="my-4">
        want to sign in as a delivery driver.... click that shit below u 👇👇👇
      </div>
      <div>
        <button
          onClick={navigateToDeliveryDriver}
          className="mt-4 bg-gray-700 text-white px-4 py-2 rounded"
        >
          i'm shit btw 💩!!!
        </button>
      </div>

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default CustomerDash;
