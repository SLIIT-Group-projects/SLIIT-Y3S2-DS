import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  ShoppingBagIcon,
  BuildingStorefrontIcon,
  CreditCardIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
    setIsOpen(false);
  };

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: HomeIcon },
    { name: "Users", path: "/admin/users", icon: UsersIcon },
    { name: "Orders", path: "/admin/orders", icon: ShoppingBagIcon },
    { name: "Restaurants", path: "/admin/restaurants", icon: BuildingStorefrontIcon },
    { name: "Transactions", path: "/admin/transactions", icon: CreditCardIcon },
  ];

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md focus:outline-none hover:bg-gray-700 transition duration-200 focus:ring-2 focus:ring-orange-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-64 w-60 shadow-xl`}
        role="navigation"
        aria-label="Admin Sidebar"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold flex items-center">
            <BuildingStorefrontIcon className="w-6 h-6 mr-2" />
            Admin Portal
          </h2>
          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition duration-200 text-sm font-medium ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`
                }
                onClick={closeSidebar}
                title={item.name}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition duration-200 text-sm font-medium"
              aria-label="Logout"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default AdminSidebar;