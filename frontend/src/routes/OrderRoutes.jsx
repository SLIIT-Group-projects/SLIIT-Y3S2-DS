import { Route, Navigate } from "react-router-dom";
import ViewBasket from "../components/orderComponents/viewBaskets";
import ViewBasketItems from "../components/orderComponents/viewBasketItems";
import CheckoutRoute from "../components/orderComponents/checkoutPage";
import OrderHistoryRoute from "../components/orderComponents/orderHistoryPage";

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

export default function DeliveryRoutes() {
  return (
    <>
      <Route
        path="/viewBasket"
        element={
          token && role === "customer" ? (
            <ViewBasket />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/viewBasketItems/:restaurantId"
        element={
          token && role === "customer" ? (
            <ViewBasketItems />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/checkout/:restaurantId"
        element={
          token && role === "customer" ? (
            <CheckoutRoute />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/orderHistory"
        element={
          token && role === "customer" ? (
            <OrderHistoryRoute />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </>
  );
}
