'use client'
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { getData } from "../../../components/api/Helper";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { formatPropertyPrice } from "@/components/common/Functions";

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

const swiperOptions = (projectDetails) => ({
	modules: [Autoplay, Pagination, Navigation],
	autoplay: projectDetails?.picture?.length > 1
		? {
			delay: 2000,
			disableOnInteraction: false,
		}
		: false, // Disable autoplay for single image
	speed: 2000,
	navigation: projectDetails?.picture?.length > 1
		? { // Enable navigation buttons only for multiple images
			clickable: true,
			nextEl: ".nav-prev-location",
			prevEl: ".nav-next-location",
		}
		: false, // Hide navigation buttons for single image
	pagination: projectDetails?.picture?.length > 1
		? { // Enable pagination only for multiple images
			el: ".swiper-pagination1",
			clickable: true,
		}
		: false, // Hide pagination for single image
	slidesPerView: 1,
	loop: projectDetails?.picture?.length > 1, // Disable loop for single image
	spaceBetween: projectDetails?.picture?.length > 1 ? 20 : 0, // No spacing for single image
	centeredSlides: projectDetails?.picture?.length > 1, // Center slide for single image
	breakpoints: projectDetails?.picture.length > 1
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


const swiperOptions3 = (projectDetails) => ({
	spaceBetween: 10,
	slidesPerView: 1,
	loop: projectDetails?.picture?.length > 1,
	modules: [Autoplay, Pagination, Navigation],
	autoplay: projectDetails?.picture?.length > 1
		? {
			delay: 2000,
			disableOnInteraction: false,
		}
		: false,
	speed: 2000,
	navigation: projectDetails?.picture?.length > 1
		? { // Enable navigation buttons only for multiple images
			clickable: true,
			nextEl: ".nav-prev-location",
			prevEl: ".nav-next-location",
		}
		: false, // Hide navigation buttons for single image
	pagination: projectDetails?.picture?.length > 1
		? { // Enable pagination only for multiple images
			el: ".swiper-pagination1",
			clickable: true,
		}
		: false, // Hide pagination for single image
});
import PropertyMap from "@/components/elements/PropertyMap"
import MapMarker from "@/components/elements/MapMarker"
import RangeSlider from "@/components/elements/RangeSlider"
import SidebarFilter from "@/components/elements/SidebarFilter"
import TabNav from "@/components/elements/TabNav"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import Video from "@/components/elements/Video"
import axios from 'axios';
import { useParams } from "react-router-dom"
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Preloader from '@/components/elements/Preloader';
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import ContactPopup from "@/components/elements/ContactPopup";

export default function ProjectDetailsView({ params }) {
	const { slug } = params;
	const searchParams = useSearchParams();
	const projectId = searchParams.get("id");
	const [isAccordion, setIsAccordion] = useState(1)
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [projectDetails, setProjectDetails] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [videoUrl, setVideoUrl] = useState("");
	const [properties, setProperties] = useState([]);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const modalSwiperRef = useRef(null);
	const [isModelOpen, setIsModelOpen] = useState(false);
	const [contactInfo, setContactInfo] = useState(false);
	const [currentImage, setCurrentImage] = useState(null);
	const [iscontactUser, setIscontactUser] = useState(false);
	const [contactUserDetails, setContactUserDetails] = useState({});
	const [isLogin, setLogin] = useState(false)
	const [showLoginModal, setShowLoginModal] = useState(false)


	const handleLogin = () => {
		setLogin(!isLogin)
		!isLogin ? document.body.classList.add("modal-open") : document.body.classList.remove("modal-open")
	}

	const fetchProjectsDetails = async () => {
		setLoading(true); // Start loading
		try {
			const requestData = {
				project_slug: slug
			};

			const response = await getData("api/projects/getbyid", requestData, true);

			if (response.status) {
				setProjectDetails(response.data);
				setProperties(response.data.property_details);
				setError(null);
			} else {
				setError("No project details found.");
			}
		} catch (err) {
			// Handle API errors
			setError(err.response?.data?.message || "An error occurred");
		} finally {
			setLoading(false); // Stop loading
		}
	};
	const router = useRouter();
	useEffect(() => {
		fetchProjectsDetails();
	}, []);

	const { t, i18n } = useTranslation();

	if (loading) {
		return (
			<>
				<Preloader />
			</>
		)
	} else {
		// console.log(projectDetails);
	}
	const handleAccordion = (key) => {
		setIsAccordion(prevState => prevState === key ? null : key)
	}

	if ((projectDetails.video !== null) && (!projectDetails.video.endsWith(".mp4")) && (videoUrl === "")) {
		const urlParams = new URLSearchParams(new URL(projectDetails.video).search);
		const videoId = urlParams.get('v');
		setVideoUrl('https://www.youtube.com/embed/' + videoId);
	}

	const openPopup = (image) => {
		setCurrentImage(image);
		setCurrentImageIndex(image);
		setIsOpen(true);
	};

	const closePopup = () => {
		setIsOpen(false);
		setCurrentImage(null);
	};

	const handleComment = async () => {
		const token = localStorage.getItem('token');

		if (!token) {
			setIsModelOpen(true);
			return;
		}


	};

	const closeModal = () => {
		setIsModelOpen(false);
	};
	const handelContactClick = () => {
		setContactUserDetails({
			user_name: projectDetails?.user_name,
			email_address: projectDetails?.user_email_address,
			country_code: projectDetails?.user_country_code,
			mobile_number: projectDetails?.user_mobile_number,
			image: projectDetails?.user_image && projectDetails.user_image !== '' ? projectDetails.user_image : '/images/avatar/user-image.png',
		})
		setIscontactUser(true)
	}
	return (
		<>

			<Layout headerStyle={isOpen ? 0 : 1} footerStyle={1}>
				<div className={isOpen ? "custom-overlay" : ""}>
					<section className="flat-location flat-slider-detail-v1">
						<div className="swiper tf-sw-location">
							<div className="link back-btn">
								<button
									className="form-wg tf-btn primary"
									type="button"
									style={{ marginTop: "10px" }}
									onClick={() => router.back()}
								>
									<span style={{ color: "#fff" }}>&lt; {t('back')}</span>
								</button>
							</div>
							<Swiper {...swiperOptions(projectDetails)} className="swiper-wrapper">
								{(projectDetails?.picture.length > 0 ? projectDetails.picture : ["/images/banner/no-banner.png"]).map((item, index) => (
									<SwiperSlide key={index}>
										<div
											onClick={() => openPopup(index)} // Pass the clicked image index
											className={`box-imgage-detail d-block property-image ${projectDetails?.picture.length === 1 ? "full-screen" : ""}`}
										>
											<img src={item} alt="img-property" />
										</div>
									</SwiperSlide>
								))}
							</Swiper>
							{isOpen && (
								<div className="modal-overlay-custom" onClick={closePopup}>
									<div
										className="modal-content-custom"
										onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
									>
										{projectDetails?.picture.length > 1 && (
											<>
												<button
													className="nav-arrow prev-arrow"
													onClick={() => modalSwiperRef.current?.slidePrev()}
												>
													&#8249;
												</button>
												<button
													className="nav-arrow next-arrow"
													onClick={() => modalSwiperRef.current?.slideNext()}
												>
													&#8250;
												</button>
											</>
										)}
										<Swiper
											{...swiperOptions3(properties)}
											initialSlide={currentImageIndex}
											className="swiper-wrapper"
											onSwiper={(swiper) => (modalSwiperRef.current = swiper)} // Reference the modal swiper
										>
											{projectDetails.picture.map((item, index) => (
												<SwiperSlide key={index}>
													<div className="box-imgage-detail">
														<img src={item} alt={`property-large-${index}`} />
													</div>
												</SwiperSlide>
											))}
										</Swiper>
									</div>
								</div>
							)}
							{projectDetails?.picture.length > 2 && (
								<div className="box-navigation">
									<div className="navigation swiper-nav-next nav-next-location">
										<span className="icon icon-arr-l" />
									</div>
									<div className="navigation swiper-nav-prev nav-prev-location">
										<span className="icon icon-arr-r" />
									</div>
								</div>
							)}						
						</div>
					</section>
					<section className="flat-section pt-0 flat-property-detail">
						<div className="container">
							<div className="header-property-detail">
								<div className="content-top d-flex justify-content-between align-items-center">
									<h4 className="title link">
										{i18n.language === 'en'
											? projectDetails?.title_en // Show English title if lang = 'en'
											: projectDetails?.title_fr // Show French title if lang = 'fr'
										}
									</h4>
									<div className="box-price d-flex align-items-center">
										<h4>{t('from')} {formatPropertyPrice(projectDetails.price || '0')} {projectDetails.currency || 'USD'} </h4>
									</div>
								</div>
								<div className="content-bottom">								
								</div>
							</div>
							<div className="row">
								<div className="col-lg-8">
									<div className="single-property-element single-property-desc">
										<div className="h7 title fw-7">Description</div>
										{i18n.language === 'en'
											? projectDetails?.description_en // Show English title if lang = 'en'
											: projectDetails?.description_fr // Show French title if lang = 'fr'
										}
									</div>									
									{projectDetails.video !== null ? (
										<div className="single-property-element single-property-video">
											<div className="h7 title fw-7">{t("video")}</div>
											<div className="img-video">												
												{projectDetails?.video ? (
													projectDetails.video.endsWith(".mp4") ? (
														<video height="500" width="100%" controls>
															<source src={projectDetails.video} type="video/mp4" />
															Your browser does not support the video tag.
														</video>
													) : (
														<iframe
															height="500"
															width="100%"
															src={
																projectDetails.video.includes("watch?v=")
																	? projectDetails.video.replace("watch?v=", "embed/")
																	: projectDetails.video
															}
															title="Immofind"
															frameBorder="0"
															allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
															referrerPolicy="strict-origin-when-cross-origin"
															allowFullScreen
														/>
													)
												) : (
													<p>No video available</p>
												)}
											</div>
										</div>
									) : (<></>)}

									{projectDetails?.meta_details?.length > 0 && (
										(() => {
											// Filter only boolean type with value "1"
											const booleanFeatures = projectDetails.meta_details.filter(
												(projectDetail) => projectDetail.type === "boolean"
											);

											// Render only if booleanFeatures length > 0
											return booleanFeatures.length > 0 ? (
												<div className="single-property-element single-property-feature">
													<div className="h7 title fw-7">{t("amenitiesandfeatures")}</div>
													<div className="wrap-feature">
														<div className="box-feature">
															<ul>
																{booleanFeatures.map((projectDetail) => (
																	<li key={projectDetail.id} className="feature-item">
																		{projectDetail.icon ? (
																			<img src={projectDetail.icon} alt="icon" width={20} />
																		) : (
																			<span className="icon icon-list-dashes" />
																		)}
																		{projectDetail.name}
																	</li>
																))}
															</ul>
														</div>
													</div>
												</div>
											) : null; // Return null if no boolean features exist
										})()
									)}
									{projectDetails?.vr_link && ( // Render only if vr_link is available
										<div className="single-property-element single-property-feature">
											<div className="h7 title fw-7">{t("otherInformation")}</div>
											<div className="wrap-feature">
												<div className="box-feature">												
													<button
														className="form-wg tf-btn primary"
														name="button"
														type="button"
														onClick={() => window.open(projectDetails.vr_link, "_blank", "noopener,noreferrer")}
													>
														<span>{t("vrLink")}</span>
													</button>

												</div>
											</div>
										</div>
									)}
									<div className="single-property-element single-property-map">
										<div className="h7 title fw-7">{t("map")}</div>

										<MapContainer
											center={[projectDetails.latitude, projectDetails.longitude]}
											zoom={12}
											maxZoom={18}
											scrollWheelZoom={false}
											className="property-map"
										>
											<UpdateMapView center={[projectDetails.latitude, projectDetails.longitude]} zoom={18} />

											<TileLayer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
											<Marker
												key={projectDetails.id}
												position={[projectDetails.latitude, projectDetails.longitude]}
												icon={customMsrker}
											>
											</Marker>
										</MapContainer>


										<ul className="info-map">
											<li>
												<div className="fw-7">{t("address")}</div>
												<span className="mt-4 text-variant-1">{projectDetails?.address}</span><br />
												<span className="mt-4 text-variant-1 67886">
													{[projectDetails?.neighborhood, projectDetails?.district, projectDetails?.city, projectDetails?.state]
														.filter(Boolean)
														.join(', ')}
												</span>


											</li>
										</ul>
									</div>
									
									<div className="single-property-element single-wrapper-review">
										<div className="box-title-review d-flex justify-content-between align-items-center flex-wrap gap-20">
											<div className="h7 fw-7">{t("guestreviews")}</div>
											<Link href="#" className="tf-btn">{t("viewallreviews")}</Link>
										</div>
										<hr></hr>								

										<div className="wrap-form-comment">
											<div className="h7">{t("leaveareply")}</div>
											<div id="comments" className="comments">
												<div className="respond-comment">
													<form method="post" id="contactform" className="comment-form form-submit" acceptCharset="utf-8" noValidate="novalidate">
														<div className="form-wg group-ip">
															<fieldset>
																<label className="sub-ip">{t("name")}</label>
																<input type="text" className="form-control" name="text" placeholder={t("yourname")} required />
															</fieldset>
															<fieldset>
																<label className="sub-ip">{t("email")}</label>
																<input type="email" className="form-control" name="email" placeholder={t("youremail")} required />
															</fieldset>
														</div>														
														<fieldset className="form-wg">
															<label className="sub-ip">{t("review")}</label>
															<textarea id="comment-message" name="message" rows={4} tabIndex={4} placeholder={t("writecomment")} aria-required="true" defaultValue={""} />
														</fieldset>
														<button className="form-wg tf-btn primary" name="button" type="button" onClick={handleComment}>
															<span>{t("postcomment")}</span>
														</button>
													</form>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-lg-4">
									<div className="widget-sidebar fixed-sidebar wrapper-sidebar-right">
										<div className="widget-box single-property-contact bg-surface">
											<div className="h7 title fw-7">{t("contactSeller")}</div>
											<div className="box-avatar">
												<Link href={`/developer/${projectDetails?.developer_slug}`} className="images-group">
													{projectDetails?.user_image ? (
														<div className="avatar avt-100 round">
															<img src={projectDetails?.user_image || "/images/avtar/user-image.png"} alt="avatar" />
														</div>
													) :
														null
													}
												</Link>
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
					<section className="flat-latest-property">
						<div className="container">
							{properties.length > 0 && ( // Render title only if properties.length > 0
								<div className="box-title">
									<div className="text-subtitle text-primary">{t("featureproperties")}</div>
									<h4 className="mt-4">{t("themostrecentestate")}</h4>
								</div>
							)}
							<div className="swiper tf-latest-property" data-preview-lg={3} data-preview-md={2} data-preview-sm={2} data-space={30} data-loop="true">
								<Swiper {...swiperOptions2} className="swiper-wrapper">
									{properties.map((property) => (
										<SwiperSlide>
											<div className="homeya-box style-2">
												<div className="archive-top">
													<Link href={`/property/${property.slug}`} className="images-group">
														<div className="images-style">
															<img src={property.picture[0] || "/images/banner/no-banner.png"} alt={property.title} />
														</div>														
													</Link>
													<div className="content">
														<div className="h7 text-capitalize fw-7">
															<Link href={`/property/${property.slug}`} className="link">
																{i18n.language === 'en'
																	? property?.title_en // Show English title if lang = 'en'
																	: property?.title_fr // Show French title if lang = 'fr'
																}
															</Link>
														</div>
														<div className="desc"><i className="fs-16 icon icon-mapPin" /><p>
															{[property?.neighborhood, property?.district, property?.city, property?.state]
																.filter(Boolean) // Remove empty or falsy values
																.join(", ")} {/* Join remaining values with comma */}
														</p> </div>
														<ul className="meta-list">
															<li className="item">
																<i className="icon icon-bed" />
																<span>{property.bedRooms === "0" ? '-' : `${property.bedRooms}`}</span>
															</li>
															<li className="item">
																<i className="icon icon-bathtub" />
																<span>{property.bathRooms === "0" ? '-' : `${property.bathRooms}`}</span>
															</li>
															<li className="item">
																<i className="icon icon-ruler" />
																<span>{property.size === null ? '-' : `${property.size}`}</span>
															</li>
														</ul>
													</div>
												</div>
												<div className="archive-bottom d-flex justify-content-between align-items-center">
													<div className="d-flex gap-8 align-items-center">
														<div className="avatar avt-40 round">
															<img src={property?.user_image} alt="avt" />
														</div>
														<span>{property?.user_name}</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>{property?.price} {property?.currency}</h6>
														<span className="text-variant-1"></span>
													</div>
												</div>
											</div>
										</SwiperSlide>
									))}

								</Swiper>
							</div>				
						</div>
					</section>
				</div >

			</Layout >
			{isModelOpen && (
				<div className="modal" style={{ display: 'block', position: 'fixed', zIndex: 1000, top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
					<div className="modal-content-alert login-alert-sec" >
						<>
							<img
								src="/images/logo/logo.svg" // Replace with your actual image path
								alt="Logo"
								style={{ width: '150px', marginBottom: '15px' }}
							/><br></br>
							<h4>{t('loginAlert')}</h4>
							<p>{t('loginText')}</p>
							<div className="modal-buttons">
								<button className="tf-btn primary" onClick={() => {{}
									closeModal();
									setLogin(true)
								}}>{t("login")}</button>
								<button className="tf-btn primary" onClick={() => setIsModelOpen(false)} style={{ marginLeft: '15px' }}>{t("cancel")}</button>
							</div>
						</>
					</div>
				</div>
			)}
			<ContactPopup contactModelPopup={iscontactUser} contactDetail={contactUserDetails} onClose={() => setIscontactUser(false)} />
			{showLoginModal && <ModalLoginLike isLogin={isLogin} handleLogin={handleLogin} />}

		</>
	)
}