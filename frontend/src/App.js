// frontend/src/App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/login";
import CustomerDash from "./components/customerDash";
import RestaurantDash from "./components/ResturantDash";
import AdminDash from "./components/adminDash";
import RestaurantRegister from "./components/RestaurantOwner/RestaurantRegister";
import MenuRegister from "./components/RestaurantOwner/MenuRegister";
import DeliveryRoutes from "./routes/DeliveryRoutes";
import OrderRoutes from "./routes/OrderRoutes";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/restaurant" element={<RestaurantDash />} />
        <Route path="/restaurant-register" element={<RestaurantRegister />} />
        <Route path="/add-menuItems" element={<MenuRegister />} />

        <Route
          path="/customer"
          element={
            token && role === "customer" ? (
              <CustomerDash />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/restaurant"
          element={
            token && role === "restaurant" ? (
              <RestaurantDash />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {DeliveryRoutes()}
        {OrderRoutes()}
        <Route
          path="/admin"
          element={
            token && role === "admin" ? <AdminDash /> : <Navigate to="/login" />
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
