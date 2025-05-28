'use client'
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { insertData } from "../../../components/api/Axios/Helper";
import SidebarFilter from "@/components/elements/SidebarFilter";
import PropertyBlog from "@/components/sections/PropertyBlog";
import MapMarker from "@/components/elements/MapMarker";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

const toCapitalCase = (str) => {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

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

const swiperOptions = (agencyDetails) => ({
	modules: [Autoplay, Pagination, Navigation],
	autoplay: agencyDetails?.picture.length > 1
		? {
			delay: 2000,
			disableOnInteraction: false,
		}
		: false, // Disable autoplay for single image
	speed: 2000,
	navigation: agencyDetails?.picture.length > 1
		? { // Enable navigation buttons only for multiple images
			clickable: true,
			nextEl: ".nav-prev-location",
			prevEl: ".nav-next-location",
		}
		: false, // Hide navigation buttons for single image
	pagination: agencyDetails?.picture.length > 1
		? { // Enable pagination only for multiple images
			el: ".swiper-pagination1",
			clickable: true,
		}
		: false, // Hide pagination for single image
	slidesPerView: 1,
	loop: agencyDetails?.picture.length > 1, // Disable loop for single image
	spaceBetween: agencyDetails?.picture.length > 1 ? 20 : 0, // No spacing for single image
	centeredSlides: agencyDetails?.picture.length > 1, // Center slide for single image
	breakpoints: agencyDetails?.picture.length > 1
		? { // Enable breakpoints only for multiple images
			600: {
				slidesPerView: 2,
				spaceBetween: 20,
				centeredSlides: false,
			},
			991: {
				slidesPerView: 2,
				spaceBetween: 20,
				centeredSlides: false,
			},
			1520: {
				slidesPerView: 2,
				spaceBetween: 20,
				centeredSlides: false,
			},
		}
		: {}, // No breakpoints for single image
});

const swiperOptions2 = {
	modules: [Autoplay, Pagination, Navigation],
	autoplay: {
		delay: 2000,
		disableOnInteraction: false,
		reverseDirection: false,
	},
	speed: 3000,
	slidesPerView: 1,
	loop: true,
	spaceBetween: 30,
	centeredSlides: false,
	breakpoints: {
		600: {
			slidesPerView: 2,
			spaceBetween: 20,
			centeredSlides: false,
		},
		991: {
			slidesPerView: 3,
			spaceBetween: 20,
			centeredSlides: false,
		},

		1550: {
			slidesPerView: 3,
			spaceBetween: 30,
		},
	},
}

import PropertyMapMarker from "@/components/elements/PropertyMapMarker"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import React, { useEffect, useState } from 'react';
import Preloader from '@/components/elements/Preloader';
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import PropertyData from "@/components/sections/PropertyData";
import ContactPopup from "@/components/elements/ContactPopup";
export default function AgencyDetail({ params }) {
	const { id } = params;
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	// console.log(id, ">>>>>>>>>>>>>> SLUG");
	const searchParams = useSearchParams();
	const projectId = searchParams.get("id");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [agencyDetails, setAgencyDetails] = useState('');
	const [propertiesList, setPropertiesList] = useState([]);
	const [properties, setProperties] = useState([]);
	const [contactInfo, setContactInfo] = useState(false);
	const [iscontactUser, setIscontactUser] = useState(false);
	const [contactUserDetails, setContactUserDetails] = useState({});
	const fetchAgencyDetails = async () => {
		setLoading(true); // Start loading
		try {
			const requestData = {};

			const response = await insertData(`api/agencies/${id}`, requestData, false);

			if (response.status) {
				setAgencyDetails(response.data);
				setPropertiesList(response.data.property_details);
				setProperties(response.data.property_details);
				setError(null);
			} else {
				setError("No project details found.");
			}

		} catch (err) {
			setError(err.response?.data?.message || "An error occurred");
		} finally {
			setLoading(false); // Stop loading
		}
	};

	useEffect(() => {
		fetchAgencyDetails();
	}, []);



	const handelContactClick = () => {
		setContactUserDetails({
			user_name: agencyDetails?.user_name,
			email_address: agencyDetails?.user_email_adress,
			country_code: agencyDetails?.user_country_code,
			mobile_number: agencyDetails?.user_mobile_number,
			image: agencyDetails?.image && agencyDetails.image !== '' ? agencyDetails.image : '/images/avatar/user-image.png',
		})
		setIscontactUser(true)
	}

	return (
		<>
			{loading ?
				<Preloader />
				:
				<Layout headerStyle={1} footerStyle={1} breadcrumbTitle={agencyDetails}>
					<div>
						<section className="flat-section pt-10 flat-property-detail">
							<div className="container">

								<div className="row">
									<div className="col-lg-8">
										<div className="single-property-element single-property-desc">
											{agencyDetails.agency_name !== "" ? (
												<div className="content-top d-flex justify-content-between align-items-center">
													<div className="box-name">
														<a className="flag-tag primary" href="#">{agencyDetails?.agency_name}</a>
													</div>
												</div>
											) : ''}
											{agencyDetails.description !== "" ? (
												<>
													<div className="h7 title fw-7">{t("description")}</div>
													<p className="body-2 text-variant-1">{(lang === "fr") ? agencyDetails.description_fr : agencyDetails.description}</p>
												</>
											) : ''}
										</div>
										<div className="single-property-element single-property-map">
											<div className="h7 title fw-7">{t("map")}</div>
											<MapContainer
												center={[agencyDetails.latitude, agencyDetails.longitude]}
												zoom={12}
												maxZoom={18}
												scrollWheelZoom={false}
												className="property-map"
											>
												<UpdateMapView center={[agencyDetails.latitude, agencyDetails.longitude]} zoom={18} />
												<TileLayer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
												<Marker
													key={agencyDetails.id}
													position={[agencyDetails.latitude, agencyDetails.longitude]}
													icon={customMsrker}
												>
												</Marker>
											</MapContainer>
											<ul className="info-map">
												<li>
													<div className="fw-7">{t("address")}</div>
													{agencyDetails.address !== "" && (<span className="mt-4 text-variant-1">{agencyDetails.address}</span>)}<br />
													<span className="mt-4 text-variant-1 67886">
														{[agencyDetails?.city]
															.filter(Boolean)
															.join(', ')}
													</span>
												</li>
											</ul>
										</div>
										{((agencyDetails.facebook_link) || (agencyDetails.youtube_link) || (agencyDetails.twitter_link) || (agencyDetails.pinterest_link) || (agencyDetails.instagram_link)) && (
											<div className="single-property-element single-property-overview">
												<div className="h7 title fw-7">{t("socialinformation")}</div>
												<ul className="info-box">
													{agencyDetails.facebook_link ? (
														<li className="item">
															<Link target="_blank" href={agencyDetails.facebook_link} className="box-icon w-52"><i className="icon icon-facebook" /></Link>
															<div className="content">
																<span className="label"><Link target="_blank" href={agencyDetails.facebook_link} className="link">Facebook</Link></span>
															</div>
														</li>
													) : ''}
													{agencyDetails.youtube_link ? (
														<li className="item">
															<Link target="_blank" href={agencyDetails.youtube_link} className="box-icon w-52"><i className="icon icon-youtube" /></Link>
															<div className="content">
																<span className="label"><Link target="_blank" href={agencyDetails.youtube_link} className="link">Youtube</Link></span>
															</div>
														</li>
													) : ''}
													{agencyDetails.linkedin_link ? (
														<li className="item">
															<Link target="_blank" href={agencyDetails.linkedin_link} className="box-icon w-52"><i className="icon icon-linkedin" /></Link>
															<div className="content">
																<span className="label"><Link target="_blank" href={agencyDetails.linkedin_link} className="link">linkedin</Link></span>
															</div>
														</li>
													) : ''}
													{agencyDetails.instagram_link ? (
														<li className="item">
															<Link target="_blank" href={agencyDetails.instagram_link} className="box-icon w-52"><i className="icon icon-instagram" /></Link>
															<div className="content">
																<span className="label"><Link target="_blank" href={agencyDetails.instagram_link} className="link">Instagram</Link></span>
															</div>
														</li>
													) : ''}
												</ul>
											</div>
										)}
									</div>
									<div className="col-lg-4">
										<div className="widget-sidebar fixed-sidebar wrapper-sidebar-right">
											<div className="widget-box single-property-contact bg-surface">
												<div className="box-avatar">
													<div className="avatar avt-100 round">
														<img
															src={agencyDetails?.image && agencyDetails.image !== ''
																? agencyDetails.image
																: '/images/avatar/user-image.png'}
															alt="avatar"
														/>
													</div>
													{!iscontactUser && (<button className="form-wg tf-btn primary float-right" onClick={() => handelContactClick()} >{t('contactUser')}</button>)}
													{contactInfo ? (
														<></>
													) : ''}
												</div>
											</div>

											<div className="widget-box single-property-whychoose bg-surface">
												<div className="h7 title fw-7">{t("whychooseus")}</div>
												<ul className="box-whychoose">
													<li className="item-why">
														<i className="icon icon-secure" />
														{t("securebooking")}
													</li>
													<li className="item-why">
														<i className="icon icon-guarantee" />
														{t("bestpriceguarantee")}
													</li>
													<li className="item-why">
														<i className="icon icon-booking" />
														{t("easybookingprocess")}
													</li>
													<li className="item-why">
														<i className="icon icon-support" />
														{t("availablesupport24/7")}
													</li>
												</ul>
											</div>
										</div>
									</div >
								</div >
							</div >
						</section >
						<section className="pt-0 flat-latest-property">
							<div className="container">
								{propertiesList.length > 0 && ( // Render title only if properties.length > 0
									<div className="box-title">
										<div className="text-subtitle text-primary">{t("featureproperties")}</div>
										<h4 className="mt-4">{t("themostrecentestate")}</h4>
									</div>
								)}
								<div className="swiper tf-latest-property" data-preview-lg={3} data-preview-md={2} data-preview-sm={2} data-space={30} data-loop="true">
									<Swiper {...swiperOptions2} className="swiper-wrapper">
										{propertiesList.map((property) => (
											<SwiperSlide>
												<PropertyData data={property} slide={true} />

											</SwiperSlide>
										))}

									</Swiper>
								</div>
							</div>
						</section>
					</div>

				</Layout >
			}
			<ContactPopup contactModelPopup={iscontactUser} contactDetail={contactUserDetails} onClose={() => setIscontactUser(false)} />
		</>
	)
}