import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import CustomerDash from "./components/CustomerDash";
import RestaurantDash from "./components/RestaurantDash";
import DeliveryDash from "./components/DeliveryDash";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <></>

    //  <Route path="/register" element={} />
    //  <Route path="/login" element={} />
    //  <Route path="/customer" element={ token && role === "Customer" ? ( ) : ( ) } />
    //  <Route path="/restaurant" element={ token && role === "Restaurant" ? ( ) : ( ) } />
    // <Route path="/delivery" element={ token && role === "Delivery" ? ( ) : ( ) } /> <Route path="/" element={} />
  );
}
