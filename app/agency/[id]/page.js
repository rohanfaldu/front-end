'use client'
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { insertData } from "../../../components/api/Axios/Helper";
import SidebarFilter from "@/components/elements/SidebarFilter";
import PropertyBlog from "@/components/sections/PropertyBlog";
const toCapitalCase = (str) => {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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
export default function AgencyDetail({ params }) {
	const { id } = params;
	console.log(id, ">>>>>>>>>>>>>> SLUG");
	const searchParams = useSearchParams();
	const projectId = searchParams.get("id");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [agencyDetails, setAgencyDetails] = useState('');
	const [propertiesList, setPropertiesList] = useState([]);
	const [properties, setProperties] = useState([]);
	const fetchAgencyDetails = async () => {
		setLoading(true); // Start loading
		try {
			const requestData = {};
			console.log(234)
			// API call
			const response = await insertData(`api/agencies/${id}`, requestData, false);
			console.log('API Response:', response);

			if (response.status) {
				setAgencyDetails(response.data);
				setPropertiesList(response.data.property_details);
				setProperties(response.data.property_details);
				setError(null);
			} else {
				setError("No project details found.");
			}

			// const getPropertyObj = {page: 1, limit: 5, searchTerm: "", status: ""};
			// const propertyResponse = await insertData(`api/property/agent-developer`, getPropertyObj, true);
			// if(propertyResponse.status && propertiesList.length === 0){
			// 	setPropertiesList(propertyResponse.data.list);
			// }
		} catch (err) {
			// Handle API errors
			setError(err.response?.data?.message || "An error occurred");
		} finally {
			setLoading(false); // Stop loading
		}
	};

	// Fetch data on component mount
	useEffect(() => {
		fetchAgencyDetails();
	}, []);

	// Translation hook
	const { t, i18n } = useTranslation();

	
	return (
		<>
			{loading ?
				<Preloader />
				:
				<Layout headerStyle={1} footerStyle={1} breadcrumbTitle={agencyDetails?.full_name}>
					<div>
						{/* <section className="flat-section flat-banner-about">
						<div className="container">
							<div className="row">
								<div className="col-md-5">
									<h3>{t("welcometothe")} <br /> {t("immofind")} </h3>
								</div>
								<div className="col-md-7 hover-btn-view">
									<p className="body-2 text-variant-1"> {agencyDetails?.description} </p>									
								</div>
							</div>
						</div>
					</section> */}
						<section className="flat-section pt-10 flat-property-detail">
							<div className="container">

								<div className="row">
									<div className="col-lg-8">
										<div className="single-property-element single-property-desc">
											{agencyDetails.agency_name !== "" ? (
												<div class="content-top d-flex justify-content-between align-items-center">
													<div class="box-name">
														<a class="flag-tag primary" href="#">{agencyDetails?.agency_name}</a>
													</div>
												</div>
											) : ''}
											{agencyDetails.description !== "" ? (
												<>
													<div className="h7 title fw-7">{t("description")}</div>
													<p className="body-2 text-variant-1">{agencyDetails.description}</p>
												</>
											) : ''}
										</div>
										<div className="single-property-element single-property-overview">
											<div className="h7 title fw-7">{t("socialinformation")}</div>
											<ul className="info-box">
												{agencyDetails.facebook_link !== null ? (
													<li className="item">
														<Link target="_blank" href={agencyDetails.facebook_link} className="box-icon w-52"><i className="icon icon-facebook" /></Link>
														<div className="content">
															<span className="label">Facebook</span>
														</div>
													</li>
												) : ''}
												{agencyDetails.twitter_link !== null ? (
													<li className="item">
														<Link target="_blank" href={agencyDetails.twitter_link} className="box-icon w-52"><i className="icon icon-twitter" /></Link>
														<div className="content">
															<span className="label">Twitter</span>
														</div>
													</li>
												) : ''}
												{agencyDetails.youtube_link !== null ? (
													<li className="item">
														<Link target="_blank" href={agencyDetails.youtube_link} className="box-icon w-52"><i className="icon icon-youtube" /></Link>
														<div className="content">
															<span className="label">Youtube</span>
														</div>
													</li>
												) : ''}
												{agencyDetails.pinterest_link !== null ? (
													<li className="item">
														<Link target="_blank" href={agencyDetails.pinterest_link} className="box-icon w-52"><i className="icon icon-pinterest" /></Link>
														<div className="content">
															<span className="label">pinterest</span>
														</div>
													</li>
												) : ''}
												{agencyDetails.linkedin_link !== null ? (
													<li className="item">
														<Link target="_blank" href={agencyDetails.linkedin_link} className="box-icon w-52"><i className="icon icon-linkedin" /></Link>
														<div className="content">
															<span className="label">linkedin</span>
														</div>
													</li>
												) : ''}
												{agencyDetails.instagram_link !== null ? (
													<li className="item">
														<Link target="_blank" href={agencyDetails.instagram_link} className="box-icon w-52"><i className="icon icon-instagram" /></Link>
														<div className="content">
															<span className="label">instagram</span>
														</div>
													</li>
												) : ''}
											</ul>
										</div>

										{/* <div className="single-property-element single-property-info">
											<div className="h7 title fw-7">{t("otherDetail")}</div>
											<div className="row">
												{agencyDetails?.credit !== null ? (
													<div className="col-md-12">
														<div className="inner-box">
															<span className="label">{t("credit")}:</span>
															<div className="content fw-7">{agencyDetails?.credit}</div>
														</div>
													</div>
												) : ''}
												{agencyDetails?.whatsup_number !== null ? (
													<div className="col-md-12">
														<div className="inner-box">
															<span className="label">{t("whatsupNumber")}:</span>
															<div className="content fw-7">{agencyDetails?.whatsup_number}</div>
														</div>
													</div>
												) : ''}
												{agencyDetails?.tax_number !== null ? (
													<div className="col-md-12">
														<div className="inner-box">
															<span className="label">{t("taxNumber")}:</span>
															<div className="content fw-7">{agencyDetails?.tax_number}</div>
														</div>
													</div>
												) : ''}
												{agencyDetails?.tax_number !== null ? (
													<div className="col-md-12">
														<div className="inner-box">
															<span className="label">{t("licenseNumber")}:</span>
															<div className="content fw-7">{agencyDetails?.license_number}</div>
														</div>
													</div>
												) : ''}
												{agencyDetails?.service_area !== null ? (
													<div className="col-md-12">
														<div className="inner-box">
															<span className="label">{t("serviceArea")}:</span>
															<div className="content fw-7">{agencyDetails?.service_area}</div>
														</div>
													</div>
												) : ''}
											</div>
										</div> */}
									</div>
									<div className="col-lg-4">
										<div className="widget-sidebar fixed-sidebar wrapper-sidebar-right">
											<div className="widget-box single-property-contact bg-surface">
												{/* <div className="h7 title fw-7">Contact Sellers</div> */}
												<div className="box-avatar">
													<div className="avatar avt-100 round">
														<img
															src={agencyDetails?.image && agencyDetails.image !== ''
																? agencyDetails.image
																: '/images/avatar/user-image.png'}
															alt="avatar"
														/>
													</div>
													{agencyDetails ? (
														<div className="info">
															<div className="text-1 name">{agencyDetails?.user_name}</div>
															<span className="truncate-text">{agencyDetails?.user_email_adress}</span><br />
															<span>{agencyDetails?.user_country_code} {agencyDetails?.user_mobile_number}</span>
														</div>
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
												<PropertyBlog data={property} slide={true} />
												
											</SwiperSlide>
										))}

									</Swiper>
								</div>
							</div>
						</section>
					</div>

				</Layout >
			}
		</>
	)
}