'use client'
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { getData } from "../../../components/api/Helper";
import Image from "next/image";
const toCapitalCase = (str) => {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
const swiperOptions = {
	modules: [Autoplay, Pagination, Navigation],
	autoplay: {
		delay: 2000,
		disableOnInteraction: false,
	},
	speed: 2000,
	navigation: {
		clickable: true,
		nextEl: ".nav-prev-location",
		prevEl: ".nav-next-location",
	},
	pagination: {
		el: ".swiper-pagination1",
		clickable: true,
	},
	slidesPerView: 1,
	loop: true,
	spaceBetween: 20,
	centeredSlides: true,
	breakpoints: {
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
			slidesPerView: 2.03,
			spaceBetween: 20,
		},
	},
}

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
import {useParams} from "react-router-dom"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Preloader from '@/components/elements/Preloader';
import { useTranslation } from "react-i18next";
export default function PropertyDetailsV1({ params }) {
	const { id } = params; 
	const [properties, setProperties] = useState(null); 
 	const [loading, setLoading] = useState(true);
 	const [metadetail, setMetaDetails] = useState(null);
  	const [error, setError] = useState(null); 
	const [isAccordion, setIsAccordion] = useState(1);
	const { t, i18n } = useTranslation();
	useEffect(() => {
		const fetchData = async () => {
		//try {
			const lang = i18n.language;
			const propertyObj = {page: 1, limit: 100, lang: lang};
			const response = await getData('api/property/', propertyObj);
			// console.log('response');
			// console.log(response.data.list);
			// setProperties(response.data.list); // Save data to state
			// setLoading(false); // Stop loading
			// setError(null);
			
			// const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/property`,
			// { /* Pass necessary payload here */ },
			// 	{
			// 		headers: {
			// 		'Content-Type': 'application/json',
			// 		},
			// 	}
			// );

			const propertyList = response.data.list;
			const result = propertyList.find(item => item.id === id);
			setProperties(result);
			console.log(result.meta_details);
			const filteredDetails = result.meta_details.filter(
				(propertyDetail) => propertyDetail.key !== 'bathrooms' && propertyDetail.key !== 'rooms'
			);
			const chunkArray = (array, size) => {
				const result = [];
				for (let i = 0; i < array.length; i += size) {
				  result.push(array.slice(i, i + size));
				}
				return result;
			  };
			const metadetail = chunkArray(filteredDetails, Math.ceil(filteredDetails.length / 3));
			setMetaDetails(metadetail);
			 // Save data to state
			setLoading(false); // Stop loading
			setError(null); // Clear errors
		// } catch (err) {
		// 	setError(err.response?.data?.message || 'An error occurred'); // Handle error
		// 	setLoading(false); // Stop loading
		// }
		};
		console.log('properties');
		console.log(properties);
		fetchData(); // Fetch data on component mount
	}, [i18n.language]); // Empty dependency array ensures this runs only once on mount

	if(loading){
		return (
			<>
				<Preloader />
			</>
		)
	}else{
		console.log(properties);
	}
	const handleAccordion = (key) => {
		setIsAccordion(prevState => prevState === key ? null : key)
	}
	console.log('images');
	console.log(properties.picture);
	return (
		<>

			<Layout headerStyle={1} footerStyle={1}>
				<div>
					<section className="flat-location flat-slider-detail-v1">
						{/* <div className="swiper tf-sw-location">
							 <Swiper {...swiperOptions} className="swiper-wrapper">
								{properties.picture.length > 0 && properties.picture.map((item, index) => (
									<SwiperSlide >
										<Link href={item} data-fancybox="gallery" className="box-imgage-detail d-block property-image">
											<img src={item} alt="img-property"  className="" />
										</Link>
									</SwiperSlide>		
								))}
								<SwiperSlide>
									<Link href="/images/banner/banner-property-1.jpg" data-fancybox="gallery" className="box-imgage-detail d-block">
										<img src="/images/banner/banner-property-1.jpg" alt="img-property" />
									</Link>
								</SwiperSlide>
							</Swiper>
							<div className="box-navigation">
								<div className="navigation swiper-nav-next nav-next-location"><span className="icon icon-arr-l" /></div>
								<div className="navigation swiper-nav-prev nav-prev-location"><span className="icon icon-arr-r" /></div>
							</div>
							 <div className="icon-box">
                  				<Link href="#" className="item"><span className="icon icon-map-trifold"></span></Link>
								  {properties.picture.length > 0 && properties.picture.map((item, index) => (
										<Link  href={item} className="item active" data-fancybox="gallery">
										<span className="icon icon-images"></span>
									</Link>
								))}
								
							</div>
						</div> */}
						{/* <img src={properties.picture?properties.picture:"/images/banner/banner-property-1.jpg"} alt="img-property" className="property-image" /> */}
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
										<h4>${properties.price}</h4>
										{/* <span className="body-1 text-variant-1">/month</span> */}
									</div>
								</div>
								<div className="content-bottom">
									<div className="info-box">
										<div className="label">{t("feature")}</div>
										<ul className="meta">
											<li className="meta-item"><span className="icon icon-bed" /> {properties.bedRooms === 0 ? '-': `${properties.bedRooms}`} {t('bedroom')}</li>
											<li className="meta-item"><span className="icon icon-bathtub" /> {properties.bathRooms === 0 ? '-': `${properties.bathRooms} `}{t('bathroom')}</li>
											<li className="meta-item"><span className="icon icon-ruler" /> {properties.size === null ? '-': `${properties.size} `}{t('sqmeter')}</li>
										</ul>
									</div>
									{/* <div className="info-box">
										<div className="label">LOCATION:</div>
										<p className="meta-item"><span className="icon icon-mapPin" /> 8 Broadway, Brooklyn, New York</p>
									</div> */}
									<ul className="icon-box">
										<li><Link href="#" className="item"><span className="icon icon-arrLeftRight" /> </Link></li>
										<li><Link href="#" className="item"><span className="icon icon-share" /></Link></li>
										<li><Link href="#" className="item"><span className="icon icon-heart" /></Link></li>
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
													<span className="label">{t("type")}</span>
													<span>{toCapitalCase(properties.type)}</span>
												</div>
											</li>
											<li className="item">
												<Link href="#" className="box-icon w-52"><i className="icon icon-bed" /></Link>
												<div className="content">
													<span className="label">{t("bedrooms")}</span>
													<span>{properties.bedRooms === 0 ? '-': `${properties.bedRooms} Rooms`}</span>
												</div>
											</li>
											<li className="item">
												<Link href="#" className="box-icon w-52"><i className="icon icon-bathtub" /></Link>
												<div className="content">
													<span className="label">{t("bathrooms")}</span>
													<span>{properties.bathRooms === 0 ? '-': `${properties.bathRooms} Rooms`}</span>
												</div>
											</li>
											{/* <li className="item">
												<Link href="#" className="box-icon w-52"><i className="icon icon-garage" /></Link>
												<div className="content">
													<span className="label">Garages:</span>
													<span>2 Rooms</span>
												</div>
											</li> */}
											<li className="item">
												<Link href="#" className="box-icon w-52"><i className="icon icon-ruler" /></Link>
												<div className="content">
													<span className="label">{t("size")}</span>
													<span>{properties.size === 0 ? '-': `${properties.size} SqMeter`}</span>
												</div>
											</li>
											{/* <li className="item">
												<Link href="#" className="box-icon w-52"><i className="icon icon-crop" /></Link>
												<div className="content">
													<span className="label">Land Size:</span>
													<span>2,000 SqMeter</span>
												</div>
											</li> */}
											{/* <li className="item">
												<Link href="#" className="box-icon w-52"><i className="icon icon-hammer" /></Link>
												<div className="content">
													<span className="label">Year Built:</span>
													<span>2024</span>
												</div>
											</li> */}
										</ul>
									</div>
									<div className="single-property-element single-property-video">
										<div className="h7 title fw-7">{t("video")}</div>
										<div className="img-video">
											<img src="/images/banner/img-video.jpg" alt="img-video" />
											<Video type="youtube" link="http://localhost:7000/uploads/big_buck_bunny_720p_2mb.mp4" />
										</div>
									</div>
									{/* <div className="single-property-element single-property-info">
										<div className="h7 title fw-7">Property Details</div>
										<div className="row">
											<div className="col-md-6">
												<div className="inner-box">
													<span className="label">Property ID:</span>
													<div className="content fw-7">AVT1020</div>
												</div>
											</div>
											<div className="col-md-6">
												<div className="inner-box">
													<span className="label">Bedrooms:</span>
													<div className="content fw-7">4</div>
												</div>
											</div>
											<div className="col-md-6">
												<div className="inner-box">
													<span className="label">Price:</span>
													<div className="content fw-7">$250,00<span className="caption-1 fw-4 text-variant-1">/month</span></div>
												</div>
											</div>
											<div className="col-md-6">
												<div className="inner-box">
													<span className="label">Bedrooms:</span>
													<div className="content fw-7">1</div>
												</div>
											</div>
											<div className="col-md-6">
												<div className="inner-box">
													<span className="label">Property Size:</span>
													<div className="content fw-7">1200 SqMeter</div>
												</div>
											</div>
											<div className="col-md-6">
												<div className="inner-box">
													<span className="label">Bathsrooms:</span>
													<div className="content fw-7">1</div>
												</div>
											</div>
											<div className="col-md-6">
												<div className="inner-box">
													<span className="label">Year built:</span>
													<div className="content fw-7">2023 - 12 - 11</div>
												</div>
											</div>
											<div className="col-md-6">
												<div className="inner-box">
													<span className="label">Bathsrooms:</span>
													<div className="content fw-7">3</div>
												</div>
											</div>
											<div className="col-md-6">
												<div className="inner-box">
													<span className="label">Property Type:</span>
													<div className="content fw-7">House, Apartment</div>
												</div>
											</div>
											<div className="col-md-6">
												<div className="inner-box">
													<span className="label">Garage:</span>
													<div className="content fw-7">1</div>
												</div>
											</div>
											<div className="col-md-6">
												<div className="inner-box">
													<span className="label">Property Status:</span>
													<div className="content fw-7">For Rent</div>
												</div>
											</div>
											<div className="col-md-6">
												<div className="inner-box">
													<span className="label">Garage Size:</span>
													<div className="content fw-7">1200 SqMeter</div>
												</div>
											</div>
										</div>
									</div> */}
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
															<img src={propertyDetail.icon} alt="icon" width={20}/>
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
										<PropertyMapMarker isGeolocation={false} latitude={properties.latitude} longitude={properties.longitude} zoom={18} />
										<ul className="info-map">
											<li>
												<div className="fw-7">{t("address")}</div>
												<span className="mt-4 text-variant-1">{t("add1")}</span>
											</li>
											<li>
												<div className="fw-7">{t("downtime")}</div>
												<span className="mt-4 text-variant-1">5 min</span>
											</li>
											<li>
												<div className="fw-7">{t("fll")}</div>
												<span className="mt-4 text-variant-1">15 min</span>
											</li>
										</ul>
									</div>
									{/* <div className="single-property-element single-property-floor">
										<div className="h7 title fw-7">Floor plans</div>
										<ul className="box-floor" id="parent-floor">
											<li className="floor-item" onClick={() => handleAccordion(1)}>
												<div className={`${isAccordion == 1 ? "floor-header" : "floor-header collapsed"}`}>
													<div className="inner-left">
														<i className="icon icon-arr-r" />
														<span className="fw-7">First Floor</span>
													</div>
													<ul className="inner-right">
														<li className="d-flex align-items-center gap-8">
															<i className="icon icon-bed" />
															2 Bedroom
														</li>
														<li className="d-flex align-items-center gap-8">
															<i className="icon icon-bathtub" />
															2 Bathroom
														</li>
													</ul>
												</div>
												<div id="floor-one" className={`${isAccordion == 1 ? "collapse show" : "collapse"}`} data-bs-parent="#parent-floor">
													<div className="faq-body">
														<div className="box-img">
															<img src="/images/banner/floor.png" alt="img-floor" />
														</div>
													</div>
												</div>
											</li>
											<li className="floor-item" onClick={() => handleAccordion(2)}>
												<div className={`${isAccordion == 2 ? "floor-header" : "floor-header collapsed"}`}>
													<div className="inner-left">
														<i className="icon icon-arr-r" />
														<span className="fw-7">Second Floor</span>
													</div>
													<ul className="inner-right">
														<li className="d-flex align-items-center gap-8">
															<i className="icon icon-bed" />
															2 Bedroom
														</li>
														<li className="d-flex align-items-center gap-8">
															<i className="icon icon-bathtub" />
															2 Bathroom
														</li>
													</ul>
												</div>
												<div id="floor-two" className={`${isAccordion == 2 ? "collapse show" : "collapse"}`} data-bs-parent="#parent-floor">
													<div className="faq-body">
														<div className="box-img">
															<img src="/images/banner/floor.png" alt="img-floor" />
														</div>
													</div>
												</div>
											</li>
										</ul>
									</div>
									<div className="single-property-element single-property-attachments">
										<div className="h7 title fw-7">File Attachments</div>
										<div className="row">
											<div className="col-sm-6">
												<Link href="#" target="_blank" className="attachments-item">
													<div className="box-icon w-60">
														<img src="/images/home/file-1.png" alt="file" />
													</div>
													<span>Villa-Document.pdf</span>
													<i className="icon icon-download" />
												</Link>
											</div>
											<div className="col-sm-6">
												<Link href="#" target="_blank" className="attachments-item">
													<div className="box-icon w-60">
														<img src="/images/home/file-2.png" alt="file" />
													</div>
													<span>Villa-Document.pdf</span>
													<i className="icon icon-download" />
												</Link>
											</div>
										</div>
									</div> */}
									{/* <div className="single-property-element single-property-explore">
										<div className="h7 title fw-7">Explore Property</div>
										<div className="box-img">
											<img src="/images/banner/img-explore.jpg" alt="img" />
											<div className="box-icon w-80">
												<span className="icon icon-360" />
											</div>
										</div>
									</div>
									<div className="single-property-element single-property-loan">
										<div className="h7 title fw-7">Loan Calculator</div>
										<form action="#" className="box-loan-calc">
											<div className="box-top">
												<div className="item-calc">
													<label htmlFor="loan1" className="label">Total Amount:</label>
													<input type="number" id="loan1" placeholder="10,000" className="form-control" />
												</div>
												<div className="item-calc">
													<label htmlFor="loan1" className="label">Down Payment:</label>
													<input type="number" id="loan1" placeholder={3000} className="form-control" />
												</div>
												<div className="item-calc">
													<label htmlFor="loan1" className="label">Amortization Period (months):</label>
													<input type="number" id="loan1" placeholder={12} className="form-control" />
												</div>
												<div className="item-calc">
													<label htmlFor="loan1" className="label">Interest rate (%):</label>
													<input type="number" id="loan1" placeholder={5} className="form-control" />
												</div>
											</div>
											<div className="box-bottom">
												<button className="tf-btn primary">Calculator</button>
												<div className="d-flex gap-4">
													<span className="h7 fw-7">Monthly Payment:</span>
													<span className="result h7 fw-7">$599.25</span>
												</div>
											</div>
										</form>
									</div> */}
									{/* <div className="single-property-element single-property-nearby">
										<div className="h7 title fw-7">What’s nearby?</div>
										<p className="body-2">Explore nearby amenities to precisely locate your property and identify surrounding conveniences, providing a comprehensive overview of the living environment and the property's convenience.</p>
										<div className="grid-2 box-nearby">
											<ul className="box-left">
												<li className="item-nearby">
													<span className="label">School:</span>
													<span className="fw-7">0.7 km</span>
												</li>
												<li className="item-nearby">
													<span className="label">University:</span>
													<span className="fw-7">1.3 km</span>
												</li>
												<li className="item-nearby">
													<span className="label">Grocery center:</span>
													<span className="fw-7">0.6 km</span>
												</li>
												<li className="item-nearby">
													<span className="label">Market:</span>
													<span className="fw-7">1.1 km</span>
												</li>
											</ul>
											<ul className="box-right">
												<li className="item-nearby">
													<span className="label">Hospital:</span>
													<span className="fw-7">0.4 km</span>
												</li>
												<li className="item-nearby">
													<span className="label">Metro station:</span>
													<span className="fw-7">1.8 km</span>
												</li>
												<li className="item-nearby">
													<span className="label">Gym, wellness:</span>
													<span className="fw-7">1.3 km</span>
												</li>
												<li className="item-nearby">
													<span className="label">River:</span>
													<span className="fw-7">2.1 km</span>
												</li>
											</ul>
										</div>
									</div> */}
									<div className="single-property-element single-wrapper-review">
										<div className="box-title-review d-flex justify-content-between align-items-center flex-wrap gap-20">
											<div className="h7 fw-7">{t("guestreviews")}</div>
											<Link href="#" className="tf-btn">{t("viewallreviews")}</Link>
										</div>
										<div className="wrap-review">
											<ul className="box-review">
												<li className="list-review-item">
													<div className="avatar avt-60 round">
														<img src="/images/avatar/avt-2.jpg" alt="avatar" />
													</div>
													<div className="content">
														<div className="name h7 fw-7 text-black">Viola Lucas
															<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path fillRule="evenodd" clipRule="evenodd" d="M0 8C0 12.4112 3.5888 16 8 16C12.4112 16 16 12.4112 16 8C16 3.5888 12.4112 0 8 0C3.5888 0 0 3.5888 0 8ZM12.1657 6.56569C12.4781 6.25327 12.4781 5.74673 12.1657 5.43431C11.8533 5.1219 11.3467 5.1219 11.0343 5.43431L7.2 9.26863L5.36569 7.43431C5.05327 7.12189 4.54673 7.12189 4.23431 7.43431C3.9219 7.74673 3.9219 8.25327 4.23431 8.56569L6.63432 10.9657C6.94673 11.2781 7.45327 11.2781 7.76569 10.9657L12.1657 6.56569Z" fill="#198754" />
															</svg>
														</div>
														<span className="mt-4 d-inline-block  date body-3 text-variant-2">August 13,
															2023</span>
														<ul className="mt-8 list-star">
															<li className="icon-star" />
															<li className="icon-star" />
															<li className="icon-star" />
															<li className="icon-star" />
															<li className="icon-star" />
														</ul>
														<p className="mt-12 body-2 text-black">It's really easy to use and it is
															exactly what I am looking for. A lot of good looking templates &amp;
															it's highly customizable. Live support is helpful, solved my issue
															in no time.</p>
														<ul className="box-img-review">
															<li>
																<Link href="#" className="img-review">
																	<img src="/images/blog/review1.jpg" alt="img-review" />
																</Link>
															</li>
															<li>
																<Link href="#" className="img-review">
																	<img src="/images/blog/review2.jpg" alt="img-review" />
																</Link>
															</li>
															<li>
																<Link href="#" className="img-review">
																	<img src="/images/blog/review3.jpg" alt="img-review" />
																</Link>
															</li>
															<li>
																<Link href="#" className="img-review">
																	<img src="/images/blog/review4.jpg" alt="img-review" />
																</Link>
															</li>
															<li>
																<Link href="#" className="img-review">
																	<span className="fw-7">+12</span>
																</Link>
															</li>
														</ul>
													</div>
												</li>
												<li className="list-review-item">
													<div className="avatar avt-60 round">
														<img src="/images/avatar/avt-3.jpg" alt="avatar" />
													</div>
													<div className="content">
														<div className="name h7 fw-7 text-black">Viola Lucas
															<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path fillRule="evenodd" clipRule="evenodd" d="M0 8C0 12.4112 3.5888 16 8 16C12.4112 16 16 12.4112 16 8C16 3.5888 12.4112 0 8 0C3.5888 0 0 3.5888 0 8ZM12.1657 6.56569C12.4781 6.25327 12.4781 5.74673 12.1657 5.43431C11.8533 5.1219 11.3467 5.1219 11.0343 5.43431L7.2 9.26863L5.36569 7.43431C5.05327 7.12189 4.54673 7.12189 4.23431 7.43431C3.9219 7.74673 3.9219 8.25327 4.23431 8.56569L6.63432 10.9657C6.94673 11.2781 7.45327 11.2781 7.76569 10.9657L12.1657 6.56569Z" fill="#198754" />
															</svg>
														</div>
														<span className="mt-4 d-inline-block  date body-3 text-variant-2">August 13,
															2023</span>
														<ul className="mt-8 list-star">
															<li className="icon-star" />
															<li className="icon-star" />
															<li className="icon-star" />
															<li className="icon-star" />
															<li className="icon-star" />
														</ul>
														<p className="mt-12 body-2 text-black">It's really easy to use and it is
															exactly what I am looking for. A lot of good looking templates &amp;
															it's highly customizable. Live support is helpful, solved my issue
															in no time.</p>
													</div>
												</li>
												<li className="list-review-item">
													<div className="avatar avt-60 round">
														<img src="/images/avatar/avt-4.jpg" alt="avatar" />
													</div>
													<div className="content">
														<div className="name h7 fw-7 text-black">Darlene Robertson
															<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path fillRule="evenodd" clipRule="evenodd" d="M0 8C0 12.4112 3.5888 16 8 16C12.4112 16 16 12.4112 16 8C16 3.5888 12.4112 0 8 0C3.5888 0 0 3.5888 0 8ZM12.1657 6.56569C12.4781 6.25327 12.4781 5.74673 12.1657 5.43431C11.8533 5.1219 11.3467 5.1219 11.0343 5.43431L7.2 9.26863L5.36569 7.43431C5.05327 7.12189 4.54673 7.12189 4.23431 7.43431C3.9219 7.74673 3.9219 8.25327 4.23431 8.56569L6.63432 10.9657C6.94673 11.2781 7.45327 11.2781 7.76569 10.9657L12.1657 6.56569Z" fill="#198754" />
															</svg>
														</div>
														<span className="mt-4 d-inline-block  date body-3 text-variant-2">August 13, 2023</span>
														<ul className="mt-8 list-star">
															<li className="icon-star" />
															<li className="icon-star" />
															<li className="icon-star" />
															<li className="icon-star" />
															<li className="icon-star" />
														</ul>
														<p className="mt-12 body-2 text-black">It's really easy to use and it is
															exactly what I am looking for. A lot of good looking templates &amp;
															it's highly customizable. Live support is helpful, solved my issue
															in no time.</p>
													</div>
												</li>
												<li className="list-review-item">
													<div className="avatar avt-60 round">
														<img src="/images/avatar/avt-2.jpg" alt="avatar" />
													</div>
													<div className="content">
														<div className="name h7 fw-7 text-black">Viola Lucas
															<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path fillRule="evenodd" clipRule="evenodd" d="M0 8C0 12.4112 3.5888 16 8 16C12.4112 16 16 12.4112 16 8C16 3.5888 12.4112 0 8 0C3.5888 0 0 3.5888 0 8ZM12.1657 6.56569C12.4781 6.25327 12.4781 5.74673 12.1657 5.43431C11.8533 5.1219 11.3467 5.1219 11.0343 5.43431L7.2 9.26863L5.36569 7.43431C5.05327 7.12189 4.54673 7.12189 4.23431 7.43431C3.9219 7.74673 3.9219 8.25327 4.23431 8.56569L6.63432 10.9657C6.94673 11.2781 7.45327 11.2781 7.76569 10.9657L12.1657 6.56569Z" fill="#198754" />
															</svg>
														</div>
														<span className="mt-4 d-inline-block  date body-3 text-variant-2">August 13,
															2023</span>
														<ul className="mt-8 list-star">
															<li className="icon-star" />
															<li className="icon-star" />
															<li className="icon-star" />
															<li className="icon-star" />
															<li className="icon-star" />
														</ul>
														<p className="mt-12 body-2 text-black">It's really easy to use and it is
															exactly what I am looking for. A lot of good looking templates &amp;
															it's highly customizable. Live support is helpful, solved my issue
															in no time.</p>
														<ul className="box-img-review">
															<li>
																<Link href="#" className="img-review">
																	<img src="/images/blog/review1.jpg" alt="img-review" />
																</Link>
															</li>
															<li>
																<Link href="#" className="img-review">
																	<img src="/images/blog/review2.jpg" alt="img-review" />
																</Link>
															</li>
															<li>
																<Link href="#" className="img-review">
																	<img src="/images/blog/review3.jpg" alt="img-review" />
																</Link>
															</li>
															<li>
																<Link href="#" className="img-review">
																	<img src="/images/blog/review4.jpg" alt="img-review" />
																</Link>
															</li>
															<li>
																<Link href="#" className="img-review">
																	<span className="fw-7">+12</span>
																</Link>
															</li>
														</ul>
														<Link href="#" className="view-question">See more answered questions (719)</Link>
													</div>
												</li>
											</ul>
										</div>
										<div className="wrap-form-comment">
											<div className="h7">Leave A Reply</div>
											<div id="comments" className="comments">
												<div className="respond-comment">
													<form method="post" id="contactform" className="comment-form form-submit" action="./contact/contact-process.php" acceptCharset="utf-8" noValidate="novalidate">
														<div className="form-wg group-ip">
															<fieldset>
																<label className="sub-ip">Name</label>
																<input type="text" className="form-control" name="text" placeholder="Your name" required />
															</fieldset>
															<fieldset>
																<label className="sub-ip">Email</label>
																<input type="email" className="form-control" name="email" placeholder="Your email" required />
															</fieldset>
														</div>
														<fieldset className="form-wg d-flex align-items-center gap-8">
															<input type="checkbox" className="tf-checkbox" id="cb-ip" />
															<label htmlFor="cb-ip" className="text-black text-checkbox">Save your name, email for the next time review </label>
														</fieldset>
														<fieldset className="form-wg">
															<label className="sub-ip">Review</label>
															<textarea id="comment-message" name="message" rows={4} tabIndex={4} placeholder="Write comment " aria-required="true" defaultValue={""} />
														</fieldset>
														<button className="form-wg tf-btn primary" name="submit" type="submit">
															<span>Post Comment</span>
														</button>
													</form>
												</div>
											</div>
										</div>
									</div>
								</div>
								{/* <div className="col-lg-4">
									<div className="widget-sidebar fixed-sidebar wrapper-sidebar-right">
										<div className="widget-box single-property-contact bg-surface">
											<div className="h7 title fw-7">Contact Sellers</div>
											<div className="box-avatar">
												<div className="avatar avt-100 round">
													<img src="/images/avatar/avt-12.jpg" alt="avatar" />
												</div>
												<div className="info">
													<div className="text-1 name">Shara Conner</div>
													<span>1-333-345-6868 themesflat@gmail.com</span>
												</div>
											</div>
											<form action="#" className="contact-form">
												<div className="ip-group">
													<label htmlFor="fullname">Full Name:</label>
													<input type="text" placeholder="Jony Dane" className="form-control" />
												</div>
												<div className="ip-group">
													<label htmlFor="phone">Phone Number:</label>
													<input type="text" placeholder="ex 0123456789" className="form-control" />
												</div>
												<div className="ip-group">
													<label htmlFor="email">Email Address:</label>
													<input type="text" placeholder="themesflat@gmail.com" className="form-control" />
												</div>
												<div className="ip-group">
													<label htmlFor="message">Your Message:</label>
													<textarea id="comment-message" name="message" rows={4} tabIndex={4} placeholder="Message" aria-required="true" defaultValue={""} />
												</div>
												<button className="tf-btn primary w-100">Send Message</button>
											</form>
										</div>
										<div className="flat-tab flat-tab-form widget-filter-search widget-box bg-surface">
											<div className="h7 title fw-7">Search</div>
											<ul className="nav-tab-form" role="tablist">
												<TabNav />
											</ul>
											<div className="tab-content">
												<div className="tab-pane fade active show" role="tabpanel">
													<div className="form-sl">
														<form method="post">
															<div className="wd-filter-select">
																<div className="inner-group inner-filter">
																	<div className="form-style">
																		<label className="title-select">Keyword</label>
																		<input type="text" className="form-control" placeholder="Search Keyword." name="s" title="Search for" required />
																	</div>
																	<div className="form-style">
																		<label className="title-select">Location</label>
																		<div className="group-ip ip-icon">
																			<input type="text" className="form-control" placeholder="Search Location" name="s" title="Search for" required />
																			<Link href="#" className="icon-right icon-location" />
																		</div>
																	</div>
																	<div className="form-style">
																		<label className="title-select">Type</label>
																		<div className="group-select">
																			<select className="nice-select">

																				<option data-value className="option selected">All</option>
																				<option data-value="villa" className="option">Villa</option>
																				<option data-value="studio" className="option">Studio</option>
																				<option data-value="office" className="option">Office</option>

																			</select>
																		</div>
																	</div>
																	<div className="form-style box-select">
																		<label className="title-select">Rooms</label>
																		<select className="nice-select">

																			<option data-value={2} className="option">1</option>
																			<option data-value={2} className="option selected">2</option>
																			<option data-value={3} className="option">3</option>
																			<option data-value={4} className="option">4</option>
																			<option data-value={5} className="option">5</option>
																			<option data-value={6} className="option">6</option>
																			<option data-value={7} className="option">7</option>
																			<option data-value={8} className="option">8</option>
																			<option data-value={9} className="option">9</option>
																			<option data-value={10} className="option">10</option>

																		</select>
																	</div>
																	<div className="form-style box-select">
																		<label className="title-select">Bathrooms</label>
																		<select className="nice-select">

																			<option data-value="all" className="option">All</option>
																			<option data-value={1} className="option">1</option>
																			<option data-value={2} className="option">2</option>
																			<option data-value={3} className="option">3</option>
																			<option data-value={4} className="option selected">4</option>
																			<option data-value={5} className="option">5</option>
																			<option data-value={6} className="option">6</option>
																			<option data-value={7} className="option">7</option>
																			<option data-value={8} className="option">8</option>
																			<option data-value={9} className="option">9</option>
																			<option data-value={10} className="option">10</option>
																		</select>
																	</div>
																	<div className="form-style box-select">
																		<label className="title-select">Bedrooms</label>
																		<select className="nice-select">

																			<option data-value={1} className="option">All</option>
																			<option data-value={1} className="option">1</option>
																			<option data-value={2} className="option">2</option>
																			<option data-value={3} className="option">3</option>
																			<option data-value={4} className="option selected">4</option>
																			<option data-value={5} className="option">5</option>
																			<option data-value={6} className="option">6</option>
																			<option data-value={7} className="option">7</option>
																			<option data-value={8} className="option">8</option>
																			<option data-value={9} className="option">9</option>
																			<option data-value={10} className="option">10</option>
																		</select>
																	</div>
																	<div className="form-style widget-price">
																		<RangeSlider />
																	</div>
																	<div className="form-style widget-price wd-price-2">
																		<RangeSlider />
																	</div>
																	<SidebarFilter />
																	<div className="form-style">
																		<button type="submit" className="tf-btn primary" href="#">Find Properties</button>
																	</div>
																</div>
															</div>
														</form>
													</div>
												</div>
											</div>
										</div>
										<div className="widget-box single-property-whychoose bg-surface">
											<div className="h7 title fw-7">Why Choose Us?</div>
											<ul className="box-whychoose">
												<li className="item-why">
													<i className="icon icon-secure" />
													Secure Booking
												</li>
												<li className="item-why">
													<i className="icon icon-guarantee" />
													Best Price Guarantee
												</li>
												<li className="item-why">
													<i className="icon icon-booking" />
													Easy Booking Process
												</li>
												<li className="item-why">
													<i className="icon icon-support" />
													Available Support 24/7
												</li>
											</ul>
										</div>
									</div>
								</div > */}
							</div >
						</div >
					</section >
					<section className="flat-section pt-0 flat-latest-property">
						<div className="container">
							<div className="box-title">
								<div className="text-subtitle text-primary">Featured properties</div>
								<h4 className="mt-4">The Most Recent Estate</h4>
							</div>
							<div className="swiper tf-latest-property" data-preview-lg={3} data-preview-md={2} data-preview-sm={2} data-space={30} data-loop="true">
								<Swiper {...swiperOptions2} className="swiper-wrapper">
									<SwiperSlide>
										<div className="homeya-box style-2">
											<div className="archive-top">
												<Link href="#" className="images-group">
													<div className="images-style">
														<img src="/images/home/house-4.jpg" alt="img" />
													</div>
													<div className="top">
														<ul className="d-flex gap-8">
															<li className="flag-tag success">Featured</li>
															<li className="flag-tag style-1">For Sale</li>
														</ul>
														<ul className="d-flex gap-4">
															<li className="box-icon w-32">
																<span className="icon icon-arrLeftRight" />
															</li>
															<li className="box-icon w-32">
																<span className="icon icon-heart" />
															</li>
															<li className="box-icon w-32">
																<span className="icon icon-eye" />
															</li>
														</ul>
													</div>
													<div className="bottom">
														<span className="flag-tag style-2">House</span>
													</div>
												</Link>
												<div className="content">
													<div className="h7 text-capitalize fw-7"><Link href="#" className="link"> Sunset Heights Estate, Beverly Hills</Link></div>
													<div className="desc"><i className="fs-16 icon icon-mapPin" /><p>1040 Ocean, Santa Monica, California</p> </div>
													<ul className="meta-list">
														<li className="item">
															<i className="icon icon-bed" />
															<span>3</span>
														</li>
														<li className="item">
															<i className="icon icon-bathtub" />
															<span>2</span>
														</li>
														<li className="item">
															<i className="icon icon-ruler" />
															<span>600 SqMeter</span>
														</li>
													</ul>
												</div>
											</div>
											<div className="archive-bottom d-flex justify-content-between align-items-center">
												<div className="d-flex gap-8 align-items-center">
													<div className="avatar avt-40 round">
														<img src="/images/avatar/avt-8.jpg" alt="avt" />
													</div>
													<span>Jacob Jones</span>
												</div>
												<div className="d-flex align-items-center">
													<h6>$250,00</h6>
													<span className="text-variant-1">/month</span>
												</div>
											</div>
										</div>
									</SwiperSlide>
									<SwiperSlide>
										<div className="homeya-box style-2">
											<div className="archive-top">
												<Link href="#" className="images-group">
													<div className="images-style">
														<img src="/images/home/house-5.jpg" alt="img" />
													</div>
													<div className="top">
														<ul className="d-flex gap-8">
															<li className="flag-tag success">Featured</li>
															<li className="flag-tag style-1">For Sale</li>
														</ul>
														<ul className="d-flex gap-4">
															<li className="box-icon w-32">
																<span className="icon icon-arrLeftRight" />
															</li>
															<li className="box-icon w-32">
																<span className="icon icon-heart" />
															</li>
															<li className="box-icon w-32">
																<span className="icon icon-eye" />
															</li>
														</ul>
													</div>
													<div className="bottom">
														<span className="flag-tag style-2">Office</span>
													</div>
												</Link>
												<div className="content">
													<div className="h7 text-capitalize fw-7"><Link href="#" className="link">Coastal Serenity Cottage</Link></div>
													<div className="desc"><i className="fs-16 icon icon-mapPin" /><p>21 Hillside Drive, Beverly Hills, California</p> </div>
													<ul className="meta-list">
														<li className="item">
															<i className="icon icon-bed" />
															<span>4</span>
														</li>
														<li className="item">
															<i className="icon icon-bathtub" />
															<span>2</span>
														</li>
														<li className="item">
															<i className="icon icon-ruler" />
															<span>600 SqMeter</span>
														</li>
													</ul>
												</div>
											</div>
											<div className="archive-bottom d-flex justify-content-between align-items-center">
												<div className="d-flex gap-8 align-items-center">
													<div className="avatar avt-40 round">
														<img src="/images/avatar/avt-6.jpg" alt="avt" />
													</div>
													<span>Kathryn Murphy</span>
												</div>
												<div className="d-flex align-items-center">
													<h6>$2050,00</h6>
													<span className="text-variant-1">/SqMeter</span>
												</div>
											</div>
										</div>
									</SwiperSlide>
									<SwiperSlide>
										<div className="homeya-box style-2">
											<div className="archive-top">
												<Link href="#" className="images-group">
													<div className="images-style">
														<img src="/images/home/house-6.jpg" alt="img" />
													</div>
													<div className="top">
														<ul className="d-flex gap-8">
															<li className="flag-tag success">Featured</li>
															<li className="flag-tag style-1">For Sale</li>
														</ul>
														<ul className="d-flex gap-4">
															<li className="box-icon w-32">
																<span className="icon icon-arrLeftRight" />
															</li>
															<li className="box-icon w-32">
																<span className="icon icon-heart" />
															</li>
															<li className="box-icon w-32">
																<span className="icon icon-eye" />
															</li>
														</ul>
													</div>
													<div className="bottom">
														<span className="flag-tag style-2">Studio</span>
													</div>
												</Link>
												<div className="content">
													<div className="h7 text-capitalize fw-7"><Link href="#" className="link">Lakeview Haven, Lake Tahoe</Link></div>
													<div className="desc"><i className="fs-16 icon icon-mapPin" /><p>8 Broadway, Brooklyn, New York</p> </div>
													<ul className="meta-list">
														<li className="item">
															<i className="icon icon-bed" />
															<span>2</span>
														</li>
														<li className="item">
															<i className="icon icon-bathtub" />
															<span>2</span>
														</li>
														<li className="item">
															<i className="icon icon-ruler" />
															<span>600 SqMeter</span>
														</li>
													</ul>
												</div>
											</div>
											<div className="archive-bottom d-flex justify-content-between align-items-center">
												<div className="d-flex gap-8 align-items-center">
													<div className="avatar avt-40 round">
														<img src="/images/avatar/avt-10.jpg" alt="avt" />
													</div>
													<span>Floyd Miles</span>
												</div>
												<div className="d-flex align-items-center">
													<h6>$250,00</h6>
													<span className="text-variant-1">/month</span>
												</div>
											</div>
										</div>
									</SwiperSlide>
									<SwiperSlide>
										<div className="homeya-box style-2">
											<div className="archive-top">
												<Link href="#" className="images-group">
													<div className="images-style">
														<img src="/images/home/house-1.jpg" alt="img" />
													</div>
													<div className="top">
														<ul className="d-flex gap-8">
															<li className="flag-tag success">Featured</li>
															<li className="flag-tag style-1">For Sale</li>
														</ul>
														<ul className="d-flex gap-4">
															<li className="box-icon w-32">
																<span className="icon icon-arrLeftRight" />
															</li>
															<li className="box-icon w-32">
																<span className="icon icon-heart" />
															</li>
															<li className="box-icon w-32">
																<span className="icon icon-eye" />
															</li>
														</ul>
													</div>
													<div className="bottom">
														<span className="flag-tag style-2">Studio</span>
													</div>
												</Link>
												<div className="content">
													<div className="h7 text-capitalize fw-7"><Link href="#" className="link"> Casa Lomas de Machalí Machas</Link></div>
													<div className="desc"><i className="fs-16 icon icon-mapPin" /><p>33 Maple Street, San Francisco, California</p> </div>
													<ul className="meta-list">
														<li className="item">
															<i className="icon icon-bed" />
															<span>3</span>
														</li>
														<li className="item">
															<i className="icon icon-bathtub" />
															<span>2</span>
														</li>
														<li className="item">
															<i className="icon icon-ruler" />
															<span>600 SqMeter</span>
														</li>
													</ul>
												</div>
											</div>
											<div className="archive-bottom d-flex justify-content-between align-items-center">
												<div className="d-flex gap-8 align-items-center">
													<div className="avatar avt-40 round">
														<img src="/images/avatar/avt-6.jpg" alt="avt" />
													</div>
													<span>Arlene McCoy</span>
												</div>
												<div className="d-flex align-items-center">
													<h6>$7250,00</h6>
													<span className="text-variant-1">/SqMeter</span>
												</div>
											</div>
										</div>
									</SwiperSlide>
								</Swiper>
							</div>
						</div>
					</section>
				</div >

			</Layout >
		</>
	)
}