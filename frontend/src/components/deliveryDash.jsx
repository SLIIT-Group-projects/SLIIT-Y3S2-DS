import { useEffect, useRef, useState } from "react";
import {
  getDeliveryPersonById,
  updateOnlineStatus,
} from "../services/deliveryAPI";
import ToggleSwitch from "./deliveryComponents/ToggleSwitch";
import { useNavigate } from "react-router-dom";
import DeliveryList from "./deliveryComponents/DeliveryList";
import Currentdeliveries from "./deliveryComponents/Currentdeliveries";

function DeliveryDash() {
  const [driverDetails, setDriverDetails] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHistory = () => {
    navigate("/delivery-history");
  };

  useEffect(() => {
    const upsateStatus = async () => {
      try {
        const res = await updateOnlineStatus(isOnline);
        console.log("Online status updated successfully", res);
      } catch (error) {
        console.error("Error updating online status:", error);
      }
    };
    upsateStatus();
  }, [isOnline]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    const getDeliveryPerson = async () => {
      try {
        const res = await getDeliveryPersonById();
        setDriverDetails(res.deliveryPerson);
      } catch (error) {
        console.error("Error fetching delivery person:", error);
      }
    };
    getDeliveryPerson();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex gap-2">
        <div className=" min-w-[45%] py-2 px-4 flex-1 flex flex-col justify-center">
          <div className="flex text-[3vw] gap-2 font-bold items-center">
            <div className="text-orange-500">Welcome</div>
            <div className="text-gray-800">{driverDetails.name}</div>
          </div>
          <p>
            Welcome, Delivery Personnel! You can accept and fulfill deliveries.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md min-w-[30%] py-2 px-4 flex">
          <div ref={menuRef} className="relative">
            {/* Profile Button */}
            <div
              onClick={toggleMenu}
              className="cursor-pointer relative rounded-full w-20 h-20 bg-orange-500 flex items-center justify-center"
            >
              {/* Small icon on corner */}
              <div className="absolute bottom-0 right-0 rounded-full bg-gray-700 p-1 w-[50%] h-[50%] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              </div>

              {/* Main profile icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>

            {/* Dropdown menu */}
            {menuOpen && (
              <div className="absolute top-24 left-0 bg-white shadow-lg rounded-md border w-40 z-10">
                <ul className="text-sm text-gray-700">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/update-form", { state: { driverDetails } });
                    }}
                  >
                    Update Account
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      {
                        isOnline && setIsOnline(false);
                      }
                      handleLogout();
                      setMenuOpen(false);
                    }}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}

            {/* Driver Info */}
            <div className="flex gap-1 text-lg mt-4">
              <div className="font-semibold">Driver ID :</div>
              <div className="text-gray-500">{driverDetails._id}</div>
            </div>

            <div className="flex gap-1 text-lg mt-2">
              <div className="font-semibold">Phone :</div>
              <div className="text-gray-500">{driverDetails.phoneNumber}</div>
            </div>

            {driverDetails.address && (
              <div className="flex gap-1 text-lg mt-2">
                <div className="font-semibold">Address :</div>
                <div className="text-gray-500">{driverDetails.address}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <div className="flex flex-col w-1/5">
          <div className="flex bg-white gap-2 mt-4 px-4 py-4 text-lg rounded-2xl shadow-md">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-bike-icon lucide-bike mx-2 text-orange-500"
              >
                <circle cx="18.5" cy="17.5" r="3.5" />
                <circle cx="5.5" cy="17.5" r="3.5" />
                <circle cx="15" cy="5" r="1" />
                <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
              </svg>
            </div>
            <div className=" text-xl font-semibold">Total Deliveries : </div>
            <div className="text-xl">{driverDetails.totalDeliveries}</div>
          </div>
          <div className="flex bg-white gap-2 mt-4 px-4 py-4 text-lg rounded-2xl shadow-md">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-wallet-icon lucide-wallet mx-2 text-orange-500"
              >
                <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
              </svg>
            </div>
            <div className=" text-xl font-semibold">Total Earnings : </div>
            <div className="text-xl">{driverDetails.totalEarnings}</div>
          </div>
          <div
            className={`mt-4 px-4 py-4 text-lg rounded-2xl text-white ${
              isOnline ? "bg-orange-400" : "bg-gray-700"
            }`}
          >
            <div className=" text-lg">
              {isOnline
                ? "You're online - Now Accepting orders"
                : "You're offline - Toggle when ready to accept orders"}
            </div>
            <div className="text-xl my-3">
              <ToggleSwitch
                isOn={isOnline}
                handleToggle={() => {
                  setIsOnline((prev) => !prev);
                }}
              />
            </div>
          </div>
          <div
            className="flex justify-between bg-gray-700 text-white gap-2 mt-4 px-4 py-4 text-lg rounded-2xl shadow-md cursor-pointer hover:bg-gray-800"
            onClick={handleHistory}
          >
            <div className=" text-xl font-semibold">Delivey History</div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-square-arrow-out-up-right-icon lucide-square-arrow-out-up-right"
              >
                <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
                <path d="m21 3-9 9" />
                <path d="M15 3h6v6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="w-[30%] h-[400px] overflow-y-auto">
          <div className="font-semibold text-2xl py-2">Current Deliveries</div>
          <Currentdeliveries />
        </div>
        <div className="w-[50%] h-[400px] overflow-y-auto">
          {isOnline ? (
            <DeliveryList />
          ) : (
            <div>you are not online stupid toggle the switch</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeliveryDash;
