import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

const PreviewMap = ({ from, to }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const control = L.Routing.control({
      waypoints: [L.latLng(...from), L.latLng(...to)],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,
      collapsible: true,
      lineOptions: {
        styles: [{ color: "#f65906", weight: 4, opacity: 0.8 }],
      },
    }).addTo(map);

    return () => {
      if (control && map?.hasLayer(control)) {
        map.removeControl(control);
      }
    };
  }, [map, from, to]);

  return null;
};

export default PreviewMap;
