'use client';

import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo } from "react";

export default function MapClusterProject({ topmap, propertys, slug }) {
  const customMarker = useMemo(() => L.icon({
    iconUrl: "/images/location/map-lo.png",
    iconSize: [30, 30],
  }), []);

  // ✅ Move CenterMarker INSIDE MapClusterProject
  function CenterMarker({ property }) {
    const map = useMap(); // ✅ Now it's safe!

    const handleMarkerClick = () => {
      map.flyTo([property.latitude, property.longitude], map.getZoom(), {
        animate: true,
        duration: 1.5
      });
    };

    return (
      <Marker
        position={[property.latitude, property.longitude]}
        icon={customMarker}
        eventHandlers={{
          click: handleMarkerClick,
        }}
      >
        <Popup>
          <div className="map-box">
            <div className="map-listing-item">
              <div className="inner-box">

                {/* Image */}
                <div className="image-box">
                  <img
                    src={property.picture[0]}
                    alt={property.title}
                    style={{ width: "100px", height: "70px", borderRadius: "5px" }}
                    draggable="false"
                  />
                </div>

                {/* Content */}
                <div className="content">
                  <p className="location">
                    <span className="icon icon-mapPin" />
                    {[property?.city, property?.state, property?.district]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  <div className="title">
                    <a href={`${slug}/${property.slug}`}>
                      {property.title}
                    </a>
                  </div>
                  <ul className="list-info">
                    <li><span className="icon icon-bed" /> {property.bedRooms || '-'}</li>
                    <li><span className="icon icon-bathtub" /> {property.bathRooms || '-'}</li>
                    <li><span className="icon icon-ruler" /> {property.size || '-'}</li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </Popup>
      </Marker>
    );
  }

  return (
    <MapContainer
      style={{ height: topmap ? "460px" : "100%", width: "100%", zIndex: 0 }}
      center={[32.1854916, -7.3880943]}
      zoom={6}
      maxZoom={18}
      scrollWheelZoom={true}
      dragging={true}
      doubleClickZoom={true}
    >
      <TileLayer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
      
      {propertys.map((property, index) => (
        <CenterMarker key={index} property={property} />
      ))}
    </MapContainer>
  );
}
