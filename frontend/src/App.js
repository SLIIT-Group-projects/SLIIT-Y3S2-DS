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
import DeliveryDash from "./components/deliveryDash";
import AdminDash from "./components/adminDash";

//home
import Home from "./components/Home";
import AllRestaurants from "./components/AllRestaurants";
import Menu from "./components/Menu";
import MenuDetails from "./components/MenuDetails";

//Restaurant Service
import Sidebar from "./components/RestaurantOwner/SideBar";
import Header from "./components/RestaurantOwner/Header";
import RestuarantOwner from "./components/RestaurantOwner/RestuarantOwner";
import RestaurantDash from "./components/ResturantDash";
import RestaurantRegister from "./components/RestaurantOwner/RestaurantRegister";
import AddMenuItem from "./components/RestaurantOwner/MenuRegister";
import EditMenuItem from "./components/RestaurantOwner/EditMenuItem";
function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />

       
        <Route path="/restaurants/:restaurantId/menuItems" element={<Menu />} />
        <Route path="/allRestaurants" element={<AllRestaurants />} />
        <Route path="/restaurants/:restaurantId/menu/:menuItemId" element={<MenuDetails />} />
        
        
        
        
        <Route path="/login" element={<Login />} />
        
        {/*Restaurant Service*/}
        
        <Route path="/restaurantOwner" element={<RestuarantOwner />} />
        <Route path="/restaurant" element={<RestaurantDash />} />
        <Route path="/restaurant-register" element={<RestaurantRegister />} />
        <Route path="/restaurants/:restaurantId/menu" element={<AddMenuItem />} />
        <Route path="/menu/:id/edit" element={<EditMenuItem/>}/>

        <Route
          path="/home"
          element={
            token && role === "customer" ? (
              <Home />
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
        <Route
          path="/delivery"
          element={
            token && role === "delivery" ? (
              <DeliveryDash />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
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
