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

	const lang = i18n.language;

	const fetchProjects = async (page = 1, updatedFilters = {}) => {
		setLoading(true);
		try {
			const lang = i18n.language;
			// Set the filters to the updated filters, defaulting to empty values if not provided
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
		// console.log("Filters:", filters);
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
		console.log(getSwitch, '>>>>> Switch');
		if (getSwitch !== null) {
			const IsSwitch = JSON.parse(getSwitch);
			setIsSwitch(IsSwitch);
		}
	}, [pagination.currentPage, i18n.language]);

	const handlePageChange = (page) => {
		setPagination({ ...pagination, currentPage: page });
		// handleSubmit(page)
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
		// console.log(latitude, longitude);
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
	// console.log(isSwitch, ">>> isSwitch");

	const router = useRouter();

	const handleClick = (slug) => {
		localStorage.setItem('switchProjectState', JSON.stringify(isSwitch));
		router.push(`/project/${slug}`);
	};

	return (
		<>

			<Layout headerStyle={1} footerStyle={1}>
				<section className="wrapper-layout-3 project-sec">
					<form method="post" className="form-sec" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
						<div className="wrap-sidebar">
							<div className="flat-tab flat-tab-form widget-filter-search">
								<div className="h7 title fw-7">{t("search")}</div>

								<div className="tab-content">
									<div className="tab-pane fade active show" role="tabpanel">
										<div className="form-sl">
											{/* <form method="post" onSubmit={(e) => { e.preventDefault(); applyFilters(); }}> */}
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
														<label className="title-select">{t("keyword")}</label>
														<input
															type="text"
															className="form-control"
															id="city"
															name="city"
															value={searchCity}
															onChange={handleInputChange}
															onFocus={() => {
																setIsFocused(true);
																// If no search term, we'll still show predefined cities
																if (!searchCity || searchCity.length === 0) {
																	// You can set predefined cities here or use existing cityOptions state
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
																// Small delay to allow item selection before hiding dropdown
																setTimeout(() => setIsFocused(false), 200);
															}}
															placeholder={t("searchCity")}
														/>
														{(searchTerm.length > 0 || isFocused) && (
															cityOptions.length > 0 && (
																<ul className="city-dropdown form-style" style={{ marginTop: "0px", width: "80%", position: "absolute" }}>
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

													{/* <div className="form-style">
														<label className="title-select">{t("district")}</label>
														<input
															type="text"
															className="form-control"
															id="district"
															name="district"
															value={searchDistrict}
															onChange={handleInputChangeDistrict}
															placeholder={t("searchDistrict")}
															disabled={!showDistrict}
														/>


														{searchTermDistrict.length > 0 && districtOptions.length === 0 ? (
															<ul className="city-dropdown form-style" style={{ marginTop: "0px" }}>
																<li className="city-option">District not found</li>
															</ul>
														) : (
															districtOptions.length > 0 && (
																<ul className="city-dropdown form-style" style={{ marginTop: "0px" }}>
																	{districtOptions.map((city) => (
																		<li
																			key={city.id}
																			onClick={() => {
																				handleDistrictSelect(city.id, city.name, city.latitude, city.longitude); // Pass city name to the function
																				setSearchTermDistrict('');
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

													<div className="form-style">
														<label className="title-select">{t("neighbourhood")}</label>
														<input
															type="text"
															className="form-control"
															id="neighbourhood"
															name="neighbourhood"
															value={searchNeighbourhood}
															onChange={handleInputChangeNeighbourhood}
															placeholder={t("searchNeighbourhood")}
															disabled={!showNeighbourhood}
														/>

														{searchTermNeighbourhood.length > 0 && neighbourhoodOptions.length === 0 ? (
															<ul className="city-dropdown form-style" style={{ marginTop: "0px" }}>
																<li className="city-option">Neighbourhood not found</li>
															</ul>
														) : (
															neighbourhoodOptions.length > 0 && (
																<ul className="city-dropdown form-style" style={{ marginTop: "0px" }}>
																	{neighbourhoodOptions?.map((city) => (
																		<li
																			key={city.id}
																			onClick={() => {
																				handleNeighbourhoodSelect(city.id, city.name, city.latitude, city.longitude);
																				setSearchTermNeighbourhood('');
																			}}
																			className="city-option"
																		>
																			{city.name}
																		</li>
																	))}
																</ul>
															)
														)}


													</div> */}


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
																	<span>{priceRange[0]}DH</span>
																	<span>{priceRange[1]}DH</span>
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
													{/* <div className="form-style wd-amenities" style={{ display: `${isToggled ? "block" : "none"}` }}>
														<div className="group-checkbox">
															<div className="text-1">Amenities:</div>
															<div className="group-amenities">
																{amenities
																	.sort((a, b) => (a.type === "number" ? -1 : 1))
																	.map((amenity) => (
																		<fieldset className="amenities-item" key={amenity.id}>
																			{amenity.type === "number" ? (
																				
																				<>
																					<label
																						htmlFor={`amenity-${amenity.id}`}
																						className="text-cb-amenities"
																					>
																						{amenity.name}
																					</label>
																					<input
																						type="number"
																						className="form-control style-1"
																						id={`amenity-${amenity.id}`}
																						value={filters[amenity.id] || ""} // Show current value or empty
																						onChange={(e) =>
																							setFilters({ ...filters, [amenity.id]: e.target.value })
																						} 
																						placeholder={`Enter ${amenity.name}`}
																					/>
																				</>
																			) : amenity.type === "boolean" ? (
																				
																				<>
																					<input
																						type="checkbox"
																						className="tf-checkbox style-1"
																						id={`amenity-${amenity.id}`}
																						checked={filters.amenities_id.includes(amenity.id)} // Check if selected
																						onChange={(e) => {
																							const updatedAmenities = e.target.checked
																								? [...filters.amenities_id, amenity.id] // Add
																								: filters.amenities_id.filter((id) => id !== amenity.id); // Remove
																							setFilters({ ...filters, amenities_id: updatedAmenities }); // Update filters
																						}}
																					/>
																					<label
																						htmlFor={`amenity-${amenity.id}`}
																						className="text-cb-amenities"
																					>
																						{amenity.name}
																					</label>
																				</>
																			) : null}
																		</fieldset>
																	))}
															</div>
														</div>
													</div> */}



													<div
														className="form-style wd-amenities"
														style={{ display: `${isToggled ? "block" : "none"}` }}
													>
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
					<div className="wrap-inner">


						<div className="tab-content">
							{console.log(isSwitch, ' >>>>>>>>>>>> isSwitch')}
							<div class={(isSwitch) ? "property-sec-list hide-main-section" : "property-sec-list"}>
								<div className="project-listing-pagination">
									<div className="box-title-listing style-1">
										<h5>{t("projectlisting")}</h5>
										<div className="flex items-center cursor-pointer select-none">
											{/* <span className="switch-text">{t('switchMapText')}</span> */}
											<img src="/images/logo/map-icon.png" alt="logo-footer" width={30} height={20} style={{ marginRight: "10px" }}></img>
											<label className="switch">
												<input
													type="checkbox"
													checked={isSwitch}
													onChange={handleSwitchChange}
												/>
												<span className="slider"></span>
											</label>
										</div>
									</div>
									<div className="project-listing">
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
																<div
																	onClick={() => handleClick(project.slug)}
																	className="images-group"
																>

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
																					<SwiperSlide key={index}>
																						<img src={item} alt="img-property" style={{ width: "100%", borderRadius: "8px", minHeight: "300px", maxHeight: " 300px" }} />
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
																			{/* <li className="flag-tag style-1">{project.status || 'For Sale'}</li> */}
																		</ul>
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
																			{/* {project.meta_details?.propertyType || 'Studio'} */}
																		</span>
																	</div>
																</div>
																<div className="content">
																	<div className="h7 text-capitalize fw-7">
																		<Link
																			href={`/project/${project.slug}`}// Pass ID as query param
																			className="link"
																		>
																			{project.title}
																		</Link>
																	</div>
																	<div className="desc">
																		<i className="fs-16 icon icon-mapPin" />
																		<p>
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
																	<h6>{t('from')} {project.price || '0.00'} {project.currency || 'USD'} </h6>
																</div>
															</div>
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
								</div>
								<div className={(isSwitch) ? "wrap-map map-section-hide" : "wrap-map"}>
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