'use client'
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { getData, getDataWithOutTOken } from "../../../components/api/Helper";
import ContactSeller from "@/components/sections/ContactSeller";
import PercentageHeart from "@/components/elements/PercentageHeart";
import ProjectMap from "@/components/elements/ProjectMap"
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

import Image from "next/image";
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
	autoplay: projectDetails?.picture.length > 1
		? {
			delay: 2000,
			disableOnInteraction: false,
		}
		: false, // Disable autoplay for single image
	speed: 2000,
	navigation: projectDetails?.picture.length > 1
		? { // Enable navigation buttons only for multiple images
			clickable: true,
			nextEl: ".nav-prev-location",
			prevEl: ".nav-next-location",
		}
		: false, // Hide navigation buttons for single image
	pagination: projectDetails?.picture.length > 1
		? { // Enable pagination only for multiple images
			el: ".swiper-pagination1",
			clickable: true,
		}
		: false, // Hide pagination for single image
	slidesPerView: 1,
	loop: projectDetails?.picture.length > 1, // Disable loop for single image
	spaceBetween: projectDetails?.picture.length > 1 ? 20 : 0, // No spacing for single image
	centeredSlides: projectDetails?.picture.length > 1, // Center slide for single image
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

const swiperOptions2 = (projectDetails) => ({
	spaceBetween: 10,
	slidesPerView: 1,
	loop: projectDetails?.picture.length > 1,
	modules: [Autoplay, Pagination, Navigation],
	autoplay: projectDetails?.picture.length > 1
		? {
			delay: 2000,
			disableOnInteraction: false,
		}
		: false,
	speed: 2000,
	navigation: projectDetails?.picture.length > 1
		? { // Enable navigation buttons only for multiple images
			clickable: true,
			nextEl: ".nav-prev-location",
			prevEl: ".nav-next-location",
		}
		: false, // Hide navigation buttons for single image
	pagination: projectDetails?.picture.length > 1
		? { // Enable pagination only for multiple images
			el: ".swiper-pagination1",
			clickable: true,
		}
		: false, // Hide pagination for single image
});

import PropertyMap from "@/components/elements/PropertyMap"
import MapMarker from "@/components/elements/MapMarker"
// import NearByMapMarker from "@/components/elements/NearByMapMarker";
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
import ModalLoginLike from "@/components/common/ModelLoginLike";
import variablesList from "@/components/common/Variable";

import Modal from "react-modal";


