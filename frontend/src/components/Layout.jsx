import React, { useState } from "react";
import HeaderComponent from "./RestaurantOwner/Header";
import Sidebar from "./RestaurantOwner/SideBar";

const Layout = ({ children }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderComponent toggleSidebar={toggleSidebar} />
      <div className="flex flex-1" style={{ marginTop: "64px" }}>
        <Sidebar expanded={expanded} toggleSidebar={toggleSidebar} />
        <main
          className={`flex-1 transition-all duration-300 ${
            expanded ? "ml-64" : "ml-20"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;