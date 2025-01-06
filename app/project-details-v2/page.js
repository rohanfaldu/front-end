'use client'
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { getData } from "../../components/api/Helper";
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
		: false,
	speed: 2000,
	navigation: projectDetails?.picture.length > 1
		? {
			clickable: true,
			nextEl: ".nav-prev-location",
			prevEl: ".nav-next-location",
		}
		: false,
	pagination: projectDetails?.picture.length > 1
		? {
			el: ".swiper-pagination1",
			clickable: true,
		}
		: false,
	slidesPerView: 1,
	loop: projectDetails?.picture.length > 1,
	spaceBetween: projectDetails?.picture.length > 1 ? 20 : 0,
	centeredSlides: projectDetails?.picture.length > 1,
	breakpoints: projectDetails?.picture.length > 1
		? {
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
		: {},
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
	centeredSlides: true,
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

import PropertyMap from "@/components/elements/PropertyMap"
import PropertyMapMarker from "@/components/elements/PropertyMapMarker"
import RangeSlider from "@/components/elements/RangeSlider"
import SidebarFilter from "@/components/elements/SidebarFilter"
import TabNav from "@/components/elements/TabNav"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import Video from "@/components/elements/Video"
import axios from 'axios';
import { useParams } from "react-router-dom"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Preloader from '@/components/elements/Preloader';
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
export default function ProjectDetailsV1({ params }) {
	const searchParams = useSearchParams();
	const projectId = searchParams.get("id");
	const [isAccordion, setIsAccordion] = useState(1)
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [projectDetails, setProjectDetails] = useState('');
	const [isOpen, setOpen] = useState(false);
	const [videoUrl, setVideoUrl] = useState("");
	const [properties, setProperties] = useState([]);
	const fetchProjectsDetails = async () => {
		setLoading(true);
		try {
			const requestData = {
				project_id: projectId
			};

			const response = await getData("api/projects/getbyid", requestData, true);
			console.log('API Response:', response);

			if (response.status) {
				setProjectDetails(response.data);
				setProperties(response.data.property_details);
				setError(null);
			} else {
				setError("No project details found.");
			}
		} catch (err) {

			setError(err.response?.data?.message || "An error occurred");
		} finally {
			setLoading(false);
		}
	};


	useEffect(() => {
		fetchProjectsDetails();
	}, []);


	const { t, i18n } = useTranslation();

	console.log('Project Details:', projectDetails);
	console.log('>>>>>>properties', properties);

	if (loading) {
		return (
			<>
				<Preloader />
			</>
		)
	} else {
		console.log(projectDetails);
	}
	const handleAccordion = (key) => {
		setIsAccordion(prevState => prevState === key ? null : key)
	}
	if ((!projectDetails.video.endsWith(".mp4")) && (videoUrl === "")) {
		const urlParams = new URLSearchParams(new URL(projectDetails.video).search);
		const videoId = urlParams.get('v');
		setVideoUrl('https://www.youtube.com/embed/' + videoId);
	}
	console.log('video');
	console.log(videoUrl);
	return (
		<>

			<Layout headerStyle={1} footerStyle={1}>
				<div>
					<section className="flat-location flat-slider-detail-v1">
						<div className="swiper tf-sw-location">
							<Swiper {...swiperOptions(projectDetails)} className="swiper-wrapper">
								{(projectDetails?.picture.length > 0 ? projectDetails.picture : ["/images/banner/no-banner.png"]).map((item, index) => (
									<SwiperSlide key={index}>
										<Link
											href=''
											data-fancybox="gallery"
											className={`box-imgage-detail d-block property-image ${projectDetails?.picture.length === 1 ? "full-screen" : ""
												}`}
										>
											<img
												src={item}
												alt="img-property"
											/>
										</Link>
									</SwiperSlide>
								))}
							</Swiper>
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
											? projectDetails?.title_en
											: projectDetails?.title_fr
										}
									</h4>
									<div className="box-price d-flex align-items-center">
										<h4>From {projectDetails.price || '0.00'} {projectDetails.currency || 'USD'} </h4>

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
											? projectDetails?.description_en
											: projectDetails?.description_fr
										}
									</div>
									<div className="single-property-element single-property-overview">
										{projectDetails?.meta_details?.length > 0 && (
											(() => {

												const numberFeatures = projectDetails.meta_details.filter(
													(projectDetail) => projectDetail.type === "number"
												);

												if (numberFeatures.length > 0) {
													return (
														<div className="h7 title fw-7">{t("overview")}</div>
													);
												}
												return null;
											})()
										)}

										<ul className="info-box">
											{projectDetails?.meta_details?.length > 0 &&
												projectDetails.meta_details
													.filter((item) => item.type === "number")
													.map((item, index) =>
														item.value !== "0" ? (
															<li className="item" key={index}>
																<Link href="#" className="box-icon w-52">
																	<img src={item.icon} alt="icon" width="25" />
																</Link>
																<div className="content">
																	<span className="label">{item.name}:</span>
																	<span>{item.value}</span>
																</div>
															</li>
														) : null
													)}
										</ul>
									</div>
									<div className="single-property-element single-property-video">
										<div className="h7 title fw-7">{t("video")}</div>
										<div className="img-video">

											{(projectDetails?.video.endsWith(".mp4") ?
												<video height="500" controls>
													<source src={projectDetails?.video} type="video/mp4" />
													Your browser does not support the video tag.
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

									{projectDetails?.meta_details?.length > 0 && (
										(() => {

											const booleanFeatures = projectDetails.meta_details.filter(
												(projectDetail) => projectDetail.type === "boolean"
											);

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
											) : null;
										})()
									)}
									{projectDetails?.vr_link && (
										<div className="single-property-element single-property-feature">
											<div className="h7 title fw-7">Other Information</div>
											<div className="wrap-feature">
												<div className="box-feature">
													<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
														<div style={{ fontWeight: 'bold' }}>VR Link : </div>
														<a href={projectDetails.vr_link} target="_blank" rel="noopener noreferrer">
															{projectDetails.vr_link}
														</a>
													</div>
												</div>
											</div>
										</div>
									)}
									<div className="single-property-element single-property-map">
										<div className="h7 title fw-7">{t("map")}</div>
										<PropertyMapMarker latitude={projectDetails?.latitude} longitude={projectDetails?.longitude} zoom={14} />
										{projectDetails?.address !== "" && (
											<ul className="info-map">
												<li>
													<div className="fw-7">{t("address")}</div>
													<span className="mt-4 text-variant-1">{projectDetails?.address}</span>
												</li>
											</ul>
										)}

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
													<form method="post" id="contactform" className="comment-form form-submit" action="./contact/contact-process.php" acceptCharset="utf-8" noValidate="novalidate">
														<div className="form-wg group-ip">
															<fieldset>
																<label className="sub-ip">{t("name")}</label>
																<input type="text" className="form-control" name="text" placeholder="Your name" required />
															</fieldset>
															<fieldset>
																<label className="sub-ip">{t("email")}</label>
																<input type="email" className="form-control" name="email" placeholder="Your email" required />
															</fieldset>
														</div>
														<fieldset className="form-wg d-flex align-items-center gap-8">
															<input type="checkbox" className="tf-checkbox" id="cb-ip" />
															<label htmlFor="cb-ip" className="text-black text-checkbox">{t("text")}</label>
														</fieldset>
														<fieldset className="form-wg">
															<label className="sub-ip">{t("review")}</label>
															<textarea id="comment-message" name="message" rows={4} tabIndex={4} placeholder="Write comment " aria-required="true" defaultValue={""} />
														</fieldset>
														<button className="form-wg tf-btn primary" name="submit" type="submit">
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
												{projectDetails?.user_image ? (
													<div className="avatar avt-100 round">
														<img src={projectDetails?.user_image || "/images/avtar/user-image.png"} alt="avatar" />
													</div>
												) :
													null
												}

												<div className="info">
													<div className="text-1 name">{projectDetails?.user_name}</div>
													<span>{projectDetails?.email_address}</span>
												</div>
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
					<section className="flat-section pt-0 flat-latest-property">
						<div className="container">
							{properties.length > 0 && (
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
													<Link href="#" className="images-group">
														<div className="images-style">
															<img src={property.picture[0] || "/images/banner/no-banner.png"} alt={property.title} />
														</div>

													</Link>
													<div className="content">
														<div className="h7 text-capitalize fw-7"><Link href="#" className="link"> {property?.title}</Link></div>
														<div className="desc"><i className="fs-16 icon icon-mapPin" /><p>
															{[property.address, property.city, property.state]
																.filter(Boolean)
																.join(", ")}
														</p> </div>
														<ul className="meta-list">
															<li className="item">
																<i className="icon icon-bed" />
																<span>{property.bedRooms === 0 ? '-' : `${property.bedRooms} Bedroom`}</span>
															</li>

															<li className="item">
																<i className="icon icon-ruler" />
																<span>{property.size === null ? '-' : `${property.size} SqMeter`}</span>
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
							<div className="center-align">
								<a href={'/properties'} className="form-wg tf-btn primary">
									<span>Back</span>
								</a>
							</div>

						</div>
					</section>
				</div >

			</Layout >
		</>
	)
}