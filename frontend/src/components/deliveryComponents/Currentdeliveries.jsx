import React, { useEffect } from "react";
import { allCurrentDeliveries } from "../../services/deliveryOrders";

const Currentdeliveries = () => {
  useEffect(() => {
    const runningDeliveries = async () => {
      const res = await allCurrentDeliveries();
      console.log("running deliveries are: ", res);
    };
    runningDeliveries();
  }, []);
  return (
    <div>
      <div>you dont have deliveries dummy.....</div>
    </div>
  );
};

export default Currentdeliveries;
