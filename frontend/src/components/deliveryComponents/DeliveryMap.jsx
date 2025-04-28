import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import L from "leaflet";

const DeliveryMap = ({ location }) => {
  const pickupLocation = [
    location.pickupLocation.latitude,
    location.dropoffLocation.longitude,
  ];
  const dropoffLocation = [
    location.dropoffLocation.latitude,
    location.dropoffLocation.longitude,
  ];
  const [driverPosition, setDriverPosition] = useState(null);
  const [route, setRoute] = useState([]);
  const map = useMap();

  useEffect(() => {
    // Get the driver's current position
    const getDriverLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setDriverPosition({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting driver location: ", error);
          }
        );
      }
    };

    // Call the function once when the component mounts
    getDriverLocation();

    // Optionally, update the position every 5 seconds (or based on your need)
    const interval = setInterval(getDriverLocation, 5000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Create and add the route when location changes
    if (location) {
      const routeControl = L.Routing.control({
        waypoints: [
          L.latLng(
            location.pickupLocation.latitude,
            location.dropoffLocation.longitude
          ), // Pickup location
          L.latLng(
            location.dropoffLocation.latitude,
            location.dropoffLocation.longitude
          ), // Drop-off location
        ],
        routeWhileDragging: true,
        show: false,
        collapsible: true,
      })
        .on("routesfound", (e) => {
          setRoute(e.routes[0].coordinates);
        })
        .addTo(map);

      return () => {
        if (routeControl && map?.hasLayer(routeControl)) {
          map.removeControl(routeControl);
        }
      };
    }
  }, [location, map]);

  return (
    <MapContainer
      center={pickupLocation}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={pickupLocation}>
        <Popup>
          {location.pickupAddress.name} <br /> {location.dropofAddress.street}
        </Popup>
      </Marker>

      <Marker position={dropoffLocation}>
        <Popup>
          {location.pickupAddress.name} <br /> {location.dropofAddress.street}
        </Popup>
      </Marker>

      {driverPosition && (
        <Marker position={driverPosition}>
          <Popup>Driver's Current Location</Popup>
        </Marker>
      )}

      {route.length > 0 && <Polyline positions={route} color="blue" />}
    </MapContainer>
  );
};

export default DeliveryMap;
