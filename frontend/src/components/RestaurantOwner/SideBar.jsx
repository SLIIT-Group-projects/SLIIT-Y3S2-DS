import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "../../assets/dashboard.png";
import ProductIcon from "../../assets/product.png";
import FlashSalesIcon from "../../assets/flash-sales.png";
import OrdersIcon from "../../assets/orders.png";
import WithdrawalIcon from "../../assets/withdrawal.png";
import StoreIcon from "../../assets/store.png";
import HamburgerIcon from "../../assets/hamburger.png";

const Sidebar = ({ activeTab, setActiveTab, expanded, setExpanded }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: DashboardIcon, path: "/restaurantOwner" },
    { name: "Product", icon: ProductIcon, path: "/products" },
    { name: "Flash Sales", icon: FlashSalesIcon, path: "/flash-sales" },
    { name: "Orders", icon: OrdersIcon, path: "/orders" },
    { name: "Payments", icon: WithdrawalIcon, path: "/payments" },
    { name: "Restaurants", icon: StoreIcon, path: "/myRestaurants" },
  ];

  const handleClick = (item) => {
    setActiveTab(item.name);
    navigate(item.path);
  };

  return (
    <div className={`h-screen bg-white shadow-md fixed top-0 left-0 z-40 transition-all duration-300 ${
      expanded ? "w-64" : "w-20"
    }`}>
      {/* Hamburger menu */}
      <div className="w-full h-16 flex items-center justify-center">
        <button
          className="flex items-center px-4 py-4 cursor-pointer focus:outline-none"
          onClick={() => setExpanded(!expanded)}
        >
          <img src={HamburgerIcon} alt="Menu" className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar menu */}
      <ul className="mt-2">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`flex items-center px-6 py-3 cursor-pointer transition-colors ${
              activeTab === item.name
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => handleClick(item)}
          >
            <img src={item.icon} alt={item.name} className="w-5 h-5" />
            {expanded && <span className="ml-3">{item.name}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;