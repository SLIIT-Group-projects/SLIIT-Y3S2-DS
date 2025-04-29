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
import "leaflet-routing-machine";

const driverIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -30],
});

const DeliveryMap = ({ location }) => {
  const pickupLocation = [
    location.pickupLocation.latitude,
    location.pickupLocation.longitude,
  ];
  const dropoffLocation = [
    location.dropoffLocation.latitude,
    location.dropoffLocation.longitude,
  ];
  const [driverPosition, setDriverPosition] = useState(null);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  // Custom Hook to access and modify the map
  const ScrollZoomOff = () => {
    const map = useMap();
    useEffect(() => {
      map.scrollWheelZoom.disable();
    }, [map]);
    return null;
  };

  const map = useMap();

  useEffect(() => {
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

    getDriverLocation();
    const interval = setInterval(getDriverLocation, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (location) {
      const routeControl = L.Routing.control({
        waypoints: [
          L.latLng(
            location.pickupLocation.latitude,
            location.pickupLocation.longitude
          ),
          L.latLng(
            location.dropoffLocation.latitude,
            location.dropoffLocation.longitude
          ),
        ],
        routeWhileDragging: true,
        show: false,
        collapsible: true,
        addWaypoints: false,
      })
        .on("routesfound", (e) => {
          const route = e.routes[0];
          setRoute(route.coordinates);
          setDistance(route.summary.totalDistance);
          setDuration(route.summary.totalTime);
        })
        .addTo(map);

      return () => {
        if (routeControl && map?.hasLayer(routeControl)) {
          map.removeControl(routeControl);
        }
      };
    }
  }, [location, map]);

  const formatDistance = (meters) => {
    return meters >= 1000
      ? (meters / 1000).toFixed(2) + " km"
      : meters + " meters";
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins % 60}min`;
    }
    return `${mins} min`;
  };

  return (
    <>
      <ScrollZoomOff />

      <div className="absolute bottom-2 left-2 bg-gray-700 text-white p-2 rounded-md shadow-md z-[1000] text-lg">
        {distance && duration && (
          <div>
            Distance: {formatDistance(distance)} | ETA:{" "}
            {formatDuration(duration)}
          </div>
        )}
      </div>

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <Marker position={pickupLocation}>
        <Popup>
          {location.pickupAddress.name} <br /> {location.pickupAddress.street}
        </Popup>
      </Marker>
      <Marker position={dropoffLocation}>
        <Popup>
          {location.dropofAddress.no} <br /> {location.dropofAddress.street}
        </Popup>
      </Marker>
      {driverPosition && (
        <Marker position={driverPosition} icon={driverIcon}>
          <Popup>Driver's Current Location</Popup>
        </Marker>
      )}
      {route.length > 0 && <Polyline positions={route} color="blue" />}
    </>
  );
};

export default DeliveryMap;
