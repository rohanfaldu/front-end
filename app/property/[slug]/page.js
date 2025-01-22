'use client'
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { getData } from "../../../components/api/Helper";
import ContactSeller from "@/components/sections/ContactSeller";
import Image from "next/image";
const toCapitalCase = (str) => {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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
	
	useEffect(() => {
		console.log(properties);
		const fetchData = async () => {
			//try {
			const lang = i18n.language;

			const propertyObj = { page: 1, limit: 1000, lang: lang };
			const response = await getData('api/property/', propertyObj);
			const propertyList = response.data.list;
			const result = propertyList.find(item => item.slug === slug);
			setProperties(result);
			console.log(result,"rrrrrrrrrrrrrrr")
			setIsLiked(result.like)

			const filteredDetails = result.meta_details.filter(
				(propertyDetail) => propertyDetail.key !== 'bathrooms' && propertyDetail.key !== 'rooms'
			);
			const metaNumberFieldDetails = [];
			const metaCheckboxFieldDetails = [];
			result.meta_details.map((propertyDetail) => {
				if (propertyDetail.type === 'number') {
					metaNumberFieldDetails.push(propertyDetail)
				} else {
					metaCheckboxFieldDetails.push(propertyDetail);
				}
			});

			console.log('metaNumberFieldDetails')
			console.log(metaNumberFieldDetails);

			console.log('metaCheckboxFieldDetails')
			console.log(metaCheckboxFieldDetails);


			const chunkArray = (array, size) => {
				const result = [];
				for (let i = 0; i < array.length; i += size) {
					result.push(array.slice(i, i + size));
				}
				return result;
			};

			const metadetail = chunkArray(metaCheckboxFieldDetails, Math.ceil(metaCheckboxFieldDetails.length / 3));
			console.log('metadetail');
			console.log(metadetail);
			setMetaDetails(metadetail);
			setMetaNumberList(metaNumberFieldDetails);
			// Save data to state
			setLoading(false); // Stop loading
			setError(null); // Clear errors
			// } catch (err) {
			// 	setError(err.response?.data?.message || 'An error occurred'); // Handle error
			// 	setLoading(false); // Stop loading
			// }
		};
		console.log('properties List');
		console.log(properties);
		fetchData(); // Fetch data on component mount
	}, [i18n.language]); // Empty dependency array ensures this runs only once on mount

	if (loading) {
		return (
			<>
				<Preloader />
			</>
		)
	} else {
		console.log(properties);
	}
	const handleAccordion = (key) => {
		setIsAccordion(prevState => prevState === key ? null : key)
	}
	if ((properties.video != null) && (!properties.video.endsWith(".mp4")) && (videoUrl === "")) {
		const urlParams = new URLSearchParams(new URL(properties.video).search);
		const videoId = urlParams.get('v');
		setVideoUrl('https://www.youtube.com/embed/' + videoId);
	}
	console.log('video');
	console.log(properties);


	const handleLike = async (isLiked, id) => {
        if (isLiked) {
            try {
                const token = localStorage.getItem('token');
    
                const response = await fetch(`http://localhost:7000/api/property/${id}/like`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
    
                if (!response.status) {
                    const errorData = await response.json();
                    console.error('Error:', errorData.message);
                    return;
                }
    
                const data = await response.json();
                console.log(data.message);
                setIsLiked(!isLiked);
    
            } catch (error) {
                console.error('Error liking the property:', error);
            }
        } else {
            try {
                const token = localStorage.getItem('token');
    
                const response = await fetch(`http://localhost:7000/api/property/${id}/like`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
    
                if (!response.status) {
                    const errorData = await response.json();
                    console.error('Error:', errorData.message);
                    return;
                }
    
                const data = await response.json();
                console.log(data.message);
                setIsLiked(!isLiked);

    
            } catch (error) {
                console.error('Error liking the property:', error);
            }
        }
    };


	const openPopup = (image) => {
		console.log('image');
		console.log(image);
		setCurrentImage(image);
		setCurrentImageIndex(image);
		setIsOpen(true);
	};

	const closePopup = () => {
		setIsOpen(false);
		setCurrentImage(null);
	};

	return (
		<>

			<Layout headerStyle={isOpen ? 0 : 1} footerStyle={1}>
				<div className={isOpen ? "custom-overlay" : ""}>
				<section className="flat-location flat-slider-detail-v1">
    <div className="swiper tf-sw-location">
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
										<Link href="#" className="flag-tag primary">{properties.transaction}</Link>
										<h4 className="title link">{properties.title}</h4>
									</div>
									<div className="box-price d-flex align-items-center">
										<h4>{properties.price} {properties.currency}</h4>
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
									<ul className="icon-box">
										{/* <li><Link href="#" className="item"><span className="icon icon-arrLeftRight" /> </Link></li>
										<li><Link href="#" className="item"><span className="icon icon-share" /></Link></li>
										<li><Link href="#" className="item"><span className="icon icon-heart" /></Link></li> */}
										<li
                                            className={`${isLiked ? "liked" : "w-40 box-icon thumb-icon"}`}
                                            onClick={() => handleLike(isLiked, properties.id)}
                                        >
                                            <img
                                                src={'/images/logo/thumbs-up.svg'}
                                                className="icon"
                                                style={{ height: "24px" }}
                                            />
                                        </li>
									</ul>
								</div>
							</div>
							<div className="row">
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
										<MapMarker latitude={properties.latitude} longitude={properties.longitude} zoom={14} />

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
														<button className="form-wg tf-btn primary" name="button" type="button">
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
										{(properties.project_details !== null) ?
											<div className="widget-box single-property-contact bg-surface">
												<div className="h7 title fw-7">{t("Project Details")}</div>
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
															<div className="text-1 name"><Link
																href={`/project/${properties.project_details.slug}`}
																className="link"
															>
																{properties.project_details.title}
															</Link></div>
														</div>
													</div>
												</div>
											</div>
											: <></>}
										<ContactSeller data={properties}></ContactSeller>

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
		</>
	)
}