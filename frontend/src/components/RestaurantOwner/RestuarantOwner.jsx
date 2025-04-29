import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./SideBar";
import RestaurantDash from "../ResturantDash";

const RestaurantOwner = () => {
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const renderContent = () => {
        switch (activeTab) {
            case "Dashboard":
                return <RestaurantDash />;
                /*
                case "Orders":
                return <Orders />;
            case "Product":
                return <Products />;*/
            default:
                return <RestaurantDash />;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <Header onLogout={handleLogout} />
            <div className="flex flex-1 overflow-hidden pt-16">
                <Sidebar 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab}
                    expanded={sidebarExpanded}
                    setExpanded={setSidebarExpanded}
                />
                <main 
                    className={`flex-1 overflow-y-auto transition-all duration-300 ${
                        sidebarExpanded ? "ml-64" : "ml-20"
                    }`}
                >
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default RestaurantOwner;