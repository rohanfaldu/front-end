'use client'
import Link from "next/link"
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Preloader from "../elements/Preloader";
import { getData } from "../api/Helper";
import { useTranslation } from "react-i18next";
/*import userImage from "../../public/images/avatar/user.png";*/
export default function Recommended1() {
	const [isTab, setIsTab] = useState(1)
	const [isVisible, setIsVisible] = useState(true)
	
	const [properties, setProperties] = useState(null); // To store fetched data
 	const [loading, setLoading] = useState(true); // To manage loading state
  	const [error, setError] = useState(null); // To manage error state
	const { t, i18n } = useTranslation();
  	useEffect(() => {
		const fetchData = async () => {
			try {
				const lang = i18n.language;
				const propertyObj = {page: 1, limit: 10, lang: lang};
				const response = await getData('api/property/', propertyObj);
				console.log('response');
				console.log(response.data.list);
				setProperties(response.data.list); // Save data to state
				setLoading(false); // Stop loading
				setError(null);
			} catch (err) {
				setError(err.response?.data?.message || 'An error occurred'); // Handle error
				setLoading(false); // Stop loading
			}
		};

		fetchData(); // Fetch data on component mount
	}, [i18n.language]); // Empty dependency array ensures this runs only once on mount

	if (loading) return <p>Loading...</p>; // Show loading message
  	if (error) return <p>Error: {error}</p>; 
	console.log(properties);
	const handleTab = (i) => {
		setIsTab(i)
		setIsVisible(false)
		setTimeout(() => {
			setIsVisible(true)
		}, 200)
	}
	return (
		<>
			{loading? 
				<Preloader /> 
			: 
			<>
				<section className="flat-section flat-recommended">
					<div className="container">
						<div className="text-center wow fadeInUpSmall" data-wow-delay=".2s" data-wow-duration="2000ms">
							<div className="text-subtitle text-primary">{t("featuredproperties")}</div>
							<h4 className="mt-4">{t("recommendedforyou")}</h4>
						</div>
						<div className="flat-tab-recommended wow fadeInUpSmall" data-wow-delay=".2s" data-wow-duration="2000ms">
							<ul className="nav-tab-recommended justify-content-center" role="tablist">
								<li className="nav-tab-item" onClick={() => handleTab(1)}>
									<a className={isTab == 1 ? "nav-link-item active" : "nav-link-item"} data-bs-toggle="tab">{t("viewall")}</a>
								</li>
								<li className="nav-tab-item" onClick={() => handleTab(2)}>
									<a className={isTab == 2 ? "nav-link-item active" : "nav-link-item"} data-bs-toggle="tab">{t("appartment")}</a>
								</li>
								<li className="nav-tab-item" onClick={() => handleTab(3)}>
									<a className={isTab == 3 ? "nav-link-item active" : "nav-link-item"} data-bs-toggle="tab">{t("villa")}</a>
								</li>
								<li className="nav-tab-item" onClick={() => handleTab(4)}>
									<a className={isTab == 4 ? "nav-link-item active" : "nav-link-item"} data-bs-toggle="tab">{t("studio")}</a>
								</li>
								<li className="nav-tab-item" onClick={() => handleTab(5)}>
									<a className={isTab == 5 ? "nav-link-item active" : "nav-link-item"} data-bs-toggle="tab">{t("house")}</a>
								</li>
								<li className="nav-tab-item" onClick={() => handleTab(6)}>
									<a className={isTab == 6 ? "nav-link-item active" : "nav-link-item"} data-bs-toggle="tab">{t("office")}</a>
								</li>
							</ul>
							<div className="tab-content">
								<div style={{ opacity: isVisible ? 1 : 0 }} className={isTab == 1 ? "tab-pane fade show active" : "tab-pane fade"} id="viewAll" role="tabpanel">
									<div className="row">
										{properties.map((property) => (
											<div key={property.id} className="col-xl-4 col-lg-6 col-md-6">
												<div className="homeya-box">
													<div className="archive-top">
														<Link href={`/property/${property.id}`} className="images-group">
															<div className="images-style">
																<img src={property.picture[0]}  alt="Property"/>
																{/* <img src="https://staging.immofind.ma/images/banner/banner-property-1.jpg" alt="Property" /> */}
															</div>
															<div className="top">
																{property.transaction ? (
																	<>
																		<ul className="d-flex gap-8">
																			<li className={`flag-tag style-1}`}>
																				{property.transaction}
																			</li>
																		</ul>
																	</>
																):(<></>)}
																
																{/* <ul className="d-flex gap-4">
																	<li className="box-icon w-32">
																	<span className="icon icon-arrLeftRight" />
																	</li>
																	<li className="box-icon w-32">
																	<span className="icon icon-heart" />
																	</li>
																	<li className="box-icon w-32">
																	<span className="icon icon-eye" />
																	</li>
																</ul> */}
															</div>
															<div className="bottom">
																<span className="flag-tag style-2">{property.type}</span>
															</div>
														</Link>
														<div className="content">
															<div className="h7 text-capitalize fw-7">
																<Link href={`/property/${property.id}`} className="link">
																	{property.title}
																</Link>
															</div>
															{/* <div className="desc">
																<i className="fs-16 icon icon-mapPin" />
																<p>{property.location}</p>
															</div> */}
															<ul className="meta-list">
																<li className="item">
																	<i className="icon icon-bed" />
																	<span>{property.bedRooms === 0 ? '-': `${property.bedRooms} Bedroom`}</span>
																</li>
																{/* <li className="item">
																	<i className="icon icon-bathtub" />
																	<span>{property.bathRooms === 0 ? '-': `${property.bathRooms} Bathroom`}</span>
																</li> */}
																<li className="item">
																	<i className="icon icon-ruler" />
																	<span>{property.size === null ? '-': `${property.size} SqMeter`}</span>
																</li>
															</ul>
														</div>
													</div>
													<div className="archive-bottom d-flex justify-content-between align-items-center">
														<div className="d-flex gap-8 align-items-center">
															<div className="avatar avt-40 round">
																<img src={property.user_image} alt="Owner Avatar" />
															</div>
															<span>{property.user_name}</span>
														</div>
														<div className="d-flex align-items-center">
															<h6>{property.price} {property.currency}</h6>
															{/* <span className="text-variant-1">{property.price.unit}</span> */}
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
									<div className="text-center">
										<Link href="#" className="tf-btn primary size-1">{t("viewallproperties")}</Link>
									</div>
								</div>
								<div style={{ opacity: isVisible ? 1 : 0 }} className={isTab == 2 ? "tab-pane fade show active" : "tab-pane fade"} id="apartment" role="tabpanel">
									<div className="row">
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v1" className="images-group">
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
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v1" className="link"> Casa Lomas de Machalí Machas</Link></div>
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
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v1" className="images-group">
														<div className="images-style">
															<img src="/images/home/house-2.jpg" alt="img" />
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
															<span className="flag-tag style-2">Apartment</span>
														</div>
													</Link>
													<div className="content">
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v1" className="link">Villa del Mar Retreat, Malibu</Link></div>
														<div className="desc"><i className="fs-16 icon icon-mapPin" /><p>72 Sunset Avenue, Los Angeles, California</p> </div>
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
															<img src="/images/avatar/avt-7.jpg" alt="avt" />
														</div>
														<span>Annette Black</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>$250,00</h6>
														<span className="text-variant-1">/month</span>
													</div>
												</div>
											</div>
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v2" className="images-group">
														<div className="images-style">
															<img src="/images/home/house-3.jpg" alt="img" />
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
															<span className="flag-tag style-2">Villa</span>
														</div>
													</Link>
													<div className="content">
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v2" className="link">Rancho Vista Verde, Santa Barbara</Link></div>
														<div className="desc"><i className="fs-16 icon icon-mapPin" /><p>33 Maple Street, San Francisco, California</p> </div>
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
															<img src="/images/avatar/avt-5.jpg" alt="avt" />
														</div>
														<span>Ralph Edwards</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>$5050,00</h6>
														<span className="text-variant-1">/SqMeter</span>
													</div>
												</div>
											</div>
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v3" className="images-group">
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
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v3" className="link">Sunset Heights Estate, Beverly Hills</Link></div>
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
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v4" className="images-group">
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
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v4" className="link">Coastal Serenity Cottage</Link></div>
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
															<img src="/images/avatar/avt-9.jpg" alt="avt" />
														</div>
														<span>Kathryn Murphy</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>$7250,00</h6>
														<span className="text-variant-1">/SqMeter</span>
													</div>
												</div>
											</div>
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v1" className="images-group">
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
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v1" className="link">Lakeview Haven, Lake Tahoe</Link></div>
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
															<img src="/images/avatar/avt-6.jpg" alt="avt" />
														</div>
														<span>Floyd Miles</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>$250,00</h6>
														<span className="text-variant-1">/SqMeter</span>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="text-center">
										<Link href="#" className="tf-btn primary size-1">View All Properties</Link>
									</div>
								</div>
								<div style={{ opacity: isVisible ? 1 : 0 }} className={isTab == 3 ? "tab-pane fade show active" : "tab-pane fade"} id="villa" role="tabpanel">
									<div className="row">
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v2" className="images-group">
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
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v2" className="link"> Casa Lomas de Machalí Machas</Link></div>
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
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v3" className="images-group">
														<div className="images-style">
															<img src="/images/home/house-2.jpg" alt="img" />
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
															<span className="flag-tag style-2">Apartment</span>
														</div>
													</Link>
													<div className="content">
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v3" className="link">Villa del Mar Retreat, Malibu</Link></div>
														<div className="desc"><i className="fs-16 icon icon-mapPin" /><p>72 Sunset Avenue, Los Angeles, California</p> </div>
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
															<img src="/images/avatar/avt-7.jpg" alt="avt" />
														</div>
														<span>Annette Black</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>$250,00</h6>
														<span className="text-variant-1">/month</span>
													</div>
												</div>
											</div>
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v2" className="images-group">
														<div className="images-style">
															<img src="/images/home/house-3.jpg" alt="img" />
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
															<span className="flag-tag style-2">Villa</span>
														</div>
													</Link>
													<div className="content">
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v2" className="link">Rancho Vista Verde, Santa Barbara</Link></div>
														<div className="desc"><i className="fs-16 icon icon-mapPin" /><p>33 Maple Street, San Francisco, California</p> </div>
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
															<img src="/images/avatar/avt-5.jpg" alt="avt" />
														</div>
														<span>Ralph Edwards</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>$5050,00</h6>
														<span className="text-variant-1">/SqMeter</span>
													</div>
												</div>
											</div>
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v3" className="images-group">
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
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v3" className="link">Sunset Heights Estate, Beverly Hills</Link></div>
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
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v1" className="images-group">
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
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v1" className="link">Coastal Serenity Cottage</Link></div>
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
															<img src="/images/avatar/avt-9.jpg" alt="avt" />
														</div>
														<span>Kathryn Murphy</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>$7250,00</h6>
														<span className="text-variant-1">/SqMeter</span>
													</div>
												</div>
											</div>
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v2" className="images-group">
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
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v2" className="link">Lakeview Haven, Lake Tahoe</Link></div>
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
															<img src="/images/avatar/avt-6.jpg" alt="avt" />
														</div>
														<span>Floyd Miles</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>$250,00</h6>
														<span className="text-variant-1">/SqMeter</span>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="text-center">
										<Link href="#" className="tf-btn primary size-1">View All Properties</Link>
									</div>
								</div>
								<div style={{ opacity: isVisible ? 1 : 0 }} className={isTab == 4 ? "tab-pane fade show active" : "tab-pane fade"} id="studio" role="tabpanel">
									<div className="row">
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v1" className="images-group">
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
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v1" className="link"> Casa Lomas de Machalí Machas</Link></div>
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
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v1" className="images-group">
														<div className="images-style">
															<img src="/images/home/house-2.jpg" alt="img" />
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
															<span className="flag-tag style-2">Apartment</span>
														</div>
													</Link>
													<div className="content">
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v1" className="link">Villa del Mar Retreat, Malibu</Link></div>
														<div className="desc"><i className="fs-16 icon icon-mapPin" /><p>72 Sunset Avenue, Los Angeles, California</p> </div>
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
															<img src="/images/avatar/avt-7.jpg" alt="avt" />
														</div>
														<span>Annette Black</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>$250,00</h6>
														<span className="text-variant-1">/month</span>
													</div>
												</div>
											</div>
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v2" className="images-group">
														<div className="images-style">
															<img src="/images/home/house-3.jpg" alt="img" />
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
															<span className="flag-tag style-2">Villa</span>
														</div>
													</Link>
													<div className="content">
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v2" className="link">Rancho Vista Verde, Santa Barbara</Link></div>
														<div className="desc"><i className="fs-16 icon icon-mapPin" /><p>33 Maple Street, San Francisco, California</p> </div>
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
															<img src="/images/avatar/avt-5.jpg" alt="avt" />
														</div>
														<span>Ralph Edwards</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>$5050,00</h6>
														<span className="text-variant-1">/SqMeter</span>
													</div>
												</div>
											</div>
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v3" className="images-group">
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
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v3" className="link">Sunset Heights Estate, Beverly Hills</Link></div>
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
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v4" className="images-group">
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
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v4" className="link">Coastal Serenity Cottage</Link></div>
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
															<img src="/images/avatar/avt-9.jpg" alt="avt" />
														</div>
														<span>Kathryn Murphy</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>$7250,00</h6>
														<span className="text-variant-1">/SqMeter</span>
													</div>
												</div>
											</div>
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v1" className="images-group">
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
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v1" className="link">Lakeview Haven, Lake Tahoe</Link></div>
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
															<img src="/images/avatar/avt-6.jpg" alt="avt" />
														</div>
														<span>Floyd Miles</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>$250,00</h6>
														<span className="text-variant-1">/SqMeter</span>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="text-center">
										<Link href="#" className="tf-btn primary size-1">1</Link>
									</div>
								</div>
								<div style={{ opacity: isVisible ? 1 : 0 }} className={isTab == 5 ? "tab-pane fade show active" : "tab-pane fade"} id="house" role="tabpanel">
									<div className="row">
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v2" className="images-group">
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
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v2" className="link"> Casa Lomas de Machalí Machas</Link></div>
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
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v3" className="images-group">
														<div className="images-style">
															<img src="/images/home/house-2.jpg" alt="img" />
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
															<span className="flag-tag style-2">Apartment</span>
														</div>
													</Link>
													<div className="content">
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v3" className="link">Villa del Mar Retreat, Malibu</Link></div>
														<div className="desc"><i className="fs-16 icon icon-mapPin" /><p>72 Sunset Avenue, Los Angeles, California</p> </div>
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
															<img src="/images/avatar/avt-7.jpg" alt="avt" />
														</div>
														<span>Annette Black</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>$250,00</h6>
														<span className="text-variant-1">/month</span>
													</div>
												</div>
											</div>
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v4" className="images-group">
														<div className="images-style">
															<img src="/images/home/house-3.jpg" alt="img" />
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
															<span className="flag-tag style-2">Villa</span>
														</div>
													</Link>
													<div className="content">
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v4" className="link">Rancho Vista Verde, Santa Barbara</Link></div>
														<div className="desc"><i className="fs-16 icon icon-mapPin" /><p>33 Maple Street, San Francisco, California</p> </div>
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
															<img src="/images/avatar/avt-5.jpg" alt="avt" />
														</div>
														<span>Ralph Edwards</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>$5050,00</h6>
														<span className="text-variant-1">/SqMeter</span>
													</div>
												</div>
											</div>
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v1" className="images-group">
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
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v1" className="link">Sunset Heights Estate, Beverly Hills</Link></div>
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
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v1" className="images-group">
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
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v1" className="link">Coastal Serenity Cottage</Link></div>
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
															<img src="/images/avatar/avt-9.jpg" alt="avt" />
														</div>
														<span>Kathryn Murphy</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>$7250,00</h6>
														<span className="text-variant-1">/SqMeter</span>
													</div>
												</div>
											</div>
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v1" className="images-group">
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
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v1" className="link">Lakeview Haven, Lake Tahoe</Link></div>
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
															<img src="/images/avatar/avt-6.jpg" alt="avt" />
														</div>
														<span>Floyd Miles</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>$250,00</h6>
														<span className="text-variant-1">/SqMeter</span>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="text-center">
										<Link href="#" className="tf-btn primary size-1">View All Properties</Link>
									</div>
								</div>
								<div style={{ opacity: isVisible ? 1 : 0 }} className={isTab == 6 ? "tab-pane fade show active" : "tab-pane fade"} id="office" role="tabpanel">
									<div className="row">
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v1" className="images-group">
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
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v1" className="link"> Casa Lomas de Machalí Machas</Link></div>
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
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v1" className="images-group">
														<div className="images-style">
															<img src="/images/home/house-2.jpg" alt="img" />
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
															<span className="flag-tag style-2">Apartment</span>
														</div>
													</Link>
													<div className="content">
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v1" className="link">Villa del Mar Retreat, Malibu</Link></div>
														<div className="desc"><i className="fs-16 icon icon-mapPin" /><p>72 Sunset Avenue, Los Angeles, California</p> </div>
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
															<img src="/images/avatar/avt-7.jpg" alt="avt" />
														</div>
														<span>Annette Black</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>$250,00</h6>
														<span className="text-variant-1">/month</span>
													</div>
												</div>
											</div>
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v2" className="images-group">
														<div className="images-style">
															<img src="/images/home/house-3.jpg" alt="img" />
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
															<span className="flag-tag style-2">Villa</span>
														</div>
													</Link>
													<div className="content">
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v2" className="link">Rancho Vista Verde, Santa Barbara</Link></div>
														<div className="desc"><i className="fs-16 icon icon-mapPin" /><p>33 Maple Street, San Francisco, California</p> </div>
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
															<img src="/images/avatar/avt-5.jpg" alt="avt" />
														</div>
														<span>Ralph Edwards</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>$5050,00</h6>
														<span className="text-variant-1">/SqMeter</span>
													</div>
												</div>
											</div>
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v3" className="images-group">
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
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v3" className="link">Sunset Heights Estate, Beverly Hills</Link></div>
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
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v4" className="images-group">
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
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v4" className="link">Coastal Serenity Cottage</Link></div>
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
															<img src="/images/avatar/avt-9.jpg" alt="avt" />
														</div>
														<span>Kathryn Murphy</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>$7250,00</h6>
														<span className="text-variant-1">/SqMeter</span>
													</div>
												</div>
											</div>
										</div>
										<div className="col-xl-4 col-lg-6 col-md-6">
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v1" className="images-group">
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
														<div className="h7 text-capitalize fw-7"><Link href="/property-details-v1" className="link">Lakeview Haven, Lake Tahoe</Link></div>
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
															<img src="/images/avatar/avt-6.jpg" alt="avt" />
														</div>
														<span>Floyd Miles</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>$250,00</h6>
														<span className="text-variant-1">/SqMeter</span>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="text-center">
										<Link href="#" className="tf-btn primary size-1">View All Properties</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</>
			}
		</>
	)
}