export default function PropertyDetailsV1({ params }) {
	const { slug } = params;
	const [properties, setProperties] = useState(null);
	const [loading, setLoading] = useState(true);
	const [metadetail, setMetaDetails] = useState(null);
	const [metaNumberList, setMetaNumberList] = useState(null);
	const [error, setError] = useState(null);
	const [videoUrl, setVideoUrl] = useState("");
	const [isAccordion, setIsAccordion] = useState(1);
	const [isOpen, setIsOpen] = useState(false); // State for controlling modal
	const [currentImage, setCurrentImage] = useState(null); // Current image in the modal
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const { t, i18n } = useTranslation();
	const modalSwiperRef = useRef(null);
	const [isLiked, setIsLiked] = useState(false);
	const API_URL = process.env.NEXT_PUBLIC_API_URL;
	const [slugPart, matching] = slug.split('-');
	const [isModelOpen, setIsModelOpen] = useState(false);
	const [isLogin, setLogin] = useState(false)
	const [showLoginModal, setShowLoginModal] = useState(false)
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState("");
	const [getComment, setGetComment] = useState([]);
	const router = useRouter();

	const [pagination, setPagination] = useState({
		totalCount: 0,
		totalPages: 1,
		currentPage: variablesList.currentPage,
		itemsPerPage: variablesList.itemsPerPage,
	});
	// Now you have `slugPart` and `matching` variables
	// console.log('Slug:', slugPart);
	// console.log('Matching:', matching);




	useEffect(() => {
		// console.log("Fetching properties...");

		const fetchData = async () => {
			try {
				const lang = i18n.language;
				const propertyObj = { page: 1, limit: 1000, lang: lang };
				const response = await getData("api/property/", propertyObj);

				if (!response || !response.data) {
					throw new Error("Invalid response from API");
				}

				const propertyList = response.data.list;
				const result = propertyList.find((item) => item.slug === slugPart);

				if (result) {
					setProperties(result);
					setIsLiked(result.like);

					const filteredDetails = result.meta_details.filter(
						(propertyDetail) => propertyDetail.key !== "bathrooms" && propertyDetail.key !== "rooms"
					);

					const metaNumberFieldDetails = [];
					const metaCheckboxFieldDetails = [];

					result.meta_details.forEach((propertyDetail) => {
						if (propertyDetail.type === "number") {
							metaNumberFieldDetails.push(propertyDetail);
						} else {
							metaCheckboxFieldDetails.push(propertyDetail);
						}
					});

					const chunkArray = (array, size) => {
						const result = [];
						for (let i = 0; i < array.length; i += size) {
							result.push(array.slice(i, i + size));
						}
						return result;
					};

					const metadetail = chunkArray(metaCheckboxFieldDetails, Math.ceil(metaCheckboxFieldDetails.length / 3));

					setMetaDetails(metadetail);
					setMetaNumberList(metaNumberFieldDetails);
					setLoading(false);
					setError(null);

					console.log(result, '>>>> Response');
					const currentLoginUser = localStorage.getItem("user_id");
					console.log(currentLoginUser, '>>>> Login')
					const recommandedPerameter = {
						"property_id": result.id,
						"user_id": currentLoginUser
					}
					const recommandedResponse = await getData("api/property-recommended/store", recommandedPerameter);
					console.log(recommandedResponse);

				} else {
					console.warn("Property not found!");
				}
			} catch (err) {
				setError(err.message || "An error occurred");
				setLoading(false);
			}
		};

		fetchData();
	}, [i18n.language]);

	const getPropertyComment = async () => {
		if (!properties?.id) return; // Avoid unnecessary API calls
		// console.log("Fetching property comments...");
		const token = localStorage.getItem("token");

		try {
			const requestData = {
				page: pagination.currentPage,
				limit: pagination.itemsPerPage,
				propertyId: properties.id,
			};

			const response = await fetch(`${API_URL}/api/property/getbycommentid`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(requestData),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();

			if (data.data.list) {
				setGetComment((prevComments) =>
					pagination.currentPage === 1 ? data.data.list : [...prevComments, ...data.data.list]
				);

				setPagination((prevPagination) => ({
					...prevPagination,
					totalCount: data.data.totalCount,
					totalPages: data.data.totalPages,
				}));
			}
		} catch (error) {
			console.error("Error fetching comments:", error);
		}
	};

	// Call getPropertyComment in useEffect
	useEffect(() => {
		getPropertyComment();
	}, [properties, pagination.currentPage]);

	const loadMoreComments = () => {
		if (pagination.currentPage < pagination.totalPages) {
			setPagination((prev) => ({
				...prev,
				currentPage: prev.currentPage + 1,
			}));
		}
	};


	if (loading) {
		return (
			<>
				<Preloader />
			</>
		)
	} else {
		// console.log(properties);
	}
	const handleAccordion = (key) => {
		setIsAccordion(prevState => prevState === key ? null : key)
	}
	if ((properties.video != null) && (videoUrl === "")) {
		const urlParams = new URLSearchParams(new URL(properties.video).search);
		const videoId = urlParams.get('v');
		setVideoUrl('https://www.youtube.com/embed/' + videoId);
	}

	const handleComment = async () => {
		const token = localStorage.getItem('token');

		try {
			const response = await fetch(`${API_URL}/api/property/comment`, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({ rating, comment, propertyId: properties.id, property_owner_id: properties.user_id }),
			});

			const data = await response.json();
			// console.log("API Response:", data);

			if (response.ok) {
				setComment("");
				getPropertyComment();

			}
		} catch (error) {
			console.error("Error submitting review:", error);
		}
	};


	const handleLike = async (isLiked, id, propertyPublisherId) => {
		const token = localStorage.getItem('token');

		if (!token) {
			setIsModelOpen(true);
			return;
		}

		try {
			if (!isLiked) {
				const response = await fetch(`${API_URL}/api/property/like`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					body: JSON.stringify({
						propertyId: id,  // The property ID you are liking
						propertyPublisherId: propertyPublisherId // The publisher ID
					})
				});

				if (!response.ok) {
					const errorData = await response.json();
					console.error('Error:', errorData.message);
					return;
				}

				const data = await response.json();
				// console.log(data.message);
				setIsLiked(!isLiked);
			} else {
				const response = await fetch(`${API_URL}/api/property/${id}/like`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
				});

				if (!response.ok) {
					const errorData = await response.json();
					console.error('Error:', errorData.message);
					return;
				}

				const data = await response.json();
				// console.log(data.message);
				setIsLiked(!isLiked);
			}
		} catch (error) {
			console.error('Error liking the property:', error);
		}
	};



	const openPopup = (image) => {
		// console.log('image');
		// console.log(image);
		setCurrentImage(image);
		setCurrentImageIndex(image);
		setIsOpen(true);
	};

	const closePopup = () => {
		setIsOpen(false);
		setCurrentImage(null);
	};



	const handleLogin = () => {
		// console.log(isLogin, "///////////////////////////")
		setLogin(!isLogin)
		!isLogin ? document.body.classList.add("modal-open") : document.body.classList.remove("modal-open")
	}

	const closeModal = () => {
		setIsModelOpen(false);
		setShowLoginModal(true);
	};

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
							{/* Main Image Slider */}
							<Swiper {...swiperOptions(properties)} className="swiper-wrapper">
								{(properties?.picture.length > 0 ? properties.picture : ["/images/banner/no-banner.png"]).map((item, index) => (
									<SwiperSlide key={index}>
										<div
											onClick={() => openPopup(index)} // Pass the clicked image index
											className={`box-imgage-detail d-block property-image ${properties?.picture.length === 1 ? "full-screen" : ""}`}
										>
											<img src={item} alt="img-property" />
										</div>
									</SwiperSlide>
								))}
							</Swiper>

							{/* Modal for Enlarged Image Slider */}
							{isOpen && (
								<div className="modal-overlay-custom" onClick={closePopup}>
									<div
										className="modal-content-custom"
										onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
									>
										{properties?.picture.length > 1 && (
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
											{...swiperOptions2(properties)}
											initialSlide={currentImageIndex}
											className="swiper-wrapper"
											onSwiper={(swiper) => (modalSwiperRef.current = swiper)} // Reference the modal swiper
										>
											{properties.picture.map((item, index) => (
												<SwiperSlide key={index}>
													<div className="box-imgage-detail">
														<img src={item} alt={`property-large-${index}`} />
													</div>
												</SwiperSlide>
											))}
										</Swiper>
										{/* <button onClick={closePopup} className="close-button">
										X
									</button> */}
									</div>
								</div>
							)}

							{/* Navigation for Main Slider */}
							{properties?.picture.length > 2 && (
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
									<div className="box-name">
										{/* <Link href="#" className="flag-tag primary">{properties.transaction}</Link> */}

										{properties.transaction_type == 'rental' && (
											<Link href="#" className="flag-tag primary"> {t("rental")}</Link>
										)}
										{properties.transaction_type == 'sale' && (
											<Link href="#" className="flag-tag primary"> {t("sale")}</Link>
										)}
										<h4 className="title link">{properties.title}</h4>
									</div>
									<div className="box-price d-flex align-items-center" style={{ width: "20%", justifyContent: "space-between" }}>
										<div>
											{(matching !== undefined) ? (
												<PercentageHeart percentage={matching} />
											) : null}
										</div>
										<div>
											<h4>{properties.price} {properties.currency}</h4>
										</div>
										{/* <span className="body-1 text-variant-1">/month</span> */}
									</div>
								</div>
								<div className="content-bottom">
									<div className="info-box">
										<div className="label">{t("feature")}</div>
										<ul className="meta">
											<li className="meta-item"><span className="icon icon-bed" /> {properties.bedRooms === "0" ? '-' : `${properties.bedRooms} ${t('bedroom')}`}</li>
											<li className="meta-item"><span className="icon icon-bathtub" /> {properties.bathRooms === "0" ? '-' : `${properties.bathRooms} ${t('bathroom')}`}</li>
											<li className="meta-item"><span className="icon icon-ruler" /> {properties.size === null ? '-' : `${properties.size} ${t('sqmeter')}`}</li>
										</ul>
									</div>
									{/* <div className="info-box">
										<div className="label">LOCATION:</div>
										<p className="meta-item"><span className="icon icon-mapPin" /> 8 Broadway, Brooklyn, New York</p>
									</div> */}
									<ul className="icon-box" style={{ alignItems: "center" }}>
										{/* <li><Link href="#" className="item"><span className="icon icon-arrLeftRight" /> </Link></li>
										<li><Link href="#" className="item"><span className="icon icon-share" /></Link></li>
										<li><Link href="#" className="item"><span className="icon icon-heart" /></Link></li> */}
										{/* <li
                                            className={`${isLiked ? "liked" : "w-40 box-icon thumb-icon"}`}
                                            onClick={() => handleLike(isLiked, properties.id)}
                                        >
                                            <img
                                                src={'/images/logo/thumbs-up.svg'}
                                                className="icon"
                                                style={{ height: "24px" }}
                                            />
                                        </li> */}

										{/* <li>
											<span style={{fontSize: "25px"}}>Matching-{matching} %</span>
										</li> */}
										<li className={`${isLiked ? "liked" : "w-40 box-icon"}`} onClick={() => handleLike(isLiked, properties.id, properties.user_id)}>
											<span className="icon icon-heart" style={{ fontSize: "30px" }} />
										</li>
									</ul>
								</div>
							</div>
							<div className="row property-information">
								<div className="col-lg-8">
									<div className="single-property-element single-property-desc">
										<div className="h7 title fw-7">Description</div>
										{properties.description}
									</div>
									<div className="single-property-element single-property-overview">
										<div className="h7 title fw-7">{t("overview")}</div>
										<ul className="info-box">
											{/* <li className="item">
												<Link href="#" className="box-icon w-52"><i className="icon icon-house-line" /></Link>
												<div className="content">
													<span className="label">ID:</span>
													<span>2297</span>
												</div>
											</li> */}
											<li className="item">
												<Link href="#" className="box-icon w-52"><i className="icon icon-arrLeftRight" /></Link>
												<div className="content">
													<span className="label">{t("type")}:</span>
													<span>{properties?.type_details?.title}</span>
												</div>
											</li>
											{(properties.size !== null) ? (
												<li className="item">
													<Link href="#" className="box-icon w-52"><i className="icon icon-ruler" /></Link>
													<div className="content">
														<span className="label">{t("size")}</span>
														<span>{properties.size === 0 ? '-' : `${properties.size} `} {t("sqmeter")}</span>
													</div>
												</li>
											) : null}
											{metaNumberList.length > 0 && metaNumberList.map((item, index) => (
												<>{(item.value) !== "0" ? (
													<li className="item" key={index}>
														<Link href="#" className="box-icon w-52"><img src={item.icon} alt="icon" width="25" /></Link>
														<div className="content">
															<span className="label">{item.name}:</span>
															<span>{item.value} {item.name}</span>
														</div>
													</li>
												) : (<></>)}</>
											))}
										</ul>
									</div>
									{properties.video !== null ? (
										<>
											<div className="single-property-element single-property-video">
												<div className="h7 title fw-7">{t("video")}</div>
												<div className="img-video">
													{(properties.video.endsWith(".mp4") ?
														<video height="500" controls>
															<source src={properties.video} type="video/mp4" />
														</video>

														:
														<iframe height="500" width="100%"
															src={videoUrl}
															title="Immofind"
															frameborder="0"
															allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
															referrerpolicy="strict-origin-when-cross-origin"
															allowfullscreen>
														</iframe>
													)}
												</div>
											</div>
										</>
									) : (<></>)
									}
									{properties?.vr_link && ( // Render only if vr_link is available
										<div className="single-property-element single-property-feature">
											<div className="h7 title fw-7">{t("otherInformation")}</div>
											<div className="wrap-feature">
												<div className="box-feature">
													<button
														className="form-wg tf-btn primary"
														name="button"
														type="button"
														onClick={() => window.open(properties.vr_link, "_blank", "noopener,noreferrer")}
													>
														<span>{t("vrLink")}</span>
													</button>
												</div>
											</div>
										</div>
									)}

									{metadetail.length > 0 && (
										<div className="single-property-element single-property-feature">
											<div className="h7 title fw-7">{t("amenitiesandfeatures")}</div>
											<div className="wrap-feature">
												{metadetail.map((chunk, index) => (
													<div key={index} className="box-feature">
														<ul>
															{chunk.map((propertyDetail) => (
																<li key={propertyDetail.id} className="feature-item">
																	{/* <span className="icon icon-list-dashes" /> */}
																	<img src={propertyDetail.icon} alt="icon" width={20} />
																	{propertyDetail.name}
																</li>
															))}
														</ul>
													</div>
												))}
											</div>
										</div>
									)}
									<div className="single-property-element single-property-map">
										<div className="h7 title fw-7">{t("map")}</div>
										{/* <MapMarker latitude={properties.latitude} longitude={properties.longitude} zoom={18} /> */}
										{/* <ProjectMap topmap={false} singleMap={false} propertys={properties} slug="project"/> */}


										<MapContainer
											center={[properties.latitude, properties.longitude]}
											zoom={12}
											maxZoom={18}
											scrollWheelZoom={false}
											className="property-map"
										>
											<UpdateMapView center={[properties.latitude, properties.longitude]} zoom={18} />

											<TileLayer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
											<Marker
												key={properties.id}
												position={[properties.latitude, properties.longitude]}
												icon={customMsrker}
											>
											</Marker>
										</MapContainer>


										<ul className="info-map">
											<li>
												<div className="fw-7">{t("address")}</div>
												{properties.address !== "" && (<span className="mt-4 text-variant-1">{properties.address}</span>)}<br />
												<span className="mt-4 text-variant-1 67886">
													{[properties?.neighborhood, properties?.district, properties?.city, properties?.state]
														.filter(Boolean)
														.join(', ')}
												</span>
											</li>
										</ul>

									</div>
									<div className="single-property-element single-wrapper-review">
										<div className="box-title-review d-flex justify-content-between align-items-center flex-wrap gap-20">
											<div className="h7 fw-7">{t("guestreviews")}</div>
											{/* <Link href="#" className="tf-btn">{t("viewallreviews")}</Link> */}
										</div>

										<div className="wrap-review">
											<ul className="box-review">
												{getComment.map((comment) => (
													<li key={comment.id} className="list-review-item">
														<div className="avatar avt-60 round">
															<img src={comment.users.image} alt="avatar" />
														</div>
														<div className="content" style={{ width: "100%" }}>
															<div className="name h7 fw-7 text-black">
																{comment.users.full_name}
															</div>
															<span className="mt-4 d-inline-block date body-3 text-variant-2">
																{new Date(comment.created_at).toLocaleDateString()}
															</span>
															<ul className="mt-8 list-star">
																{Array.from({ length: comment.rating }).map((_, index) => (
																	<li key={index} className="icon-star" />
																))}
															</ul>
															<p className="mt-12 body-2 text-black">{comment.comment}</p>

														</div>
													</li>
												))}
												{pagination.currentPage < pagination.totalPages && (
													<div onClick={loadMoreComments} className="view-question" style={{ cursor: 'pointer' }}>
														See more answered questions ({pagination.totalCount - getComment.length})
													</div>
												)}
											</ul>

										</div>
										{isLogin && (
											<div className="wrap-form-comment">
												<div className="h7">{t("leaveareply")}</div>
												<div id="comments" className="comments">
													<div className="respond-comment">
														<form method="post" id="contactform" className="comment-form form-submit" acceptCharset="utf-8" noValidate="novalidate">

															<fieldset className="form-wg">
																<div>
																	<div style={{ display: "flex", justifyContent: "space-between" }}>
																		<div>
																			<label className="sub-ip">{t("review")}</label>
																		</div>
																		<div>
																			{[1, 2, 3, 4, 5].map((star) => (
																				<img
																					key={star}
																					src={star <= rating ? "/images/logo/star-solid.svg" : "/images/logo/star-blank.svg"}
																					alt="star"
																					style={{ width: "25px", cursor: "pointer" }}
																					onClick={() => setRating(star)}
																				/>
																			))}
																		</div>
																	</div>
																	<div>
																		<textarea
																			id="comment-message"
																			name="message"
																			rows={4}
																			tabIndex={4}
																			placeholder={t("writecomment")}
																			aria-required="true"
																			value={comment}
																			onChange={(e) => setComment(e.target.value)} // Update state on change
																		/>
																	</div>
																</div>
																<button className="form-wg tf-btn primary" name="button" type="button" disabled={comment.trim() === ""} onClick={handleComment}>
																	<span>{t("postcomment")}</span>
																</button>
															</fieldset>

														</form>
													</div>
												</div>
											</div>
										)}

									</div>
								</div>
								<div className="col-lg-4">
									<div className="widget-sidebar fixed-sidebar wrapper-sidebar-right">
										{(properties.project_details !== null) ?
											<div className="widget-box single-property-contact bg-surface">
												<div className="h7 title fw-7">{t("projectDetails")}</div>
												<div className="box-avatar">
													<div className="box-avatar">
														<Link
															href={`/project/${properties.project_details.slug}`}
															alt="icon"
														>

															<div className="">
																<img
																	width={100}
																	src={properties.project_details.icon}
																	alt={properties.name}
																/>
															</div>

														</Link>

														<div className="info">
															<div className="text-1 name">
																<Link
																	href={`/project/${properties.project_details.slug}`}
																	className="link"
																>
																	{properties.project_details.title}
																</Link>
															</div>
														</div>
													</div>
												</div>
											</div>
											: <></>}
										<ContactSeller data={properties} ></ContactSeller>

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
								<button className="tf-btn primary" onClick={() => {
									closeModal();
									setLogin(true)
								}}>{t("login")}</button>
								<button className="tf-btn primary" onClick={() => setIsModelOpen(false)} style={{ marginLeft: '15px' }}>{t("cancel")}</button>
							</div>
						</>
					</div>
				</div>
			)}
			{showLoginModal && <ModalLoginLike isLogin={isLogin} handleLogin={handleLogin} />}
		</>
	)
}