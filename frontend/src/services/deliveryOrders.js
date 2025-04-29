import axios from "axios";
import { getDeliveryPersonById } from "./deliveryAPI";

// add a new delivery order
export const acceptDelivery = async (order) => {
  try {
    const driver = await getDeliveryPersonById();
    const driverId = driver.deliveryPerson._id;
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `http://localhost:5002/api/delivery-orders/accept`,
      {
        orderId: order._id,
        driverId: driverId,
        status: "DeliveryAccepted",
        pickupLocation: {
          latitude: order.restaurant.address.latitude,
          longitude: order.restaurant.address.longitude,
        },
        dropoffLocation: {
          latitude: order.location.latitude,
          longitude: order.location.longitude,
        },
        pickupAddress: {
          name: order.restaurant.name,
          street: order.restaurant.address.street,
          city: order.restaurant.address.city,
        },
        dropofAddress: {
          no: order.address.no,
          street: order.address.street,
        },
        estimatedTime: order.etaMin,
        deliveryCharge: order.deliveryCharge,
        paymentMethod: order.paymentMethod,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await axios.put(
      `http://localhost:5003/api/order/${order._id}/status`,

      { status: "DeliveryAccepted" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error accepting delivery:", error);
    throw error.response?.data?.message || "Something went wrong";
  }
};

// get all current available deliveries
export const allCurrentDeliveries = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = axios.get(`http://localhost:5002/api/delivery-orders/current`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return (await res).data;
  } catch (err) {
    console.error("Error getting deliveries", err);
    throw err.response?.data?.message || "somthing went wrong";
  }
};

// update delivery status (pickup)
export const updateStatusPickup = async (deliveryId, orderId, status) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.put(
      // <-- added await here
      `http://localhost:5002/api/delivery-orders/pickup/${deliveryId}`,
      { status: status }, // <-- empty body (no data to send)
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await axios.put(
      `http://localhost:5003/api/order/${orderId}/status`,

      { status: status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data; // (optional) return the response if you need
  } catch (err) {
    console.error("Error updating status", err);
    throw err.response?.data?.message || "Something went wrong";
  }
};

//get delivery by Id
export const getDeliveryById = async (deliveryId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:5002/api/delivery-orders/${deliveryId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching delivery by ID:", error);
    throw error.response?.data?.message || "Something went wrong";
  }
};

export const completeDelivery = async (
  deliveryId,
  customerSignature,
  orderId
) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      `http://localhost:5002/api/delivery-orders/complete/${deliveryId}`,
      {
        customerSignature,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    await axios.put(
      `http://localhost:5003/api/order/${orderId}/status`,

      { status: "Delivered" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(res.data.message);
    return res.data;
  } catch (error) {
    console.error("Failed to complete delivery:", error.response.data);
  }
};

export const getAllDeliveries = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:5002/api/delivery-orders/history`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Fetched deliveries:", res.data.data);
    return res.data.data;
  } catch (error) {
    console.error(
      "Failed to fetch deliveries:",
      error?.response?.data || error.message
    );
    return null;
  }
};
