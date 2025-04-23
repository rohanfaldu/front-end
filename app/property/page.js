'use client'
import PropertyMap from "@/components/elements/PropertyMap"
import RangeSlider from "@/components/elements/RangeSlider"
import SidebarFilter from "@/components/elements/SidebarFilter"
import TabNav from "@/components/elements/TabNav"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { getData, insertData } from "../../components/api/Helper";
import ReactSlider from "react-slider"
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from "react-i18next";
import Preloader from "@/components/elements/Preloader";
import variablesList from "@/components/common/Variable";
import debounce from "lodash.debounce";
import PropertyBlog from "@/components/sections/PropertyBlog"
import TinderCard from "react-tinder-card";
import ModalLoginLike from "@/components/common/ModelLoginLike"
import ProjectMap from "@/components/elements/ProjectMap"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import PercentageHeart from "@/components/elements/PercentageHeart";

export default function PropertyHalfmapList() {
	const [isToggled, setToggled] = useState(false)
	const API_URL = process.env.NEXT_PUBLIC_API_URL;
	const handleToggle = () => setToggled(!isToggled)
	const [cityOptions, setCityOptions] = useState([]);
	const [districtOptions, setDistrictOptions] = useState([]);
	const [neighbourhoodOptions, setNeighbourhoodOptions] = useState([]);
	const [checkURL, setCheckURL] = useState(false);
	const [isSwitch, setIsSwitch] = useState(false);


	const [initialMaxPrice, setInitialMaxPrice] = useState(0); // Store the maximum price initially
	const [initialMaxSize, setInitialMaxSize] = useState(0);
	const [maxPriceSliderRange, setMaxPriceSliderRange] = useState(0); // Dynamic slider range
	const [calculationStatus, setCalculationStatus] = useState(false);
	const [isLiked, setIsLiked] = useState(false);
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
	const [params, setParams] = useState({}); // Store query parameters

	const [searchTerm, setSearchTerm] = useState(''); // Store search input
	const [searchTermTitle, setSearchTermTitle] = useState(''); // Store search input
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

	const [transaction, setTransaction] = useState();
	const [addressLatLong, setAddressLatLong] = useState([]);

	const [isModelOpen, setIsModelOpen] = useState(false);

	const [pagination, setPagination] = useState({
		totalCount: 0,
		totalPages: 1,
		currentPage: variablesList.currentPage,
		itemsPerPage: 10,
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
		direction: "",
		filter_latitude: addressLatLong[0],
		filter_longitude: addressLatLong[1],
	});

	const lang = i18n.language;
	const isInitialRender = useRef(true);

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
					body: JSON.stringify({ propertyId: id, propertyPublisherId })
				});

				if (!response.ok) return;

				setPropertys(prev =>
					prev.map(p => p.id === id ? { ...p, like: true } : p)
				);
			} else {
				const response = await fetch(`${API_URL}/api/property/${id}/like`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
				});

				if (!response.ok) return;

				setPropertys(prev =>
					prev.map(p => p.id === id ? { ...p, like: false } : p)
				);
			}
			// console.log(propertys, ' >>>>>>>>>>>>  Propertys Like Data')
		} catch (error) {
			console.error('Like error:', error);
		}
	};

	const [isLogin, setLogin] = useState(false)
	const [showLoginModal, setShowLoginModal] = useState(false)
	const handleLogin = () => {
		// console.log(isLogin, "///////////////////////////")
		setLogin(!isLogin)
		!isLogin ? document.body.classList.add("modal-open") : document.body.classList.remove("modal-open")
	}

	const closeModal = () => {
		setIsModelOpen(false);
		setShowLoginModal(true);
	};

	const [currentIndex, setCurrentIndex] = useState(0);
	const [showNoMore, setShowNoMore] = useState(false);
	const handleDislike = () => {
		if (currentIndex < filteredProperties.length - 1) {
			setCurrentIndex((prevIndex) => prevIndex + 1);
		} else if (currentIndex === filteredProperties.length - 1 && pagination.totalPages > pagination.currentPage) {
			setCurrentIndex(0);
			handlePageChange(pagination.currentPage + 1);
		} else if (pagination.totalPages == pagination.currentPage && currentIndex === filteredProperties.length - 1) {
			setCurrentIndex(0);
			setShowNoMore(true);
		}
	};

	const handleLikeClick = () => {
		if (currentIndex < filteredProperties.length - 1) {
			setCurrentIndex((prevIndex) => prevIndex + 1);
		} else if (currentIndex === filteredProperties.length - 1 && pagination.totalPages > pagination.currentPage) {
			setCurrentIndex(0);
			handlePageChange(pagination.currentPage + 1);
		} else if (pagination.totalPages == pagination.currentPage && currentIndex === filteredProperties.length - 1) {
			setCurrentIndex(0);
			setShowNoMore(true);
		}
	};

	const filterSet = () => {
		setShowNoMore(false);
		pagination.currentPage = 1;
	}

	useEffect(() => {
		setLoading(true);
		setTransaction(localStorage.getItem("transaction"));
		const url = window.location.href;
		const urlParams = new URLSearchParams(new URL(url).search);
		//console.log('urlParams: ', urlParams.get("city_status"));
		if (urlParams.size !== 0) {
			setCheckURL(true);
			const params = {
				title: urlParams.get("title") || null,
				description: urlParams.get("description") || null,
				type_id: urlParams.get("type_id") || null,
				city: urlParams.get("city") || null,
				city_name: urlParams.get("city_name") || null,
				city_slug: urlParams.get("city_slug") || null,
				district_name: urlParams.get("district_name") || null,
				neighbourhood_name: urlParams.get("neighbourhood_name") || null,
				district: urlParams.get("district") || null,
				neighbourhood: urlParams.get("neighbourhood") || null,
				minPrice: urlParams.get("minPrice") !== "undefined" ? urlParams.get("minPrice") : priceRange[0],
				maxPrice: urlParams.get("maxPrice") !== "undefined" ? urlParams.get("maxPrice") : priceRange[1],
				minSize: urlParams.get("minSize") !== "undefined" ? urlParams.get("minSize") : sizeRange[0],
				maxSize: urlParams.get("maxSize") !== "undefined" ? urlParams.get("maxSize") : sizeRange[1],
				amenities_id_object_with_value: urlParams.get("amenities_id_object_with_value")
					? JSON.parse(urlParams.get("amenities_id_object_with_value"))
					: null,
				amenities_id_array: urlParams.get("amenities_id_array") || null,
				developer_id: urlParams.get("developer_id") || null,
				direction: urlParams.get("direction") || null,
			};

			console.log("Extracted Parameters:", params);
			

			setFilters(() => ({
				...params,
			}));
			// console.log(params, '>>>>>>>>>>>>> Params')
			// console.log(params.minPrice, "/////////////")
			// console.log(params.maxPrice, "/////////////")
			if (params.maxSize == "null" && params.maxPrice == "null") {
				setPriceRange([0, 300000]);
				setSizeRange([0, 2000]);
			} else {
				setPriceRange([params.minPrice, params.maxPrice]);
				setSizeRange([params.minSize, params.maxSize]);
			}
			handleCitySelect(params.city, params.city_name, params.city_slug);
			handleDistrictSelect(params.district, params.district_name);
			handleNeighbourhoodSelect(params.neighbourhood, params.neighbourhood_name);


			const getFilterData = async (page = 1,) => {
				// console.log("Filters:", filters);
				const lang = i18n.language;
				const requestData = {
					page,
					lang,
					limit: pagination.itemsPerPage,
					title: params.title,
					description: params.description,
					city_id: params.city,
					district_id: params.city,
					neighborhoods_id: params.city,
					type_id: params.type_id,
					...(params.minPrice > 0 && { minPrice: params.minPrice }),
					...(params.maxPrice > 0 && { maxPrice: params.maxPrice }),
					...(params.minSize > 0 && { minSize: params.minSize }),
					...(params.maxSize > 0 && { maxSize: params.maxSize }),
					amenities_id_array: params.amenities_id_array,
					direction: params.direction,
					developer_id: params.developer_id,
					amenities_id_object_with_value: params.amenities_id_object_with_value,
					transaction: transaction
				};
				// console.log(transaction, ".....................")
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
					setpropertyType(property_types);
					setDevelopers(developers);
					// console.log(developers, "////////////////////")
					setCity(cities);
					if (!initialMaxPrice) {
						if (maxPriceSliderRange !== null) {
							setInitialMaxPrice(maxPriceSliderRange);
							setMaxPriceSliderRange(maxPriceSliderRange);
							if (params.minPrice == undefined && params.maxPrice == undefined) {
								setPriceRange([1000, maxPriceSliderRange]);
							}
						} else {
							setInitialMaxPrice(300000);
							setMaxPriceSliderRange(300000);
							setPriceRange([0, 300000]);
						}

					}

					if (!initialMaxSize) {
						if (maxSizeSliderRange !== null) {
							setInitialMaxSize(maxSizeSliderRange);
							if (params.minSize == undefined && params.maxSize == undefined) {
								setSizeRange([0, maxSizeSliderRange])
							}
						} else {
							setInitialMaxSize(2000);
							setSizeRange([0, 2000]);
						}

					}
					setError(null);
					setLoading(false);
				} else {
					setLoading(false);
				}
			};
			getFilterData(pagination.currentPage);
		} else {
			//  fetchPropertys(pagination.currentPage);
			handleSubmit(pagination.currentPage);
		}


	}, [params, pagination.currentPage, i18n.language, transaction]);

	// console.log(priceRange, ' >>>>>>>>>>>> Price')

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
		if (searchTerm) {
			fetchCityOptions(searchTerm);
		} else if (searchTermTitle) {
			fetchCityOptions(searchTermTitle);
		}
		fetchDistrictOptions(searchTermDistrict)
		fetchNeighbourhoodOptions(searchTermNeighbourhood)
	}, [searchTerm, searchTermDistrict, searchTermNeighbourhood, searchTermTitle]);



	const handleInputChange = (e) => {
		setSearchTerm(e.target.value);
		setSearchCity(e.target.value)
	};

	const handleInputChangeTitle = (e) => {
		setSearchTermTitle(e.target.value);
		setFilters((prevFilters) => ({
			...prevFilters,
			title: e.target.value,
		}))
	};

	const handleInputChangeDistrict = (e) => {
		setSearchTermDistrict(e.target.value);
		setSearchDistrict(e.target.value)
	}

	const handleInputChangeNeighbourhood = (e) => {
		setSearchTermNeighbourhood(e.target.value);
		setSearchNeighbourhood(e.target.value)
	}

	const handleCitySelect = (cityId, cityName, latitude, longitude) => {
		// console.log(latitude, longitude);
		setAddressLatLong([latitude, longitude]);
		setSearchCity(cityName); // Set the selected city name in the input
		handleFilterChange({ target: { name: 'city', value: cityId } }); // Call filter change with selected city ID

		setSearchNeighbourhood(""); // Set the selected city name in the input
		handleFilterChange({ target: { name: 'neighbourhood', value: "" } }); // Call filter change with selected city ID

		setSearchDistrict(""); // Set the selected city name in the input
		handleFilterChange({ target: { name: 'district', value: "" } }); // Call filter change with selected city ID
	};


	const handleCitySelectTitle = (cityId, cityName, latitude, longitude) => {
		setFilters((prevFilters) => ({
			...prevFilters,
			title: cityName,
		}))
	};

	const handleDistrictSelect = (districtId, districtName, latitude, longitude) => {
		setAddressLatLong([latitude, longitude]);
		setSearchDistrict(districtName); // Set the selected city name in the input
		handleFilterChange({ target: { name: 'district', value: districtId } }); // Call filter change with selected city ID

		setSearchNeighbourhood(""); // Set the selected city name in the input
		handleFilterChange({ target: { name: 'neighbourhood', value: "" } }); // Call filter change with selected city ID
	};


	const handleNeighbourhoodSelect = (neighbourhoodId, neighbourhoodName, latitude, longitude) => {
		setAddressLatLong([latitude, longitude]);
		setSearchNeighbourhood(neighbourhoodName); // Set the selected city name in the input
		handleFilterChange({ target: { name: 'neighbourhood', value: neighbourhoodId } }); // Call filter change with selected city ID
	};


	const fetchPropertys = async (page = pagination.currentPage) => {
		try {
			setLoading(true);
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

				setFilters({
					...filters,
					minPrice: 0,
					maxPrice: maxPriceSliderRange,
					minSize: 0,
					maxSize: maxSizeSliderRange,
				})
				setAmenities(property_meta_details);
				setDevelopers(developers);
				setpropertyType(property_types);
				setCity(cities);
				if (initialMaxPrice !== maxPriceSliderRange) {
					setInitialMaxPrice(maxPriceSliderRange);
					setMaxPriceSliderRange(maxPriceSliderRange);
					setPriceRange([1000, maxPriceSliderRange]);
				}

				if (initialMaxSize !== maxSizeSliderRange) {
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




	const handlePageChange = (page) => {
		setPagination({ ...pagination, currentPage: page });
	};

	const handlePriceChange = (newRange) => {
		// console.log(newRange, ";;;;;;;;;;;;;;;;;;;")
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

	const filteredProperties = propertys.filter(property => property.status).reverse(); // Reverse before mapping
	const lastPropertyId = filteredProperties.length > 0 ? filteredProperties[0].id : null; // First item is now the last one
	const handleSubmit = async (page = pagination.currentPage) => {
		// console.log(addressLatLong, "/////////////////")
		setCalculationStatus(true)
		// console.log("Filters:", filters);
		setLoading(true);

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
			filter_latitude: addressLatLong[0],
			filter_longitude: addressLatLong[1],
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
				setPriceRange([1000, maxPriceSliderRange]);
			}

			if (!initialMaxSize) {
				setInitialMaxSize(maxSizeSliderRange);
				setSizeRange([0, maxSizeSliderRange])
			}
			setError(null);
			setLoading(false);

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

	const handleSwitchChange = (e) => {
		setIsSwitch(e.target.checked);
	}
	// console.log(isSwitch, ">>> isSwitch");
	return (
		<>

			<Layout headerStyle={1} footerStyle={1}>
				<section className="wrapper-layout-3 property-sec">
					<div className="wrap-sidebar property-inner-sec">
						<form method="post" className="property-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
							<div className="flat-tab flat-tab-form widget-filter-search property-filter">
								<div>

								</div>
								<div className="h7 title fw-7">{t("search")}</div>
								<ul className="nav-tab-form" role="tablist" onClick={filterSet}>
									<TabNav setTransaction={setTransaction} />
								</ul>
								<div className="tab-content">
									<div className="tab-pane fade active show" role="tabpanel">
										<div className="form-sl">
											<div className="wd-filter-select">
												<div className="inner-group inner-filter">
													{/* <div className="form-style">
															<label className="title-select">{t("keyword")}</label>
															<input
																type="text"
																className="form-control"
																value={filters.title}
																onChange={handleInputChangeTitle}
																name="title"
																placeholder={t("searchkeyword")}

															/>
															{searchTermTitle.length > 0 && (
																cityOptions.length > 0 && (
																	<ul className="city-dropdown form-style" style={{ marginTop: "0px"}}>
																		{cityOptions.map((city) => (
																			<li
																				key={city.id}
																				onClick={() => {
																					handleCitySelectTitle(city.id, city.city_name);
																					setSearchTermTitle('');
																				}}
																				className="city-option"
																			>
																				{city.city_name}
																			</li>
																		))}
																	</ul>
																)
															)}
														</div> */}
													{/* <div className="form-style">
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
														</div> */}

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
														{/* {searchTerm.length > 0 && cityOptions.length === 0 ? (
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
																					handleCitySelect(city.id, city.city_name, city.latitude, city.longitude); // Pass city name to the function
																					setSearchTerm(''); // Clear the search term
																				}}
																				className="city-option"
																			>
																				{city.city_name}
																			</li>
																		))}
																	</ul>
																)
															)} */}

														{searchTerm.length > 0 && (
															cityOptions.length > 0 && (
																<ul className="city-dropdown form-style" style={{ marginTop: "0px" }}>
																	{cityOptions.map((city) => (
																		<li
																			key={city.id}
																			onClick={() => {
																				handleCitySelect(city.id, city.name, city.slug);
																				setSearchTerm('');
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



													{/* {showDistrict && ( */}
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

													</div> */}
													{/* )} */}
													{/* {showNeighbourhood && ( */}
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
														{/* <label className="title-select">{t("neighbourhood")}</label>
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
														)} */}


													</div>


													{/* )} */}
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

													{/* <div className="form-style">
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
														</div> */}


													{/* <div className="form-style">
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
														</div> */}


													<div className="form-style widget-price">
														<label className="title-select" style={{ marginBottom: "0px" }}>{t("price")}</label>
														<div className="group-form">
															<ReactSlider
																ariaLabelledby="slider-label"
																className="horizontal-slider st2"
																min={1000}
																max={initialMaxPrice}
																value={priceRange}
																step={100}
																thumbClassName="example-thumb"
																trackClassName="example-track"
																onChange={handlePriceChange}
															/>

															<div className="group-range-title mt-2">
																<label className="d-flex justify-content-between mb-0">
																	<span>1000DH</span>
																	<span>{priceRange[1]}DH</span>
																</label>
															</div>
														</div>
													</div>

													<div className="form-style widget-price">
														<label className="title-select" style={{ marginBottom: "0px" }}>{t("size")}</label>
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
																	<span>{sizeRange[0]} m²</span>
																	<span>{sizeRange[1]} m²</span>
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
														className="form-style wd-amenities box-amenities-property"
														style={{ display: `${isToggled ? "block" : "none"}` }}
													>
														<div className="group-checkbox">
															<div className="group-amenities">
																{amenities && amenities.length > 0 ? (
																	[...amenities].reverse().map((project) => {
																		if (project.type === "number") {
																			// console.log(project);
																			const selectedValue = filters.amenities_id_object_with_value?.[project.id] || "";

																			return (
																				<>
																					<div className="title-select text-variant-1" htmlFor={project.id}>
																						{t("numberOfAminities")} {project.name}:
																					</div>
																					<fieldset key={project.id} className="box box-fieldse aminities-radio-sec">


																						<div className="radio-group">
																							{[
																								{ label: "1", value: "1" },
																								{ label: "2", value: "2" },
																								{ label: "3", value: "3" },
																								{ label: "3+", value: "4" }
																							].map((option) => (
																								<label key={option.value} className="radio-label custom-radio" style={{ marginRight: '10px' }}>
																									<input
																										type="radio"
																										className="nice-radio"
																										value={option.value}
																										checked={selectedValue === option.value}
																										name={project.id}
																										onChange={() => handleNumberChange(project.id, option.value)}
																									/>
																									<span className="">{option.label}</span>
																								</label>
																							))}
																						</div>
																					</fieldset>
																				</>
																			);
																		}
																		return null;
																	})
																) : null}
															</div>
															{/* <div className="form-style">
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
																</div> */}
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
																						? [...(filters.amenities_id_array || []), amenity.id]
																						: (filters.amenities_id_array || []).filter((id) => id !== amenity.id);

																					setFilters({ ...filters, amenities_id_array: updatedAmenities });
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
												{/* <div className="form-btn-fixed d-flex">
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
														</div> */}
											</div>

										</div>
									</div>
								</div >
							</div >
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
						</form>
					</div >

					<div className="wrap-inner">
						{/* <div className="tab-content" style={{ position: "relative", height: "0px" }}>
							{loading ? (
								<Preloader />
							) : error ? (
								<p>{error}</p>
							) : (
								<div className="property-sec-list">
									{propertys.filter(property => property.status).length === 0 || showNoMore ? (
										<div style={{ textAlign: "center" }}>
											<img
												src="/images/not-found/item-not-found.png"
												alt="No projects found"
												style={{ height: "300px" }}
											/>
										</div>
									) : (
										<>
											{filteredProperties.length > 0 && !showNoMore && (
												<>
													<div className="property-blog-sec" style={{ height: "100%" }}>
														<div
															className="tinder-card"
															style={{
																width: "100%",
																top: 0,
																display: "flex",
																justifyContent: "center",
																alignItems: "center",
																zIndex: 1000,
															}}
														>
															<PropertyBlog data={filteredProperties[currentIndex]} slide={false} calculation={calculationStatus} />
														</div>
														<div className="button-container" style={{ textAlign: "center", paddingBottom: "10px", display: "flex", justifyContent: "center" }}>
															<img
																src="/images/logo/like.svg"
																alt="dislike"
																onClick={handleDislike}
																style={{
																	transform: "rotate(180deg)",
																	cursor: "pointer",
																	marginLeft: "10px",
																	width: "100px",
																	height: "100px",
																}}
															/>
															<img
																src="/images/logo/like.svg"
																alt="like"
																onClick={() => {
																	// console.log("Button clicked", filteredProperties[currentIndex]?.id, lastPropertyId);

																	if (localStorage.getItem('token')) {
																		handleLikeClick();
																		handleLike(
																			filteredProperties[currentIndex]?.like,
																			filteredProperties[currentIndex]?.id,
																			filteredProperties[currentIndex]?.user_id
																		);
																	}
																}}
																style={{ width: "100px", height: "100px", cursor: "pointer" }}
															/>

														</div>
													</div>
													<div className="wrap-map">
														<PropertyMap
															topmap={false}
															singleMap={false}
															propertys={filteredProperties[currentIndex]}
															slug="property"
															lat={filteredProperties[currentIndex].latitude}
															lng={filteredProperties[currentIndex].longitude}
														/>
													</div>
												</>
											)}
										</>
									)}
								</div>
							)}
						</div> */}
						<div className="tab-content">
							<div className={(isSwitch) ? "property-sec-list hide-main-section" : "property-sec-list"}>
								<div className="project-listing-pagination">
									<div className="box-title-listing style-1">
										<h5>{t("propertylisting")}</h5>
										<div className="flex items-center cursor-pointer select-none">
											{/* <span className="switch-text">{t('switchMapText')}</span> */}
											{/* <Image src="/images/logo/location-solid.svg" alt="switch"></Image> */}
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
										) : propertys.length === 0 ? (
											<p>Not Found</p>
										) : (

											<div className="row">
												{propertys.map((property) => (
													<div className={(isSwitch) ? "col-md-6 property-inner-sec" : "col-md-6"} key={property.id}>
														<div className="homeya-box">
															<div className="archive-top">
																<div
																	className="images-group"
																>

																	<div className="images-style">
																		<Swiper
																			modules={[Navigation]}
																			slidesPerView={1}
																			loop={property.picture.length > 1}
																			navigation={property.picture.length > 1}
																			className="property-slider"
																		>
																			{(property.picture.length > 0 ? property.picture : ["/images/banner/no-banner.png"]).map(
																				(item, index) => (
																					<SwiperSlide key={index}>
																						<Link href={`/property/${property.slug}`} className="link">
																							<img src={item} alt="img-property" style={{ width: "100%", borderRadius: "8px", minHeight: "300px", maxHeight:" 300px" }} />
																						</Link>
																					</SwiperSlide>
																				)
																			)}
																		</Swiper>
																	</div>
																	<div className="top">
																	<ul className="d-flex gap-8">
																			<li className="flag-tag style-1">{t(property.transaction)}</li>
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
																	<div className="left-side">
																		<ul className="d-flex gap-8">
																			<li className={`${property.like ? "liked" : "w-40 box-icon"}`} onClick={() => handleLike(property.like, property.id, property.user_id)}>
																				<span className="icon icon-heart" style={{ fontSize: "30px" }} />
																			</li>
																		</ul>
																	</div>
																	<div className="bottom">
																		<span className="flag-tag style-2">{property.type_details.title}</span>
																	</div>
																</div>
																<Link href={`/property/${property.slug}`} className="link">
																	<div className="content">
																		<div className="h7 text-capitalize fw-7">
																			{/* <Link href={`/property/${property.slug}`} className="link"> */}
																			{property.title}
																			{/* </Link> */}
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
																			<li class="filteration">
																				<PercentageHeart percentage={property.filter_result.total_percentage} />
																			</li>
																		</ul>
																	</div>
																</Link>
															</div>
															<Link href={`/property/${property.slug}`} className="link">
																<div className="archive-bottom d-flex justify-content-between align-items-center">
																	<div className="d-flex gap-8 align-items-center">
																		<div className="avatar avt-40 round">
																			<img src={property.user_image || '/images/avatar/user-image.png'} alt="user" />
																		</div>
																		<span>{property.user_name}</span>
																	</div>
																	<div className="d-flex align-items-center">
																		<h6>{property.price} {property.currency}</h6>
																		<span className="text-variant-1"></span>
																	</div>
																</div>
															</Link>
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
									<ProjectMap topmap={false} singleMap={false} propertys={propertys} slug="property" />
								</div>
							</div>
						</div>

					</div >
				</section >

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