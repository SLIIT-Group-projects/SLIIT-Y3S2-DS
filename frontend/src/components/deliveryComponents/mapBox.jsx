import React, { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// 👇 Helper to update the map center when props change
const ChangeMapView = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center && center.length === 2) {
      map.setView(center);
      setTimeout(() => {
        map.invalidateSize(); // 👈 Force Leaflet to re-render correctly
      }, 200); // slight delay to let the DOM layout settle
    }
  }, [center, map]);

  return null;
};

const MapBox = ({ lat, lng }) => {
  const colombo = [6.9271, 79.8612];
  const center =
    lat && lng && !isNaN(lat) && !isNaN(lng) ? [lat, lng] : colombo;

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="w-full h-full"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {lat ? (
        <Marker position={center}>
          <Popup>You are here!</Popup>
        </Marker>
      ) : null}

      <ChangeMapView center={center} />
    </MapContainer>
  );
};

export default MapBox;
