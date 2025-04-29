function DeliveryDash() {
    const handleLogout = () => {
      localStorage.clear();
      window.location.href = "/login";
    };
  
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">Delivery Dashboard</h2>
        <p>Welcome, Delivery Personnel! You can accept and fulfill deliveries.</p>
        <button onClick={handleLogout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
    );
  }
  
  export default DeliveryDash;
  