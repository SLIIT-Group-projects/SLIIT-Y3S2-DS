import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false); // For mobile toggle
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Users", path: "/admin/users", icon: "👥" },
    { name: "Orders", path: "/admin/orders", icon: "📦" },
    { name: "Restaurants", path: "/admin/restaurants", icon: "🍽️" },
    { name: "Deliveries", path: "/admin/deliveries", icon: "🚚" },
    { name: "Transactions", path: "/admin/transactions", icon: "🚚" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-orange-500 text-white rounded-lg focus:outline-none hover:bg-orange-600 transition duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✖" : "☰"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-64 w-56`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-10 flex items-center">
            <span className="mr-2">🍔</span> Admin Portal
          </h2>
          <nav className="space-y-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className="flex items-center p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition duration-200 font-medium"
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </a>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition duration-200 font-medium"
            >
              <span className="mr-3 text-lg">🚪</span>
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default AdminSidebar;