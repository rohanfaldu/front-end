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
import ProjectMap from "@/components/elements/ProjectMap"
import debounce from "lodash.debounce";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useRouter } from 'next/navigation';
import { formatPropertyPrice } from "@/components/common/Functions";
import { navigateTo } from '@/components/common/Functions';

export default function ProjectHalfmapList() {
	const [isToggled, setToggled] = useState(false)
	const handleToggle = () => setToggled(!isToggled)

	const [initialMaxPrice, setInitialMaxPrice] = useState(0); // Store the maximum price initially
	const [maxPriceSliderRange, setMaxPriceSliderRange] = useState(0); // Dynamic slider range
	const [priceRange, setPriceRange] = useState([]); // Selected range
	const [isTab, setIsTab] = useState(2)
	const handleTab = (i) => {
		setIsTab(i)
	}
	const { t, i18n } = useTranslation();
	const [projects, setProjects] = useState([]); // Store properties for the current page
	const [loading, setLoading] = useState(true); // Manage loading state
	const [error, setError] = useState(null); // Manage error state
	const [searchTerm, setSearchTerm] = useState(''); // Store search input
	const [searchTermDistrict, setSearchTermDistrict] = useState('');
	const [searchTermNeighbourhood, setSearchTermNeighbourhood] = useState('');
	const [searchNeighbourhood, setSearchNeighbourhood] = useState('');
	const [isSwitch, setIsSwitch] = useState(false);
	const router = useRouter();

	const [searchCity, setSearchCity] = useState('');
	const [cityOptions, setCityOptions] = useState([]);
	const [districtOptions, setDistrictOptions] = useState([]);
	const [neighbourhoodOptions, setNeighbourhoodOptions] = useState([]);
	const [searchDistrict, setSearchDistrict] = useState('');


	const [showDistrict, setShowDistrict] = useState(false);
	const [showNeighbourhood, setShowNeighbourhood] = useState(false);

	const [statusFilter, setStatusFilter] = useState(''); // Store selected status filter
	const [amenities, setAmenities] = useState([]);
	const [cities, setCities] = useState([]); // City options
	const [districts, setDistricts] = useState([]); // District options
	const [neighbourhoods, setNeighbourhoods] = useState([]);
	const [cityId, setCityId] = useState(['']);
	const [districtId, setDistrictId] = useState(['']);
	const [isFocused, setIsFocused] = useState(false);
	const [pagination, setPagination] = useState({
		totalCount: 0,
		totalPages: 1,
		currentPage: variablesList.currentPage,
		itemsPerPage: variablesList.itemsPerPage,
	}); // Track pagination info
	const [filters, setFilters] = useState({
		title: '',
		city: '',
		district: '',
		neighbourhood: '',
		minPrice: priceRange[0],
		maxPrice: priceRange[1],
		amenities_id_object_with_value: {},
		amenities_id_array: [],

	});
	const [seachAccordion, setSeachAccordion] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const lang = i18n.language;
	const [isPropertyViewMobile, setIsPropertyViewMobile] = useState(false);
	const [isPropertyViewMap, setIsPropertyViewMap] = useState(false);
	const [isDefaultPropertyViewMobile, setIsDefaultPropertyViewMobile] = useState(false);

	const fetchProjects = async (page = 1, updatedFilters = {}) => {
		setLoading(true);
		try {
			const lang = i18n.language;
			const requestData = {
				page,
				lang,
				limit: pagination.itemsPerPage,
				...updatedFilters, // Spread the updated filters only (dynamic fields)
			};

			const response = await getData("api/projects", requestData, true);
			if (response.status) {
				const { projects, totalCount, totalPages, currentPage, project_meta_details, maxPriceSliderRange, cities } = response.data;
				setProjects(projects);
				setPagination({
					...pagination,
					totalCount,
					totalPages,
					currentPage,
				});
				setFilters({
					...filters,
					minPrice: 0,
					maxPrice: maxPriceSliderRange,
				})
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


	const handleSubmit = async (page = pagination.currentPage) => {
		setLoading(true);

		const lang = i18n.language;
		const requestData = {
			page,
			lang,
			limit: pagination.itemsPerPage,
			title: filters.title,
			city_id: filters.city,
			district_id: filters.city,
			neighborhoods_id: filters.city,
			minPrice: filters.minPrice,
			maxPrice: filters.maxPrice,
			amenities_id_array: filters.amenities_id_array,
			amenities_id_object_with_value: filters.amenities_id_object_with_value,
		};
		const response = await getData("api/projects", requestData, true);
		if (response.status) {
			const { projects, totalCount, totalPages, currentPage, project_meta_details, maxPriceSliderRange, cities } = response.data;
			setProjects(projects);
			setPagination({
				...pagination,
				totalCount,
				totalPages,
				currentPage: projects.length === 0 ? 1 : currentPage,
			});
			setAmenities(project_meta_details || []);
			setCities(cities);
			if (!initialMaxPrice) { // Only set once
				setInitialMaxPrice(maxPriceSliderRange || 0); // Store the maximum price initially
				setMaxPriceSliderRange(maxPriceSliderRange || 0); // Set slider max value
				setPriceRange([0, maxPriceSliderRange || 0]);    // Default slider range
			}
			setError(null);
			setLoading(false);
			if (isMobile) {
				setIsPropertyViewMobile(true)
				setIsPropertyViewMap(false)
			}
		}
	};

	// Handle Filter Changes
	const handleFilterChange = async (e) => {
		const { name, value } = e.target;

		setFilters((prevFilters) => ({
			...prevFilters,
			[name]: value,
			...(name === "city" && { district_id: "", neighbourhood_id: "" }),
			...(name === "district" && { neighbourhood_id: "" }),
		}));

		if (name === "city") {
			setShowDistrict(false);
			setShowNeighbourhood(false);

			if (value) {
				setCityId(value);
				setShowDistrict(true);
			}
		}

		if (name === "district") {
			setShowNeighbourhood(false);

			if (value) {
				setDistrictId(value);
				setShowNeighbourhood(true);
			}
		}
	};


	useEffect(() => {
		handleSubmit(pagination.currentPage);
		const getSwitch = localStorage.getItem('switchProjectState');
		if (getSwitch !== null) {
			const IsSwitch = JSON.parse(getSwitch);
			setIsSwitch(IsSwitch);
		}
		const checkViewport = () => {
			const mobileView = (window.innerWidth < 769) ? true : false;
			setIsMobile((window.innerWidth < 769) ? true : false);
			if (!mobileView) {
				setSeachAccordion(true);
				setIsDefaultPropertyViewMobile(false);
				setIsPropertyViewMobile(true);
			} else {
				setSeachAccordion(false);
				setIsDefaultPropertyViewMobile(true);
				setIsPropertyViewMobile(true);
			}
		};
		checkViewport();

	}, [pagination.currentPage, i18n.language]);

	const handlePageChange = (page) => {
		setPagination({ ...pagination, currentPage: page });
	};

	const handlePriceChange = (newRange) => {
		setPriceRange(newRange); // Update the range state
		setFilters((prevFilters) => ({
			...prevFilters,
			minPrice: newRange[0], // Set minPrice
			maxPrice: newRange[1], // Set maxPrice
		}));
	};


	const fetchCityOptions = debounce(async (value, page = 1) => {
		if (value.trim() === "") {
			setCityOptions([]);
			return;
		}
		try {
			const lang = i18n.language;
			const requestData = {
				page,
				lang,
				limit: pagination.itemsPerPage,
				city_name: value
			};
			const response = await getData("api/city/getallcitydistrictneighborhoods", requestData, true);
			setCityOptions(response.data.list);
		} catch (error) {
			console.error("Error fetching cities:", error);
		}
	}, 300);

	const fetchDistrictOptions = debounce(async (value) => {
		if (value.trim() === "") {
			setDistrictOptions([]);
			return;
		}
		try {
			const lang = i18n.language;
			const requestData = {
				lang,
				city_id: cityId,
				district_name: value
			};
			const response = await getData("api/district/getbycity", requestData, true);
			setDistrictOptions(response.data);
		} catch (error) {
			console.error("Error fetching cities:", error);
		}
	}, 300);


	const fetchNeighbourhoodOptions = debounce(async (value) => {
		if (value.trim() === "") {
			setNeighbourhoodOptions([]);
			return;
		}
		try {
			const lang = i18n.language;
			const requestData = {
				lang,
				district_id: districtId,
				neighbourhood_name: value
			};
			const response = await getData("api/neighborhood/id", requestData, true);
			setNeighbourhoodOptions(response.data);
		} catch (error) {
			console.error("Error fetching cities:", error);
		}
	}, 300);


	useEffect(() => {
		fetchCityOptions(searchTerm);
		fetchDistrictOptions(searchTermDistrict)
		fetchNeighbourhoodOptions(searchTermNeighbourhood)
	}, [searchTerm, searchTermDistrict, searchTermNeighbourhood]);


	const handleInputChange = (e) => {
		setSearchTerm(e.target.value);
		setSearchCity(e.target.value)
	};
	const handleInputChangeDistrict = (e) => {
		setSearchTermDistrict(e.target.value);
		setSearchDistrict(e.target.value)
	}

	const handleInputChangeNeighbourhood = (e) => {
		setSearchTermNeighbourhood(e.target.value);
		setSearchNeighbourhood(e.target.value)
	}

	const handleCitySelect = (cityId, cityName, slug) => {
		setSearchCity(cityName); // Set the selected city name in the input
		handleFilterChange({ target: { name: 'city', value: cityId } }); // Call filter change with selected city ID
	};

	const handleDistrictSelect = (districtId, districtName, latitude, longitude) => {
		setSearchDistrict(districtName); // Set the selected city name in the input
		handleFilterChange({ target: { name: 'district', value: districtId } }); // Call filter change with selected city ID
	};

	const handleNeighbourhoodSelect = (neighbourhoodId, neighbourhoodName, latitude, longitude) => {
		setSearchNeighbourhood(neighbourhoodName); // Set the selected city name in the input
		handleFilterChange({ target: { name: 'neighbourhood', value: neighbourhoodId } }); // Call filter change with selected city ID
	};


	const handleNumberChange = (amenityId, value) => {
		setFilters((prevFilters) => ({
			...prevFilters,
			amenities_id_object_with_value: {
				...prevFilters.amenities_id_object_with_value,
				[amenityId]: value,
			},
		}));
	};

	const handleSwitchChange = (e) => {
		localStorage.setItem('switchProjectState', e.target.checked);
		setIsSwitch(e.target.checked);
	}
	const handleClick = (slug) => {
		localStorage.setItem('switchProjectState', JSON.stringify(isSwitch));
		router.push(`/project/${slug}`);
	};

	const handlesearchAccordion = (status) => {
		const updateStatus = (status) ? false : true;
		setSeachAccordion(updateStatus);
	}

	const handlePropertyview = () => {
		setIsPropertyViewMobile(true)
		setIsPropertyViewMap(false)
	}
	const handlePropertyMapview = (e) => {
		setIsPropertyViewMap(true)
		setIsPropertyViewMobile(false)
	}

	return (
		<>
			<Layout headerStyle={1} footerStyle={1}>
				<section className="wrapper-layout-3 project-sec">
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
						<form method="post" className="form-sec" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
							<div className="wrap-sidebar">
								<div className="flat-tab flat-tab-form widget-filter-search">
									<div className="h7 title fw-7 search-text">{t("search")}</div>

									<div className="tab-content">
										<div className="tab-pane fade active show" role="tabpanel">
											<div className="form-sl">
												<div className="wd-filter-select">
													<div className="inner-group inner-filter">
														<div className="form-style">
															<label className="title-select">{t("titleProject")}</label>
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
															<label className="title-select">{t("location")}</label>
															<input
																type="text"
																className="form-control"
																id="city"
																name="city"
																value={searchCity}
																onChange={handleInputChange}
																onFocus={() => {
																	setIsFocused(true);
																	if (!searchCity || searchCity.length === 0) {
																		setCityOptions([
																			{ id: 1, name: "Casablanca", slug: "casablanca" },
																			{ id: 2, name: "Rabat", slug: "rabat" },
																			{ id: 3, name: "Agadir", slug: "agadir" },
																			{ id: 4, name: "Tanger", slug: "tanger" },
																			{ id: 5, name: "Marrakech", slug: "marrakech" },
																			{ id: 6, name: "Fes", slug: "fes" }
																		]);
																	}
																}}
																onBlur={() => {
																	setTimeout(() => setIsFocused(false), 200);
																}}
																placeholder={t("searchCity")}
															/>
															{(searchTerm.length > 0 || isFocused) && (
																cityOptions.length > 0 && (
																	<ul className="city-dropdown form-style" style={{ marginTop: "0px", width: "100%", position: "relative" }}>
																		{cityOptions.map((city) => (
																			<li
																				key={city.id}
																				onClick={() => {
																					handleCitySelect(city.id, city.name, city.slug);
																					setSearchTerm('');
																					setIsFocused(false);
																				}}
																				className="city-option"
																			>
																				{city.name}
																			</li>
																		))}
																	</ul>
																)
															)}
														</div>
														<div className="form-style widget-price">
															<div className="group-form">
																<ReactSlider
																	ariaLabelledby="slider-label"
																	className="horizontal-slider st2"
																	min={0}
																	step={100}
																	max={initialMaxPrice}
																	value={priceRange} // Bind to state
																	thumbClassName="example-thumb"
																	trackClassName="example-track"
																	onChange={handlePriceChange} // Handle changes
																/>

																<div className="group-range-title mt-2">
																	<label className="d-flex justify-content-between mb-0">
																		<span>{(priceRange[0] !== undefined) ? (<span>{formatPropertyPrice(priceRange[0])} DH</span>) : null}</span>
																		<span>{(priceRange[1] !== undefined) ? (<span>{formatPropertyPrice(priceRange[1])} DH</span>) : null}</span>
																	</label>
																</div>
															</div>
														</div>

														<div className="form-style btn-show-advanced" onClick={handleToggle} style={{ display: `${isToggled ? "none" : "block"}` }}>
															<a className="filter-advanced pull-right">
																<span className="icon icon-faders" />
																<span className="text-advanced">{t("showadvance")}</span>
															</a>
														</div>
														<div className="form-style wd-amenities" style={{ display: `${isToggled ? "block" : "none"}` }}>
															<div className="group-checkbox">
																<div className="group-amenities">
																	{amenities && amenities.length > 0 ? (
																		amenities.map((project) =>
																			project.type === "number" ? (
																				<fieldset key={project.id} className="box box-fieldset">
																					<label className="title-select" htmlFor={project.id}>
																						{project.name}:
																					</label>
																					<input
																						type="number"
																						className="form-control"
																						value={filters.amenities_id_object_with_value?.[project.id] || ""}
																						name={project.id}
																						onChange={(e) => handleNumberChange(project.id, e.target.value)}
																					/>
																				</fieldset>
																			) : null
																		)
																	) : null}
																</div>
															</div>
														</div>
														<div className="form-style wd-amenities" style={{ display: `${isToggled ? "block" : "none"}` }}>
															<div className="group-checkbox">
																<div className="text-1">{t("amenities")}:</div>
																<div className="group-amenities">
																	{amenities.map((amenity) => (
																		amenity.type === "boolean" ? (
																			<fieldset className="amenities-item" key={amenity.id}>
																				<input
																					type="checkbox"
																					className="tf-checkbox style-1"
																					id={`amenity-${amenity.id}`}
																					checked={filters?.amenities_id_array?.includes(amenity.id)} // Updated to amenities_id_array
																					onChange={(e) => {
																						const updatedAmenities = e.target.checked
																							? [...filters.amenities_id_array, amenity.id] // Updated to amenities_id_array
																							: filters.amenities_id_array.filter((id) => id !== amenity.id); // Updated to amenities_id_array
																						setFilters({ ...filters, amenities_id_array: updatedAmenities }); // Updated to amenities_id_array
																					}}
																				/>
																				<label htmlFor={`amenity-${amenity.id}`} className="text-cb-amenities">
																					{amenity.name}
																				</label>
																			</fieldset>
																		) : null
																	))}
																</div>
															</div>
														</div>
														<div className="form-style btn-hide-advanced" onClick={handleToggle} style={{ display: `${isToggled ? "block" : "none"}` }}>
															<a className="filter-advanced pull-right">
																<span className="icon icon-faders" />
																<span className="text-advanced">{t("hideadvance")}</span>
															</a>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div >
								</div >
							</div >
							<div className="form-btn-fixed">
								<button type="submit" className="tf-btn primary" href="#">{t("findprojects")}</button>
							</div>
						</form>
					)}
					<div className="wrap-inner">


						<div className="tab-content">
							<div class={(isSwitch) ? "property-sec-list hide-main-section" : "property-sec-list"}>
								<div className="project-listing-pagination">
									<div className="box-title-listing style-1">
										<h5>{t("projectlisting")}</h5>
										{(!isDefaultPropertyViewMobile) && (
											<div className="flex items-center cursor-pointer select-none">
												<img src="/images/logo/map-icon.png" alt="logo-footer" width={30} height={20} style={{ marginRight: "10px" }} className="map-switch-icon"></img>
												<label className="switch">
													<input
														type="checkbox"
														checked={isSwitch}
														onChange={handleSwitchChange}
													/>
													<span className="slider"></span>
												</label>
											</div>
										)}
									</div>
									{(isDefaultPropertyViewMobile) && (
										<div className="property-change-view">
											<button
												className={`tf-btn primary-1 ${isPropertyViewMobile ? 'property-active' : ''}`}
												onClick={() => handlePropertyview()}
											>
												{t('project')}
											</button>
											<button
												className={`tf-btn primary-1 ${isPropertyViewMap ? 'property-active' : ''}`}
												onClick={(e) => handlePropertyMapview(e)}
											>
												{t('map')}
											</button>
										</div>
									)}
									<div className={`project-listing ${(isPropertyViewMobile) ? 'property-show-mobile' : 'property-hide-mobile'} `}>
										{loading ? (
											<Preloader />
										) : error ? (
											<p>{error}</p>
										) : projects.length === 0 ? (
											<div style={{ textAlign: "center" }}>
												<img src="/images/not-found/item-not-found.png" alt="No projects found" style={{ height: "300px" }} />
											</div>
										) : (
											<div className="row">
												{projects.map((project) => (
													<div className={(isSwitch) ? "col-md-6 property-inner-sec" : "col-md-6"} key={project.id}>
														<div className="homeya-box">
															<div className="archive-top">
																<div className="images-group">
																	<div className="images-style">
																		<Swiper
																			modules={[Navigation]}
																			slidesPerView={1}
																			loop={project.picture.length > 1}
																			navigation={project.picture.length > 1}
																			className="property-slider"
																		>
																			{(project.picture.length > 0 ? project.picture : ["/images/banner/no-banner.png"]).map(
																				(item, index) => (
																					<SwiperSlide
																						key={index}
																						onClick={() => handleClick(project.slug)} // <-- FIX: now it's a function
																						style={{ cursor: "pointer" }} // <-- Make it look clickable
																					>
																						<img
																							src={item}
																							alt="img-property"
																							style={{ width: "100%", borderRadius: "8px", minHeight: "300px", maxHeight: "300px" }}
																						/>
																					</SwiperSlide>
																				)
																			)}
																		</Swiper>
																	</div>

																	<div className="top">
																		<ul className="d-flex gap-8">
																			{project.isFeatured && (
																				<li className="flag-tag success">Featured</li>
																			)}
																		</ul>
																	</div>
																	<div className="bottom">
																		<span className="flag-tag style-2">
																		</span>
																	</div>
																</div>
																<div className="content">
																	<div className="h7 text-capitalize fw-7 truncate-text">																		
																		<div className="link custom-link"
																			onClick={() => navigateTo(router, `/project/${project.slug}`)}>
																			{project.title}
																		</div>
																	</div>
																	<div className="desc">
																		<i className="fs-16 icon icon-mapPin" />
																		<p className="truncate-text">
																			{[project?.district, project?.city, project?.state]
																				.filter(Boolean)
																				.join(', ')} </p> {/* Join remaining values with comma */}

																	</div>
																</div>
															</div>
															<div className="archive-bottom d-flex justify-content-between align-items-center">
																<div className="d-flex gap-8 align-items-center">
																	<div className="avatar avt-40 round">
																		<img
																			src={project.user_image || '/images/avatar/user-image.png'}
																			alt={project.agent?.name || 'Agent'}
																		/>
																	</div>
																	<span>{project.user_name || 'Unknown Agent'}</span>
																</div>
																<div className="d-flex align-items-center">
																	<h6>{t('from')} {formatPropertyPrice(project.price || '0')} {project.currency || 'USD'} </h6>
																</div>
															</div>
														</div>
													</div>
												))}
											</div>
										)}
									</div>
									{pagination.totalCount > pagination.itemsPerPage && (
										<div className={`${(isPropertyViewMobile) ? 'property-show-mobile' : 'property-hide-mobile'}`}>
											<ul className="wd-navigation">
												{Array.from({ length: pagination.totalPages }, (_, index) => (
													<li key={index}>
														<div className={`nav-item ${pagination.currentPage === index + 1 ? 'active' : ''}`} onClick={() => handlePageChange(index + 1)} href="#"
															style={{ cursor: 'pointer' }} data-id={index}>
															{index + 1}
														</div>
													</li>
												))}
											</ul>
										</div>
									)}
								</div>
								<div className={` ${(isSwitch) ? "wrap-map map-section-hide" : "wrap-map"} ${((isDefaultPropertyViewMobile) ? (isPropertyViewMap) ? 'property-show-mobile' : 'property-hide-mobile' : '')} `}>
									<ProjectMap topmap={false} singleMap={false} propertys={projects} slug="project" />
								</div>
							</div>
						</div>


					</div >
				</section >

			</Layout >
		</>
	)
}