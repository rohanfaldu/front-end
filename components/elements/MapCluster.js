import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
// import "react-leaflet-markercluster/dist/styles.min.css";

const customMsrker = L.icon({
	iconUrl: "/images/location/map-lo.png",
	iconSize: [30, 30]
});

export default function MapCluster({ topmap, propertys }) {
	console.log('>>>>>>propertydxesds', propertys);

	return (
		<>
			<MapContainer
				style={{ height: `${topmap ? "460px" : "100vh"}`, zIndex: -1 }}
				center={[51.0, 19.0]}
				zoom={4}
				maxZoom={18}
				scrollWheelZoom={false}
			>
				<TileLayer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />

				{/* <MarkerClusterGroup> */}
				{/* <Marker position={[49.8397, 24.0297]} icon={customMsrker}>
                    <Popup>
                        <div className="map-box">
							<div className="map-listing-item">
								<div className="inner-box">
									
									<div className="image-box"><img src="/images/home/house-7.jpg" alt /></div>
									<div className="content">
										<p className="location"><span className="icon icon-mapPin" />100 km from my location</p>
										<div className="title"><a href="property-details-v1.html">Villa del Mar Retreat, Malibu...</a></div>
										<ul className="list-info">
											<li><span className="icon icon-bed" />3</li>
											<li><span className="icon icon-bathtub" />2</li>
											<li><span className="icon icon-ruler" />600 SqFT</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
                    </Popup>
                </Marker> */}
				{propertys.map((property, index) => (
					<Marker
						key={index}
						position={[property.latitude, property.longitude]}
						icon={customMsrker}
					>
						<Popup>
							<div className="map-box">
								<div className="map-listing-item">
									<div className="inner-box">
										{/* Image */}
										<div className="image-box">
											<img
												src={property.picture[0]} // Display first image
												alt={property.title}
												style={{ width: "100px", height: "70px", borderRadius: "5px" }}
											/>
										</div>

										{/* Content */}
										<div className="content">
											<p className="location">
												<span className="icon icon-mapPin" />
												{property.address}
											</p>
											<div className="title">
												<a href={`property-details-v1.html?id=${property.id}`} >{/* Link to property details */}
													{property.title}
												</a>
											</div>
											<ul className="list-info">
												<li><span className="icon icon-bed" /> {property.bedRooms || '-'}</li>
												<li><span className="icon icon-bathtub" /> {property.bathRooms || '-'}</li>
												<li><span className="icon icon-ruler" /> {property.size || '-'} </li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</Popup>
					</Marker>
				))}
				{/* </MarkerClusterGroup> */}
			</MapContainer>
		</>
	)
}