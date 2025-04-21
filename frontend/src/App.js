/*//import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import Register from "./components/Register"; 

//import Login from "./components/Login"; 
//import CustomerDash from "./components/CustomerDash"; 
//import RestaurantDash from "./components/RestaurantDash"; 
//import DeliveryDash from "./components/DeliveryDash";

function App() { const token = localStorage.getItem("token"); const role = localStorage.getItem("role");

return (
  <div>
  <h1>Hello from App</h1>
</div>

//  <Route path="/register" element={} /> 
//  <Route path="/login" element={} /> 
//  <Route path="/customer" element={ token && role === "Customer" ? ( ) : ( ) } /> 
//  <Route path="/restaurant" element={ token && role === "Restaurant" ? ( ) : ( ) } /> <Route path="/delivery" element={ token && role === "Delivery" ? ( ) : ( ) } /> <Route path="/" element={} />

 ); }*/
 import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import RestaurantRegister from "./components/RestaurantAdmin/RestaurantRegister";
//import Login from "./components/Login";
//import CustomerDash from "./components/CustomerDash";
//import RestaurantDash from "./components/RestaurantDash";
//import DeliveryDash from "./components/DeliveryDash";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/restaurantregister" element={<RestaurantRegister />} />
         {/*<Route path="/register" element={<Register />} />
       <Route path="/login" element={<Login />} />
        <Route
          path="/customer"
          element={
            token && role === "Customer" ? <CustomerDash /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/restaurant"
          element={
            token && role === "Restaurant" ? <RestaurantDash /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/delivery"
          element={
            token && role === "Delivery" ? <DeliveryDash /> : <Navigate to="/login" />
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />*/}
      </Routes>
    </Router>
  );
}

export default App;
