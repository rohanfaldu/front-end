import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
// import "react-leaflet-markercluster/dist/styles.min.css";
import { useEffect } from "react";
const customMsrker = L.icon({
	iconUrl: "/images/location/map-lo.png",
	iconSize: [30, 30]
});


function UpdateMapView({ center, zoom }) {
	const map = useMap();
	useEffect(() => {
		map.setView(center, zoom);
	}, [center, zoom, map]);

	return null;
}

export default function MapCluster({ topmap, propertys, slug, lat, lng }) {
	// console.log('>>>>>>propertydxesds', propertys);
	// console.log(lat,lng,"444444444444444444")

	return (
		<MapContainer
			style={{ height: topmap ? "460px" : "100vh", zIndex: -1 }}
			center={[lat, lng]} // Center dynamically
			zoom={12} // Set zoom level to 14
			maxZoom={18}
			scrollWheelZoom={false}
		>
			<UpdateMapView center={[lat, lng]} zoom={16} />

			<TileLayer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />

			<Marker
    key={propertys.id} // Assuming each property has a unique ID
    position={[propertys.latitude, propertys.longitude]}
    icon={customMsrker}
>
    <Popup>
        <div className="map-box">
            <div className="map-listing-item">
                <div className="inner-box">
                    <div className="image-box">
                        <img
                            src={propertys.picture?.[0]} // Display first image
                            alt={propertys.title}
                            style={{ width: "100px", height: "70px", borderRadius: "5px" }}
                        />
                    </div>

                    <div className="content">
                        <p className="location">
                            <span className="icon icon-mapPin" />
                            {[propertys?.city, propertys?.state, propertys?.district]
                                .filter(Boolean)
                                .join(', ')}
                        </p>
                        <div className="title">
                            <a href={`${slug}/${propertys.slug}`}>{propertys.title}</a>
                        </div>
                        <ul className="list-info">
                            <li><span className="icon icon-bed" /> {propertys.bedRooms || '-'}</li>
                            <li><span className="icon icon-bathtub" /> {propertys.bathRooms || '-'}</li>
                            <li><span className="icon icon-ruler" /> {propertys.size || '-'}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </Popup>
</Marker>

		</MapContainer>
	);
}