'use client'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { useEffect } from 'react';

const customMarker = L.icon({
  iconUrl: "/images/location/map-lo.png",
  iconSize: [30, 30],
});

function FixPopupBug() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

export default function MapClusterProject({ topmap, propertys = [], slug }) {
  if (typeof window === 'undefined') return null;
  const position= {
		  latitude: 33.5945144,
		  longitude: -7.6200284,
		  zoom: 6
	  };
  return (
    <MapContainer
	style={{ height: topmap ? "460px" : "100%", zIndex: 0 }}
	center={[32.1854916, -7.3880943]}
	zoom={6}
	scrollWheelZoom={true}
	dragging={true}          // ✅ Enable dragging
	doubleClickZoom={true}   // Optional: allow double click to zoom
	zoomControl={true}       // Show zoom controls
	attributionControl={false}
    >
      <FixPopupBug />
      <TileLayer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
      {propertys.map((property, index) =>
        property.latitude && property.longitude ? (
			<Marker
			position={[position.longitude, position.longitude]}
			icon={customMarker}
		  >
			<Popup open={true}> // This forces it to open
			  Hello from popup
			</Popup>
		  </Marker>
        ) : null
      )}
    </MapContainer>
  );
}
