import React, { useEffect, useState } from "react";
import { getAcceptedOrderById } from "../../services/deliveryAPI";
import { useParams } from "react-router-dom";

const DeliveryScreen = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const res = await getAcceptedOrderById(id);
        console.log(res);
        setOrderDetails(res);
      } catch (err) {
        console.log(err);
      }
    };
    getOrderDetails();
  }, [id]);
  if (!orderDetails) {
    return <div>Loading...</div>; // 👈 simple loading while fetching
  }

  return (
    <div>
      <div>hi im delivery screen</div>
      <div>{orderDetails._id}</div>
    </div>
  );
};

export default DeliveryScreen;
