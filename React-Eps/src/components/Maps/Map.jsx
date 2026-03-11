import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const center = {
  lat: 4.430049410702488,
  lng: -75.20767660402213,
};

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
];

export default function MapView({ width, height }) {
  const [map, setMap] = useState(null);

  const onMapLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  useEffect(() => {
    const updateMapStyle = () => {
      const isDark = document.documentElement.classList.contains('dark');
      if (map) {
        map.setOptions({ styles: isDark ? darkMapStyle : [] });
      }
    };

    // Apply initially if map is available
    updateMapStyle();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach(m => m.attributeName === 'class' && updateMapStyle());
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, [map]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyAjjN9E7g3PLFxl0QNwd2kaxXBJHOuyMFQ">
      <GoogleMap 
        mapContainerStyle={{ width: width, height: height }} 
        center={center} 
        zoom={15}
        options={{ styles: document.documentElement.classList.contains('dark') ? darkMapStyle : [] }}
        onLoad={onMapLoad}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}