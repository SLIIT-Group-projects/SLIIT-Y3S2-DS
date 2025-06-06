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
import DeliveryDash from "./components/deliveryDash";
import AdminDash from "./components/adminDash";
import PaymentForm from "./components/payment/PaymentForm";
import AllCustomers from "./components/AdminDashboard/AllCustomers"
import TransactionList from "./components/AdminDashboard/Transaction";
function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toLowerCase(); // ✅ Normalize

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/payment" element={<PaymentForm />} />
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
        
        <Route path="/admin/users" element={<AllCustomers/>} />
        <Route path="/admin/transactions" element={<TransactionList/>} />
      </Routes>
    </Router>
  );
}

export default App;
