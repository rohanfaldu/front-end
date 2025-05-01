'use client'
import PropertyMap from "@/components/elements/PropertyMap"
import RangeSlider from "@/components/elements/RangeSlider"
import SidebarFilter from "@/components/elements/SidebarFilter"
import TabNav from "@/components/elements/TabNav"
import { getData } from "../../components/api/Helper";
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import React, { useEffect, useState } from 'react';
import ReactSlider from "react-slider"
import { useTranslation } from "react-i18next";
const { defaultImage } = "/images/banner/no-banner.png";
import Preloader from "@/components/elements/Preloader";
import variablesList from "@/components/common/Variable";
import debounce from "lodash.debounce";

export default function AgencyListing() {
	const [isToggled, setToggled] = useState(false)
	const handleToggle = () => setToggled(!isToggled)

	const [initialMaxPrice, setInitialMaxPrice] = useState(0); // Store the maximum price initially
	const [maxPriceSliderRange, setMaxPriceSliderRange] = useState(0); // Dynamic slider range
	const [priceRange, setPriceRange] = useState([]); // Selected range
	const [isTab, setIsTab] = useState(2)
	const handleTab = (i) => {
		setIsTab(i)
	}
	const { t } = useTranslation();
	const [agencyList, setAgencyList] = useState([]); // Store properties for the current page
	const [loading, setLoading] = useState(true); // Manage loading state
	const [error, setError] = useState(null); // Manage error state
	const [searchTerm, setSearchTerm] = useState(''); // Store search input
	const [statusFilter, setStatusFilter] = useState(''); // Store selected status filter
	const [amenities, setAmenities] = useState([]);
	const [cities, setCities] = useState([]); // City options
	const [districts, setDistricts] = useState([]); // District options
	const [neighbourhoods, setNeighbourhoods] = useState([]);
	const [searchCity, setSearchCity] = useState('');
	const [cityOptions, setCityOptions] = useState([]);
	const [pagination, setPagination] = useState({
		totalCount: 0,
		totalPages: 0,
		currentPage: variablesList.currentPage,
		itemsPerPage: 9,
	}); // Track pagination info
	const [filters, setFilters] = useState({
		title: '',
		description: '',
		city: '',
		neighbourhood: '',
		minPrice: priceRange[0],
		maxPrice: priceRange[1],
		amenities_id: [],
	});
	const [seachAccordion, setSeachAccordion] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const handleInputChange = (e) => {
		// console.log(e,"lllllllllllll")
		setSearchTerm(e.target.value);
		setSearchCity(e.target.value)
		if (e.target.name === "city" && e.target.value.trim() === "") {
			setFilters((prevFilters) => ({ ...prevFilters, city: "" }));
		}
	};

	const fetchCityOptions = debounce(async (value, page = 1) => {
		if (value.trim() === "") {
			setCityOptions([]);
			return;
		}
		try {
			const requestData = {
				page,
				limit: pagination.itemsPerPage,
				city_name: value
			};
			const response = await getData("api/city", requestData, true);
			setCityOptions(response.data.cities);
		} catch (error) {
			console.error("Error fetching cities:", error);
		}
	}, 300);


	useEffect(() => {
		fetchCityOptions(searchTerm);
	}, [searchTerm]);

	const handleSubmit = async (page = pagination.currentPage) => {
		setLoading(true);
		try {
			// Set the filters to the updated filters, defaulting to empty values if not provided
			const requestData = {
				page,
				limit: pagination.itemsPerPage,
				city_id: filters.city,
				user_name: filters.title,
			};
			// console.log(requestData);
			const response = await getData("api/agencies", requestData, true);
			// console.log(response);
			if (response.status) {
				const { list, totalCount, totalPages, currentPage, project_meta_details, maxPriceSliderRange, cities } = response.data;
				setAgencyList(list);
				setPagination({
					...pagination,
					totalCount,
					totalPages,
					currentPage: list.length === 0 ? 1 : currentPage,
				});
				setAmenities(project_meta_details || []);
				setCities(cities);
				if (!initialMaxPrice) { // Only set once
					setInitialMaxPrice(maxPriceSliderRange || 0); // Store the maximum price initially
					setMaxPriceSliderRange(maxPriceSliderRange || 0); // Set slider max value
					setPriceRange([0, maxPriceSliderRange || 0]);    // Default slider range
				}
				setError(null);
			}
		} catch (err) {
			setError(err.response?.data?.message || "An error occurred");
		} finally {
			setLoading(false);
		}
	};


	// Handle Filter Changes
	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilters((prevFilters) => ({
			...prevFilters,
			[name]: value,
			...(name === "city" && { district_id: "", neighbourhood_id: "" }),
			...(name === "district" && { neighbourhood_id: "" }),
		}));
	};

	useEffect(() => {
		handleSubmit(pagination.currentPage);
		const checkViewport = () => {
			setIsMobile((window.innerWidth < 768) ? true : false);
			if (window.innerWidth < 768) {
				setSeachAccordion(false);
			} else {
				console.log(213);
				setSeachAccordion(true);
			}
		};
		checkViewport();
	}, [pagination.currentPage]);

	const handlePageChange = (page) => {
		setPagination({ ...pagination, currentPage: page });
	};


	const handleCitySelect = (cityId, cityName, latitude, longitude) => {
		setSearchCity(cityName); // Set the selected city name in the input
		handleFilterChange({ target: { name: 'city', value: cityId } }); // Call filter change with selected city ID
	};

	const handlePriceChange = (newRange) => {
		setPriceRange(newRange); // Update the range state
		setFilters((prevFilters) => ({
			...prevFilters,
			minPrice: newRange[0], // Set minPrice
			maxPrice: newRange[1], // Set maxPrice
		}));
	};
	const handlesearchAccordion = (status) => {
		const updateStatus = (status) ? false : true;
		setSeachAccordion(updateStatus);
	}
	// console.log('>>>>>>>>agencyList', agencyList);
	return (
		<>

			<Layout headerStyle={1} footerStyle={1}>
				<section className="wrapper-layout-3 agency user-inner-sec">
					{isMobile && (
						<div className="accordion-section">
							<button
								onClick={() => handlesearchAccordion(seachAccordion)}
								className="accordion-button"
							>
								<span className="h7 title fw-7">{t("search")}</span>
								<span className="arrow-icon">
									<img
										src="/images/avatar/down-arrow.svg"
										alt="Arrow Icon"
										className={seachAccordion ? 'rotated' : ''}
										width="20"
										height="20"
									/>
								</span>
							</button>
						</div>
					)}
					{seachAccordion && (
						<div className="wrap-sidebar">
							<div className="flat-tab flat-tab-form widget-filter-search">
								<div className="h7 title fw-7 search-text">{t("search")}</div>
								<div className="tab-content">
									<div className="tab-pane fade active show" role="tabpanel">
										<div className="form-sl">
											{/* <form method="post" onSubmit={(e) => { e.preventDefault(); applyFilters(); }}> */}
											<form method="post" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
												<div className="wd-filter-select">
													<div className="inner-group inner-filter">
														<div className="form-style">
															<label className="title-select">{t("titleAgency")}</label>
															<input
																type="text"
																className="form-control"
																value={filters.title}
																onChange={handleFilterChange}
																name="title"
																placeholder={t("searchtitle")}
															/>
														</div>
														<div className="form-style">
															<label className="title-select">{t("city")}</label>
															<input
																type="text"
																className="form-control"
																id="city"
																name="city"
																value={searchCity}
																onChange={handleInputChange}
																placeholder={t("searchCity")}
															/>
															{searchTerm.length > 0 && (
																cityOptions.length > 0 && (
																	<ul className="city-dropdown form-style" style={{ marginTop: "0px" }}>
																		{cityOptions.map((city) => (
																			<li
																				key={city.id}
																				onClick={() => {
																					handleCitySelect(city.id, city.city_name);
																					setSearchTerm('');
																				}}
																				className="city-option"
																			>
																				{city.city_name}
																			</li>
																		))}
																	</ul>
																)
															)}
														</div>

														{/* <div className="form-btn-fixed">
														<button className="tf-btn primary" href="#">{t("findagency")}</button>
													</div> */}
													</div>
													<div className="form-btn-fixed d-flex" >
														<button
															type="submit"
															className="tf-btn primary"
														>
															{t("findagency")}
														</button>
													</div>
												</div>
											</form>
										</div>
									</div>
								</div >
							</div >
						</div >
					)}
					<div className="wrap-inner-55">
						<div className="box-title-listing style-1">
							<h5>{t("agencylisting")}</h5>
						</div>
						<div className="tab-content">

							{loading ? (
								<Preloader />
							) : error ? (
								<p>{error}</p>
							) : agencyList.length === 0 ? (
								<div style={{ textAlign: "center" }}>
									<img src="/images/not-found/item-not-found.png" alt="No projects found" style={{ height: "300px" }} />
								</div>
							) : (
								<div className="row">
									{agencyList.map((agencyUserData) => (
										<div className="col-md-4" key={agencyUserData.id}>
											<div className="homeya-box">
												<div className="archive-top">
													<Link
														href={`/agency/${agencyUserData.slug}`}
														className="images-group"
													>

														<div className="images-style">
															<img
																src={agencyUserData.image || "/images/banner/no-banner.png"}
																alt={agencyUserData.name}
															/>
														</div>
														<div className="top">

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
															<span className="flag-tag style-2">
																{/* {agencyUserData.meta_details?.propertyType || 'Studio'} */}
															</span>
														</div>
													</Link>
													<div className="content user-listing-sec">
														<div className="h7 text-capitalize fw-7">
															<Link
																href={`/agency/${agencyUserData.slug}`}// Pass ID as query param
																className="link"
															>
																{agencyUserData.user_name}
															</Link>
														</div>
														<div className="desc">
															<i className="fs-16 icon icon-mapPin" />
															<p>{[agencyUserData?.city]
																.filter(Boolean)
																.join(', ')} </p>
														</div>
														<div className="user-social-icons">
															<ul className="info-box">
																{agencyUserData.facebook_link ? (
																	<li className="item">
																		<Link target="_blank" href={agencyUserData.facebook_link} className="box-icon w-52"><i className="icon icon-facebook" /></Link>
																	</li>
																) : ''}
																{/* {agencyUserData.twitter_link ? (
																	<li className="item">
																		<Link target="_blank" href={agencyUserData.twitter_link} className="box-icon w-52"><i className="icon icon-twitter" /></Link>
																	</li>
																) : ''} */}
																{agencyUserData.youtube_link ? (
																	<li className="item">
																		<Link target="_blank" href={agencyUserData.youtube_link} className="box-icon w-52"><i className="icon icon-youtube" /></Link>
																	</li>
																) : ''}
																{/* {agencyUserData.pinterest_link ? (
																	<li className="item">
																		<Link target="_blank" href={agencyUserData.pinterest_link} className="box-icon w-52"><i className="icon icon-pinterest" /></Link>
																	</li>
																) : ''} */}
																{agencyUserData.linkedin_link ? (
																	<li className="item">
																		<Link target="_blank" href={agencyUserData.linkedin_link} className="box-icon w-52"><i className="icon icon-linkedin" /></Link>
																	</li>
																) : ''}
																{agencyUserData.instagram_link ? (
																	<li className="item">
																		<Link target="_blank" href={agencyUserData.instagram_link} className="box-icon w-52"><i className="icon icon-instagram" /></Link>
																	</li>
																) : ''}
															</ul>
														</div>
														{/* <ul className="meta-list">
															<li className="item">
																<i className="icon icon-bed" />
																<span>{agencyUserData.meta_details?.bedrooms || 0}</span>
															</li>
															<li className="item">
																<i className="icon icon-bathtub" />
																<span>{agencyUserData.meta_details?.bathrooms || 0}</span>
															</li>
															<li className="item">
																<i className="icon icon-ruler" />
																<span>
																	{agencyUserData.meta_details?.size || '0'} SqFT
																</span>
															</li>
														</ul> */}
													</div>
												</div>
												{/* <div className="archive-bottom d-flex justify-content-between align-items-center">
													<div className="d-flex gap-8 align-items-center">
														<div className="avatar avt-40 round">
															<img
																src={agencyUserData.user_image || '/images/avatar/user-image.png'}
																alt={agencyUserData.agent?.name || 'Agent'}
															/>
														</div>
														<span>{agencyUserData.user_name || 'Unknown Agent'}</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>{t('from')} {agencyUserData.price || '0.00'} {agencyUserData.currency || 'USD'} </h6>
													</div>
												</div> */}
											</div>
										</div>
									))}
								</div>
							)}

						</div>
						<ul className="wd-navigation">
							{Array.from({ length: pagination.totalPages }, (_, index) => (
								<li key={index}>
									<Link
										href="#"
										className={`nav-item ${pagination.currentPage === index + 1 ? 'active' : ''}`}
										onClick={() => handlePageChange(index + 1)}
									>
										{index + 1}
									</Link>
								</li>
							))}
						</ul>
					</div >

				</section >

			</Layout >
		</>
	)
}