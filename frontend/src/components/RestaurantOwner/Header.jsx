import React from "react";
import LogOutIcon from "../../assets/log-out.png";
import ProfileIcon from "../../assets/profie.png";
import LogoIcon from "../../assets/logoImage.png";

const HeaderComponent = ({ onLogout }) => {
 
  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow-md border-b border-gray-200 fixed top-0 left-0 right-0 z-30 h-16">
      <div className="flex items-center space-x-4 ml-20"> {/* Adjust ml to match sidebar width */}
        <img
          src={LogoIcon}
          alt="logo"
          className="w-[70px] h-[70px] object-contain"
        />
      </div>

      <div className="flex items-center space-x-6 text-sm">
        <div className="flex items-center space-x-1 cursor-pointer">
          <img src={ProfileIcon} alt="Profile" className="w-4 h-4" />
          <span>Profile</span>
        </div>

        <div 
          className="flex items-center space-x-1 cursor-pointer text-gray-700 hover:text-red-500"
          onClick={onLogout}
        >
          <img src={LogOutIcon} alt="Log-out" className="w-4 h-4" />
          <span>Logout</span>
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;