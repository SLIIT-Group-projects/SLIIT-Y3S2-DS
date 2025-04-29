import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { io } from "socket.io-client";
import L from "leaflet";

const driverIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [128, 128],
});

const CustomerTrackingScreen = () => {
  const { deliveryId } = useParams();
  const [driverLocation, setDriverLocation] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:5002");

    socket.emit("joinDeliveryRoom", deliveryId);

    socket.on("driverLocationUpdate", (data) => {
      setDriverLocation({ lat: data.latitude, lng: data.longitude });
      console.log(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [deliveryId]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={driverLocation || [7.8731, 80.7718]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {driverLocation && (
          <Marker position={driverLocation} icon={driverIcon} />
        )}
      </MapContainer>
    </div>
  );
};

export default CustomerTrackingScreen;
