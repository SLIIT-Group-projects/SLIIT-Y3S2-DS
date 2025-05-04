import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { io } from "socket.io-client";
import L from "leaflet";
import "leaflet-routing-machine";
import { getDeliveryById } from "../../services/deliveryOrders";

// Custom icons
const driverIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [64, 64],
});

const dropoffIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [64, 64],
});

// Routing control component
const RoutingControl = ({ from, to, onRouteCalculated }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!from || !to || !map) return;

    // SAFELY REMOVE OLD CONTROL IF IT EXISTS
    if (
      routingControlRef.current &&
      map.hasLayer(routingControlRef.current._container)
    ) {
      try {
        map.removeControl(routingControlRef.current);
      } catch (error) {
        console.warn("Error removing routing control:", error);
      }
    }

    const control = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      routeWhileDragging: false,
      addWaypoints: false,
      show: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: "#0074D9", weight: 6 }],
      },
      createMarker: () => null,
    })
      .on("routesfound", function (e) {
        const route = e.routes[0];
        const distanceInKm = (route.summary.totalDistance / 1000).toFixed(2);
        const durationInMin = (route.summary.totalTime / 60).toFixed(0);
        onRouteCalculated({ distanceInKm, durationInMin });
      })
      .addTo(map);

    routingControlRef.current = control;

    return () => {
      if (routingControlRef.current) {
        try {
          map.removeControl(routingControlRef.current);
        } catch (error) {
          console.warn("Cleanup error:", error);
        }
      }
    };
  }, [from, to, map, onRouteCalculated]);

  return null;
};

const CustomerTrackingScreen = () => {
  const { deliveryId } = useParams();
  const [driverLocation, setDriverLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [routeInfo, setRouteInfo] = useState({
    distanceInKm: null,
    durationInMin: null,
  });

  // Get dropoff location
  useEffect(() => {
    const fetchDropoffLocation = async () => {
      try {
        const delivery = await getDeliveryById(deliveryId);
        setDropoffLocation({
          lat: delivery.dropoffLocation.latitude,
          lng: delivery.dropoffLocation.longitude,
        });
      } catch (err) {
        console.error("Failed to fetch dropoff location", err);
      }
    };

    fetchDropoffLocation();
  }, [deliveryId]);

  // Listen for driver updates
  useEffect(() => {
    const socket = io("http://localhost:5002");
    socket.emit("joinDeliveryRoom", deliveryId);

    socket.on("driverLocationUpdate", (data) => {
      setDriverLocation({ lat: data.latitude, lng: data.longitude });
    });

    return () => socket.disconnect();
  }, [deliveryId]);

  const center = driverLocation || dropoffLocation || [7.8731, 80.7718];

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      {/* Distance & ETA Overlay */}
      {routeInfo.distanceInKm && routeInfo.durationInMin && (
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            background: "rgba(255, 255, 255, 0.9)",
            padding: "10px 15px",
            borderRadius: "8px",
            zIndex: 1000,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          <p>
            <strong>Distance:</strong> {routeInfo.distanceInKm} km
          </p>
          <p>
            <strong>ETA:</strong> {routeInfo.durationInMin} mins
          </p>
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {driverLocation && (
          <Marker position={driverLocation} icon={driverIcon} />
        )}
        {dropoffLocation && (
          <Marker position={dropoffLocation} icon={dropoffIcon} />
        )}

        {driverLocation && dropoffLocation && (
          <RoutingControl
            from={driverLocation}
            to={dropoffLocation}
            onRouteCalculated={setRouteInfo}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default CustomerTrackingScreen;