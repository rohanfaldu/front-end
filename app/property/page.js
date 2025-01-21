'use client'
import PropertyMap from "@/components/elements/PropertyMap"
import RangeSlider from "@/components/elements/RangeSlider"
import SidebarFilter from "@/components/elements/SidebarFilter"
import TabNav from "@/components/elements/TabNav"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { getData, insertData } from "../../components/api/Helper";
import ReactSlider from "react-slider"
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import Preloader from "@/components/elements/Preloader";
import variablesList from "@/components/common/Variable";
import debounce from "lodash.debounce";

export default function PropertyHalfmapList() {
	const [isToggled, setToggled] = useState(false)
	const handleToggle = () => setToggled(!isToggled)
  	const [cityOptions, setCityOptions] = useState([]);
	const [districtOptions, setDistrictOptions] = useState([]);
	const [neighbourhoodOptions, setNeighbourhoodOptions] = useState([]);



	const [initialMaxPrice, setInitialMaxPrice] = useState(0); // Store the maximum price initially
	const [initialMaxSize, setInitialMaxSize] = useState(0);
	const [maxPriceSliderRange, setMaxPriceSliderRange] = useState(0); // Dynamic slider range


	const [priceRange, setPriceRange] = useState([]); // Selected range
	const [sizeRange, setSizeRange] = useState([]); // Selected range
	const [isTab, setIsTab] = useState(2)
	const handleTab = (i) => {
		setIsTab(i)
	}
	const { t, i18n } = useTranslation();
	const [propertys, setPropertys] = useState([]); // Store properties for the current page
	const [loading, setLoading] = useState(true); // Manage loading state
	const [error, setError] = useState(null); // Manage error state

	const [searchTerm, setSearchTerm] = useState(''); // Store search input
	const [searchTermDistrict, setSearchTermDistrict] = useState('');
	const [searchTermNeighbourhood, setSearchTermNeighbourhood] = useState('');



	const [searchCity, setSearchCity] = useState('');
	const [searchDistrict, setSearchDistrict] = useState('');
	const [searchNeighbourhood, setSearchNeighbourhood] = useState('');


	const [statusFilter, setStatusFilter] = useState(''); // Store selected status filter
	const [amenities, setAmenities] = useState([]);
	const [propertyType, setpropertyType] = useState([]);
	const [developers, setDevelopers] = useState([]);

	const [city, setCity] = useState([]);
	const [district, setDistricts] = useState([]);
	const [neighbourhood, setNeighbourhood] = useState([]);

	const [cityId, setCityId] = useState(['']);
	const [districtId, setDistrictId] = useState(['']);


	const [showDistrict, setShowDistrict] = useState(false);
	const [showNeighbourhood, setShowNeighbourhood] = useState(false);

	const [transaction, setTransaction] = useState("rental");


	const [pagination, setPagination] = useState({
		totalCount: 0,
		totalPages: 1,
		currentPage: variablesList.currentPage,
		itemsPerPage: variablesList.itemsPerPage,
	}); // Track pagination info
	const [filters, setFilters] = useState({
		title: '',
		description: '',
		minPrice: priceRange[0],
		maxPrice: priceRange[1],
		minSize: sizeRange[0],
		maxSize: sizeRange[1],
		amenities_id_array: [],
		amenities_id_object_with_value: {},
		type_id: '',
		developer_id: '',
		city: "",
		district: "",
		neighbourhood: "",
		direction: ""
	});

	const lang = i18n.language;


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
		  const response = await getData("api/city", requestData, true);
		  setCityOptions(response.data.cities);
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

	  const handleCitySelect = (cityId, cityName) => {
		setSearchCity(cityName); // Set the selected city name in the input
		handleFilterChange({ target: { name: 'city', value: cityId } }); // Call filter change with selected city ID
	};

	const handleDistrictSelect = (districtId, districtName) => {
		setSearchDistrict(districtName); // Set the selected city name in the input
		handleFilterChange({ target: { name: 'district', value: districtId } }); // Call filter change with selected city ID
	};

	const handleNeighbourhoodSelect = (neighbourhoodId, neighbourhoodName) => {
		setSearchNeighbourhood(neighbourhoodName); // Set the selected city name in the input
		handleFilterChange({ target: { name: 'neighbourhood', value: neighbourhoodId } }); // Call filter change with selected city ID
	};


	const fetchPropertys = async (page = 1, updatedFilters = {}) => {
		setLoading(true);
		try {
			const lang = i18n.language;
			const requestData = {
				page,
				lang,
				limit: pagination.itemsPerPage,
				transaction: transaction
			};
			const response = await getData("api/property", requestData, true);
			if (response.status) {
				const { list, totalCount, totalPages, currentPage, property_meta_details, maxPriceSliderRange, property_types, cities, maxSizeSliderRange, developers } = response.data;
				setPropertys(list);
				setPagination({
					...pagination,
					totalCount,
					totalPages,
					currentPage,
				});
				setAmenities(property_meta_details);
				setDevelopers(developers);
				setpropertyType(property_types);
				setCity(cities);
				if (initialMaxPrice !== maxPriceSliderRange) {
					setInitialMaxPrice(maxPriceSliderRange);
					setMaxPriceSliderRange(maxPriceSliderRange);
					setPriceRange([0, maxPriceSliderRange]);
				}

				if (initialMaxSize !== maxSizeSliderRange){
					setInitialMaxSize(maxSizeSliderRange);
					setSizeRange([0, maxSizeSliderRange])
				}
				setError(null);
			}
		} catch (err) {
			setError(err.response?.data?.message || "An error occurred");
		} finally {
			setLoading(false);
		}
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
				// const lang = i18n.language;
				// const requestData = {
				// 	city_id: value,
				// 	lang,
				// };
				// const response = await getData("api/district/getbycity", requestData, true);
				// const data = response.data;
				// setDistricts(data);
				setShowDistrict(true);
			}
		}
	
		if (name === "district") {
			setShowNeighbourhood(false);
	
			if (value) {
				setDistrictId(value);
				// const lang = i18n.language;
				// const requestData = {
				// 	district_id: value,
				// 	lang,
				// };
				// const response = await getData("api/neighborhood/id", requestData, true);
				// const data = response.data;
				// setNeighbourhood(data);
				setShowNeighbourhood(true);
			}
		}
	};
	
	  
	useEffect(() => {
		fetchPropertys(pagination.currentPage);
	}, [pagination.currentPage, i18n.language, transaction]);

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

	const handleSizeChange = (newRange) => {
		setSizeRange(newRange); // Update the range state
		setFilters((prevFilters) => ({
			...prevFilters,
			minSize: newRange[0], // Set minPrice
			maxSize: newRange[1], // Set maxPrice
		}));
	};

	const handleSubmit = async (page = 1,) => {
		console.log("Filters:", filters);
		const lang = i18n.language;
		const requestData = {
			page,
			lang,
			limit: pagination.itemsPerPage,
			
			title: filters.title,
			description: filters.description,
			city_id: filters.city,
			district_id: filters.district,
			neighborhoods_id: filters.neighbourhood,
			type_id: filters.type_id,
			minPrice: filters.minPrice,
			maxPrice: filters.maxPrice,
			amenities_id_array: filters.amenities_id_array,
			minSize: filters.minSize,
			maxSize: filters.maxSize,
			direction: filters.direction,
			developer_id: filters.developer_id,
			amenities_id_object_with_value: filters.amenities_id_object_with_value,

			transaction: transaction
		};
		const response = await getData("api/property", requestData, true);
		if (response.status) {
			const { list, totalCount, totalPages, currentPage, property_meta_details, maxPriceSliderRange, property_types, cities, maxSizeSliderRange } = response.data;
			setPropertys(list);
			setPagination({
				...pagination,
				totalCount,
				totalPages,
				currentPage,
			});
			setAmenities(property_meta_details);
			setpropertyType(property_types);
			setDevelopers(developers);
			setCity(cities);
			if (!initialMaxPrice) {
					setInitialMaxPrice(maxPriceSliderRange);
					setMaxPriceSliderRange(maxPriceSliderRange);
					setPriceRange([0, maxPriceSliderRange]);
				}

				if (!initialMaxSize){
					setInitialMaxSize(maxSizeSliderRange);
					setSizeRange([0, maxSizeSliderRange])
				}
			setError(null);
		}
	  };


	  const saveSearch = async () => {
		const requestData = {
			title: filters.title,
			description: filters.description,
			city_id: filters.city,
			district_id: filters.district,
			neighborhoods_id: filters.neighbourhood,
			type_id: filters.type_id,
			min_price: filters.minPrice,
			max_price: filters.maxPrice,
			min_size: filters.minSize,
			max_size: filters.maxSize,
			direction: filters.direction,
			developer_id: filters.developer_id,
			transaction: transaction,
			amenities_type_boolean: filters.amenities_id_array,
			amenities_type_number: filters.amenities_id_object_with_value,

		};
		await insertData("api/property-save-searches/save", requestData, true);
	  };




	  
	return (
		<>

			<Layout headerStyle={1}>
				<section className="wrapper-layout-3">
					<div className="wrap-sidebar">
						<div className="flat-tab flat-tab-form widget-filter-search">
							<div className="h7 title fw-7">{t("search")}</div>
							<ul className="nav-tab-form" role="tablist">
								<TabNav setTransaction={setTransaction}/>
							</ul>
							<div className="tab-content">
								<div className="tab-pane fade active show" role="tabpanel">
									<div className="form-sl">
										<form method="post" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
											<div className="wd-filter-select">
												<div className="inner-group inner-filter">
													<div className="form-style">
														<label className="title-select">{t("title")}</label>
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
														<label className="title-select">{t("description")}</label>
														<div className="group-ip ip-icon">
															<input
																type="text"
																className="form-control"
																value={filters.description}
																onChange={handleFilterChange}
																name="description"
																placeholder={t("searchdescription")}

															/>

														</div>
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
															placeholder={t("typeToSearchCity")}
														/>
														{searchTerm.length > 0 && cityOptions.length === 0 ? (
															<ul className="city-dropdown form-style" style={{ marginTop: "0px" }}>
																<li className="city-option">City not found</li>
															</ul>
														) : (
															cityOptions.length > 0 && (
																<ul className="city-dropdown form-style" style={{ marginTop: "0px" }}>
																	{cityOptions.map((city) => (
																		<li
																			key={city.id}
																			onClick={() => {
																				handleCitySelect(city.id, city.city_name); // Pass city name to the function
																				setSearchTerm(''); // Clear the search term
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


													
													{showDistrict && (
													<div className="form-style">
														<label className="title-select">{t("distric")}</label>
														<input
															type="text"
															className="form-control"
															id="district"
															name="district"
															value={searchDistrict}
															onChange={handleInputChangeDistrict}
															placeholder={t("typeToSearchDistrict")}
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
																				handleDistrictSelect(city.id, city.name);
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
													)}
													{showNeighbourhood && (
													<div className="form-style">
														{/* <label className="title-select">{t("neighbourhood")}</label>
														<select
															className="form-control"
															id="neighbourhood"
															name="neighbourhood"
															value={filters.neighbourhood}
															onChange={handleFilterChange}
														>
															<option value="">{t("selectneighbourhood")}</option>
															{neighbourhood.map((neighbourhood) => (
																<option key={neighbourhood.id} value={neighbourhood.id}>
																	{neighbourhood.name}
																</option>
															))}
														</select> */}
														<label className="title-select">{t("neighbourhood")}</label>
														<input
															type="text"
															className="form-control"
															id="neighbourhood"
															name="neighbourhood"
															value={searchNeighbourhood}
															onChange={handleInputChangeNeighbourhood}
															placeholder={t("typeToSearchNeighbourhood")}
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
																				handleNeighbourhoodSelect(city.id, city.name);
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


													</div>

													
													)}
													<div className="form-style">
														<label className="title-select">{t("propertytype")}</label>
														<select
															className="form-control"
															id="propertyType"
															name="type_id"
															value={filters.type_id} 
															onChange={handleFilterChange}
														>
															<option value="">{t("selectpropertytype")}</option>
															{propertyType.map((property) => ( 
																<option key={property.id} value={property.id}>
																	{property.title}
																</option>
															))}
														</select>
													</div>

													<div className="form-style">
														<label className="title-select">{t("direction")}</label>
														<select
															className="form-control"
															id="direction"
															name="direction"
															value={filters.direction} 
															onChange={handleFilterChange}
														>
															<option value="">{t("selectdiretion")}</option>
															<option value="north">North</option>
															<option value="south">South</option>
															<option value="east">East</option>
															<option value="west">West</option>
														</select>
													</div>
													

													<div className="form-style">
														<label className="title-select">{t("developedby")}</label>
														<select
															className="form-control"
															id="developer_id"
															name="developer_id"
															value={filters.developer_id} 
															onChange={handleFilterChange}
														>
															<option value="">{t("selectdeveloper")}</option>
															{developers.map((developer) => ( 
																<option key={developer.user_id} value={developer.user_id}>
																	{developer.user_name}
																</option>
															))}
														</select>
													</div>


													<div className="form-style widget-price">
													<label className="title-select" style={{marginBottom:"0px"}}>{t("price")}</label>
														<div className="group-form">
															<ReactSlider
																ariaLabelledby="slider-label"
																className="horizontal-slider st2"
																min={0}
																max={initialMaxPrice}
																value={priceRange}
																thumbClassName="example-thumb"
																trackClassName="example-track"
																onChange={handlePriceChange}
															/>

															<div className="group-range-title mt-2">
																<label className="d-flex justify-content-between mb-0">
																	<span>{priceRange[0]}$</span>
																	<span>{priceRange[1]}$</span>
																</label>
															</div>
														</div>
													</div>

													<div className="form-style widget-price">
													<label className="title-select" style={{marginBottom:"0px"}}>{t("size")}</label>
														<div className="group-form">
															<ReactSlider
																ariaLabelledby="slider-label"
																className="horizontal-slider st2"
																min={0}
																max={initialMaxSize}
																value={sizeRange}
																thumbClassName="example-thumb"
																trackClassName="example-track"
																onChange={handleSizeChange}
															/>

															<div className="group-range-title mt-2">
																<label className="d-flex justify-content-between mb-0">
																	<span>{sizeRange[0]} sqm</span>
																	<span>{sizeRange[1]} sqm</span>
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
															<div className="text-1">Amenities:</div>
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
													<div className="form-btn-fixed d-flex">
													<button
														type="submit"
														className="tf-btn primary"
														style={{ marginRight: "10px" }}
													>
														{t("findproperties")}
													</button>
													<button
														type="button" // Change type to "button" to prevent form submission
														className="tf-btn primary-1"
														style={{ marginLeft: "10px" }}
														onClick={(e) => {
														e.preventDefault(); // Prevent default form submission
														saveSearch(); // Call saveSearch function on button click
														}}
													>
														{t("savesearches")}
													</button>
													</div>
												</div>
											</div>
										</form>
									</div>
								</div>
							</div >
						</div >
					</div >
					<div className="wrap-inner">
						<div className="box-title-listing style-1">
							<h5>{t("propertylisting")}</h5>
							{/* <div className="box-filter-tab">
								<ul className="nav-tab-filter" role="tablist">
									<li className="nav-tab-item" onClick={() => handleTab(1)}>
										<a className={isTab == 1 ? "nav-link-item active" : "nav-link-item"} data-bs-toggle="tab"><i className="icon icon-grid" /></a>
									</li>
									<li className="nav-tab-item" onClick={() => handleTab(2)}>
										<a className={isTab == 2 ? "nav-link-item active" : "nav-link-item"} data-bs-toggle="tab"><i className="icon icon-list" /></a>
									</li>
								</ul>
								<select className="nice-select">

									<option data-value="default" className="option selected">{t("sortbydefualt")}</option>
									<option data-value="new" className="option">{t("newest")}</option>
									<option data-value="old" className="option">{t("oldest")}</option>
								</select>
							</div> */}
						</div>
						<div className="tab-content">
						{loading ? (
							<Preloader />
						) : error ? (
							<p>{error}</p>
						) : (
							<div className="row">
								{propertys.filter(property => property.status).length === 0 ? (
									<div style={{ textAlign: "center" }}>
										<img 
											src="/images/not-found/item-not-found.png" 
											alt="No projects found" 
											style={{ height: "300px" }} 
										/>
									</div>
								) : (
									propertys.filter(property => property.status).map((property) => (
										<div className="col-md-6" key={property.id}>
											<div className="homeya-box">
												<div className="archive-top">
													<Link
														href={`/property/${property.slug}`}
														className="images-group"
													>
														<div className="images-style">
															<img
																src={property.picture[0] || "/images/banner/no-banner.png"}
																alt={property.name}
															/>
														</div>
														<div className="top">
															<ul className="d-flex gap-8">
																<li className="flag-tag style-1">{property.transaction}</li>
															</ul>
															<ul className="d-flex gap-4">
																<li className="box-icon w-40">
																	<span className="icon icon-heart" />
																</li>
																<li
																	className={` ${
																		property.like ? "liked" : "w-40 box-icon"
																	}`}
																>
																	<img
																		src={'/images/logo/thumbs-up.svg'}
																		className="icon"
																		style={{ height: "24px" }}
																	/>
																</li>
															</ul>
														</div>
														<div className="bottom">
															<span className="flag-tag style-2">{property.type_details.title}</span>
														</div>
													</Link>
													<div className="content">
														<div className="h7 text-capitalize fw-7">
															<Link href={`/property/${property.slug}`} className="link">
																{property.title}
															</Link>
														</div>
														<div className="desc">
															<i className="fs-16 icon icon-mapPin" />
															<p>{[property?.district, property?.city, property?.state]
																.filter(Boolean)
																.join(', ')} </p>
														</div>
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
															<img src={property.user_image} alt="user" />
														</div>
														{console.log(property)}
														<span>{property.user_name}</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>{property.price} {property.currency}</h6>
														<span className="text-variant-1"></span>
													</div>
												</div>
											</div>
										</div>
									))
								)}
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
					<div className="wrap-map">
						<PropertyMap topmap={false} singleMap={false} propertys={propertys} slug="property" />
					</div>
				</section >

			</Layout >
		</>
	)
}