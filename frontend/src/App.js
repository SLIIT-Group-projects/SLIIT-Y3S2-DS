import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/login";
import RestaurantDash from "./components/ResturantDash";
import AdminDash from "./components/adminDash";
import MenuRegister from "./components/RestaurantOwner/MenuRegister";
import DeliveryRoutes from "./routes/DeliveryRoutes";
import CustomerTrackingScreen from "./components/deliveryComponents/CustomerTrackingScreen";
import OrderRoutes from "./routes/OrderRoutes";

// resturant routes
import AllRestaurants from "./components/AllRestaurants";
import Menu from "./components/Menu";
import MenuDetails from "./components/MenuDetails";


import PaymentForm from "./components/payment/PaymentForm"
import AllCustomers from "./components/AdminDashboard/AllCustomers"
import TransactionList from "./components/AdminDashboard/Transaction";
import AdminRestaurantList from "./components/AdminDashboard/ResturantList"

// toast msg
import { Toaster } from "react-hot-toast";
import AdminAllOrders from "./components/AdminDashboard/AllOrders";
//Restaurant Service
import Sidebar from "./components/RestaurantOwner/SideBar";
import Header from "./components/RestaurantOwner/Header";
import RestuarantOwner from "./components/RestaurantOwner/RestuarantOwner";
import RestaurantRegister from "./components/RestaurantOwner/RestaurantRegister";
import AddMenuItem from "./components/RestaurantOwner/MenuRegister";
import EditMenuItem from "./components/RestaurantOwner/EditMenuItem"; 
import MyRestaurants from "./components/RestaurantOwner/MyRestaurants";
import EditRestaurant from "./components/RestaurantOwner/EditRestaurant";
import Home from "./components/Home";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toLowerCase(); // ✅ Normalize

  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/register" element={<Register />} />]
        <Route path="/home" element={<Home/>} />

        <Route path="/login" element={<Login />} />
        <Route path="/payment" element={<PaymentForm />} />

       {/*Restaurant Service -Customer side*/} 
        <Route path="/restaurants/:restaurantId/menuItems" element={<Menu />} />
        <Route path="/allRestaurants" element={<AllRestaurants />} />
        <Route path="/restaurants/:restaurantId/menu/:menuItemId" element={<MenuDetails />} />
        
        {/*Restaurant Service -Admin*/}       
        <Route path="/restaurantOwner" element={<RestuarantOwner />} />

        <Route path="/restaurant" element={<RestaurantDash />} />
        <Route path="/restaurant-register" element={<RestaurantRegister />} />
        <Route path="/restaurants/:restaurantId/menu" element={<AddMenuItem />} />
        <Route path="/menu/:id/edit" element={<EditMenuItem/>}/>
        <Route path="/myRestaurants" element={<MyRestaurants />} />
        <Route path="/restaurants/:restaurantId/edit" element={<EditRestaurant />} />


        <Route
          path="/restaurantOwner"
          element={
            token && role === "restaurant" ? (
              <RestuarantOwner />
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
        <Route
          path="/track-driver/:deliveryId"
          element={<CustomerTrackingScreen />}
        />
        <Route path="/" element={<Navigate to="/login" />} />

        {/* resturants */}
        <Route path="/restaurants/:restaurantId/menuItems" element={<Menu />} />
        <Route path="/allRestaurants" element={<AllRestaurants />} />
        <Route
          path="/restaurants/:restaurantId/menu/:menuItemId"
          element={
                    token && role === "customer" ? (
                      <MenuDetails />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
        />
        <Route path="/admin/users" element={<AllCustomers />} />
        <Route path="/admin/transactions" element={<TransactionList />} />
        <Route path="/admin/restaurants" element={<AdminRestaurantList />} />
        <Route path="/admin/orders" element={<AdminAllOrders />} />
      </Routes>
    </Router>
  );
}

export default App;
