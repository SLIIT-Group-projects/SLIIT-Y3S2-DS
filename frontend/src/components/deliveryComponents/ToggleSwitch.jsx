import React from "react";

const ToggleSwitch = ({ isOn, handleToggle }) => {
  return (
    <div className="flex items-center space-x-2">
      <div
        onClick={handleToggle}
        className={`w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition ${
          isOn ? "bg-[#D1D5DB]" : "bg-[#D1D5DB]"
        }`}
      >
        <div
          className={`w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
            isOn ? "translate-x-6 bg-[#fd822a]" : "translate-x-0 bg-gray-700"
          }`}
        />
      </div>
    </div>
  );
};

export default ToggleSwitch;
