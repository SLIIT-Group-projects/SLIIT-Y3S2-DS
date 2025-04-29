import { Route, Navigate } from "react-router-dom";
import DeliveryDash from "../components/deliveryDash";
import DeliveryDriverUpdateForm from "../components/deliveryComponents/DeliveryDriverUpdateForm";
import DeliveryDriverForm from "../components/deliveryComponents/deliveryDriverForm";
import DeliveryScreen from "../components/deliveryComponents/DeliveryScreen";
import SignaturePad from "../components/deliveryComponents/SignaturePad";
import DeliveryHistory from "../components/deliveryComponents/DeliveryHistory";

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

export default function DeliveryRoutes() {
  return (
    <>
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
        path="/update-form"
        element={
          token && role === "delivery" ? (
            <DeliveryDriverUpdateForm />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/delivery-form"
        element={
          token && role === "customer" ? (
            <DeliveryDriverForm />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/delivery-screen/:id"
        element={
          token && role === "delivery" ? (
            <DeliveryScreen />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/get-signature/:id"
        element={
          token && role === "delivery" ? <SignaturePad /> : <DeliveryScreen />
        }
      />
      <Route
        path="/delivery-history"
        element={
          token && role === "delivery" ? <DeliveryHistory /> : <DeliveryDash />
        }
      />
    </>
  );
}
