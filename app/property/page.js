'use client'
import PropertyMap from "@/components/elements/PropertyMap"
import RangeSlider from "@/components/elements/RangeSlider"
import SidebarFilter from "@/components/elements/SidebarFilter"
import { useRouter } from 'next/navigation';
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
import { formatPropertyPrice } from "@/components/common/Functions";

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
	const [priceRange, setPriceRange] = useState([1000, 1000000]); // Selected range
	const [sizeRange, setSizeRange] = useState([0, 2000]); // Selected range
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
	const [isFocused, setIsFocused] = useState(false);
	const [isFilterProperty, setIsFilterProperty] = useState(true);
	const [isPropertyViewMobile, setIsPropertyViewMobile] = useState(false);
	const [isPropertyViewMap, setIsPropertyViewMap] = useState(false);
	const [isDefaultPropertyViewMobile, setIsDefaultPropertyViewMobile] = useState(false);
	const [pagination, setPagination] = useState({
		totalCount: 0,
		totalPages: 1,
		currentPage: variablesList.currentPage,
		itemsPerPage: 4,
	}); // Track pagination info
	const defaultData = {
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
	};
	const [maxsizeVal, setMaxsizeVal] = useState(sizeRange[1]? sizeRange[1] : 2000);
	const [filters, setFilters] = useState(defaultData);

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
	const [seachAccordion, setSeachAccordion] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	
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

	//const isApiCalled = useRef(false);

	useEffect(() => {
		//if (isApiCalled.current) return;
		setLoading(true);
		const propertyFilterData = JSON.parse(localStorage.getItem('propertyFilterData'));
		const getFilterStatus = sessionStorage.getItem('filterStatus');
		if (propertyFilterData && typeof propertyFilterData === 'object' && isFilterProperty) {
			//sessionStorage.removeItem('filterStatus')
			console.log(localStorage.getItem('transaction'),'>>>>>>>>>> transaction')
			//setTransaction(propertyFilterData.transaction);
			setTransaction(localStorage.getItem('transaction'));
			setCheckURL(true);
			const params = {
				title: propertyFilterData.title || null,
				description: propertyFilterData.description || null,
				type_id: propertyFilterData.type_id || null,
				city: propertyFilterData.city || null,
				city_name: propertyFilterData.city_name || null,
				city_slug: propertyFilterData.city_slug || null,
				district_name: propertyFilterData.district_name || null,
				neighbourhood_name: propertyFilterData.neighbourhood_name || null,
				district: propertyFilterData.district || null,
				neighbourhood: propertyFilterData.neighbourhood || null,
				minPrice: propertyFilterData.minPrice !== "undefined" ? propertyFilterData.minPrice : priceRange[0],
				maxPrice: propertyFilterData.maxPrice !== "undefined" ? propertyFilterData.maxPrice : priceRange[1],
				minSize: propertyFilterData.minSize !== "undefined" ? propertyFilterData.minSize : sizeRange[0],
				maxSize: propertyFilterData.maxSize !== "undefined" ? propertyFilterData.maxSize : sizeRange[1],
				amenities_id_object_with_value: propertyFilterData.amenities_id_object_with_value
					? JSON.parse(propertyFilterData.amenities_id_object_with_value)
					: null,
				amenities_id_array: propertyFilterData.amenities_id_array || null,
				developer_id: propertyFilterData.developer_id || null,
				direction: propertyFilterData.direction || null,
				transaction: propertyFilterData.transaction || null,
			};

			console.log("Extracted Parameters:", params);
			console.log("Extracted Parameters:", params.transaction);

			setFilters(() => ({
				...params,
			}));
			// console.log(params, '>>>>>>>>>>>>> Params')
			// console.log(params.minPrice, "/////////////")
			// console.log(params.maxPrice, "/////////////")
			if (params.maxSize == "null" && params.maxPrice == "null") {
				console.log(2)
				setPriceRange([0, 300000]);
				setSizeRange([0, 2000]);
			} else {
				console.log(1);
				console.log(params,">>>>>>>>>>>>> params");
				setPriceRange([params.minPrice, params.maxPrice]);
				setSizeRange([params.minSize, params.maxSize]);
			}
				
			handleCitySelect(params.city, params.city_name, params.city_slug);
			handleDistrictSelect(params.district, params.district_name);
			handleNeighbourhoodSelect(params.neighbourhood, params.neighbourhood_name);


			const getFilterData = async (page = 1,) => {
				// console.log("Filters:", filters);
				const lang = i18n.language;
				const transactionData = params.transaction;
				const requestData = {
					page,
					lang,
					limit: pagination.itemsPerPage,
					title: params.title,
					description: params.description,
					city_id: params.city,
					district_id: params.district,
					neighborhoods_id: params.neighbourhood,
					type_id: params.type_id,
					...(params.minPrice > 0 && { minPrice: params.minPrice }),
					...(params.maxPrice > 0 && { maxPrice: params.maxPrice }),
					...(params.minSize > 0 && { minSize: params.minSize }),
					...(params.maxSize > 0 && { maxSize: params.maxSize }),
					amenities_id_array: params.amenities_id_array,
					direction: params.direction,
					developer_id: params.developer_id,
					amenities_id_object_with_value: params.amenities_id_object_with_value,
					transaction: transactionData
				};
				 console.log(requestData, " >>>>>>>>>>>>>>>>> requestData .....................")
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
								console.log(3);
								setPriceRange([1000, maxPriceSliderRange]);
							}
						} else {
							console.log(4);
							setInitialMaxPrice(300000);
							setMaxPriceSliderRange(300000);
							setPriceRange([0, 300000]);
						}

					}

					if (!initialMaxSize) {
						if (maxSizeSliderRange !== null) {
							setInitialMaxSize(maxSizeSliderRange);
							setMaxsizeVal(maxSizeSliderRange)
							if (params.minSize == undefined && params.maxSize == undefined) {
								setSizeRange([0, maxSizeSliderRange])
							}
						} else {
							setInitialMaxSize(2000);
							setSizeRange([0, 2000]);
						}

					}
					setError(null);
					const getSwitch = localStorage.getItem('switchState');
					//console.log(getSwitch,'>>>>> Switch');
					if (getSwitch !== null) {
						const IsSwitch = JSON.parse(getSwitch);
						setIsSwitch(IsSwitch);
					}

					setLoading(false);
				} else {
					setLoading(false);
				}
			};
			getFilterData(pagination.currentPage);
			console.log(transaction,'>>>>>>>> transaction Lod');
			//isApiCalled.current = true;
		} else {
			setIsFilterProperty(false)
			//  fetchPropertys(pagination.currentPage);
			handleSubmit(pagination.currentPage);
			//isApiCalled.current = true;
		}

		const checkViewport = () => {
			const mobileView = (window.innerWidth < 769) ? true : false;
			setIsMobile((window.innerWidth < 769) ? true : false);
			console.log(mobileView, ' >>>>>>>>>>>>>>> isMobile')
			if(!mobileView){
				setSeachAccordion(true);
				setIsDefaultPropertyViewMobile(false);
				setIsPropertyViewMobile(true);
			}else{
				setSeachAccordion(false);
				setIsDefaultPropertyViewMobile(true);
				setIsPropertyViewMobile(true);
			}
		};
	   
		checkViewport();
	}, [params, pagination.currentPage, i18n.language]);
	
	
	console.log(isDefaultPropertyViewMobile, "///////////// isDefaultPropertyViewMobile ////////////")
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
				city_name: value,
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
					console.log(5);
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
		setIsFilterProperty(false)
		console.log(pagination,'>>>>>>>>> pagination');
		//sessionStorage.removeItem('filterStatus')
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
	const handleSubmit = async (event, page = pagination.currentPage) => {

		const form = event.target;
		const pageNumber = (form)? 1 : pagination.currentPage;

		const formData = new FormData(form);
		const filterationVal = (filters.transaction)? filters.transaction : transaction;
		console.log(form,'>>>>>>>>>> event');
		setCalculationStatus(true);
		if(isMobile){
			setSeachAccordion(false);
		}
		setLoading(true);
		console.log(filters, '>>>>>>>>>>>>> Filters')
		const selctCityId = (formData.get('city') === "") ? null :filters.city;
		const lang = i18n.language;
		const requestData = {
			page: pageNumber,
			lang,
			limit: pagination.itemsPerPage,

			title: filters.title,
			description: filters.description,
			city_id: selctCityId,
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
		setPriceRange([requestData.minPrice, requestData.maxPrice]);
		setSizeRange([requestData.minSize, requestData.maxSize]);

		console.log('requestData', requestData, '>>>>>>>>>> After')
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
				console.log(6);
				//setPriceRange([filters.minPrice, filters.maxPrice]);
			}

			if (!initialMaxSize) {
				setInitialMaxSize(maxSizeSliderRange);
				//setSizeRange([0, maxSizeSliderRange])
				//setSizeRange([filters.minSize, filters.maxSize]);
			}
			setError(null);
			setLoading(false);
			if(isMobile){
				setIsPropertyViewMobile(true)
				setIsPropertyViewMap(false)
			}
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
		localStorage.setItem('switchState', e.target.checked);
		setIsSwitch(e.target.checked);
	}

	const router = useRouter();

	const handleClick = (slug) => {
		localStorage.setItem('switchState', JSON.stringify(isSwitch));
		router.push(`/property/${slug}`);
	};
	const handlesearchAccordion = (status) =>{
		const updateStatus = (status)?false:true;
		setSeachAccordion(updateStatus);
	}
	const handleClearAll = () =>{
		setSearchCity("")
		setPriceRange([1000, 1000000])
		console.log(maxsizeVal,"maxsizeVal")
		setSizeRange([0, maxsizeVal])
		setFilters((prevFilters) => ({
			...prevFilters,
			maxPrice: 1000000,
			maxSize: maxsizeVal,		
			minPrice: 1000,
			minSize: 0,
			type_id: '',
			amenities_id_object_with_value: {},
			amenities_id_array:[]
		}));
		
		defaultData.minPrice = 0;
		defaultData.maxPrice = 1000000;
		defaultData.minSize = 0;
		defaultData.amenities_id_object_with_value = "{}";
		defaultData.transaction = transaction;
		defaultData.maxSize = maxsizeVal;
		handleSubmit(pagination.currentPage);
		localStorage.setItem('propertyFilterData', JSON.stringify(defaultData));
	}

	const handlePropertyview = () => {
		setIsPropertyViewMobile(true)
		setIsPropertyViewMap(false)
	}
	const handlePropertyMapview = (e) => {
		setIsPropertyViewMap(true)
		setIsPropertyViewMobile(false)
		//setIsDefaultPropertyViewMobile(false)
	}
	return (
		<>
			{(!propertys && loading) ?
				<Preloader /> :
				<>
					<Layout headerStyle={1} footerStyle={1}>
						<section className="wrapper-layout-3 property-sec">
							{isMobile && (
								<div className="accordion-section">
									<button
										onClick={() =>handlesearchAccordion(seachAccordion)}
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
								<div className="filter-section">
									<div className="wrap-sidebar property-inner-sec">
										<form method="post" className="property-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }}>
											<div className="flat-tab flat-tab-form widget-filter-search property-filter">
												<div className="h7 title fw-7 search-text">{t("search")}</div>
												<ul className="nav-tab-form" role="tablist" onClick={filterSet}>
													<TabNav transaction={setTransaction} />
												</ul>
												<div className="tab-content">
													<div className="tab-pane fade active show" role="tabpanel">
														<div className="form-sl">
															<div className="wd-filter-select">
																<div className="inner-group inner-filter">
																	<div className="form-style">
																		<label className="title-select">{t("location")}</label>
																		<input
																			type="text"
																			className="form-control"
																			id="city_property"
																			name="city"
																			value={searchCity ?? ''}
																			onChange={handleInputChange}
																			onFocus={() => {
																				setIsFocused(true);
																				// If no search term, we'll still show predefined cities
																				if (!searchCity || searchCity.length === 0) {
																					// You can set predefined cities here or use existing cityOptions state
																					setCityOptions([
																						{ id: "bbc4c04e-0e2c-4c47-9627-d1fb4b1fb415", name: "Casablanca", slug: "casablanca" },
																						{ id: "885a0061-f10f-499c-beed-ba98ac5a3ef7", name: "Rabat", slug: "rabat" },
																						{ id: "3cd31d23-d688-42a6-a207-9a2a96f88a89", name: "Agadir", slug: "agadir" },
																						{ id: "c9d714ba-331a-4634-b92e-1511a17c0f25", name: "Tanger", slug: "tanger" },
																						{ id: "6880643f-8441-40b2-92e4-98a5a9e44070", name: "Marrakech", slug: "marrakech" },
																						{ id: "eb9e825d-a8a0-4726-ba6f-790c5da0af00", name: "Fes", slug: "fes" }
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

																	<div className="form-style">
																		<label className="title-select">{t("propertytype")}</label>
																		<select
																			className="form-control"
																			id="property_type"
																			name="type_id"
																			value={filters.type_id ?? ''}
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
																	<div className="form-style widget-price">
																		<label className="title-select" style={{ marginBottom: "0px" }}>{t("price")}</label>
																		<div className="group-form">
																			{Array.isArray(priceRange) && priceRange.length === 2 && (
																				<ReactSlider
																					ariaLabelledby="slider-label"
																					className="horizontal-slider st2"
																					min={1000}
																					max={initialMaxPrice}
																					value={priceRange ?? ''}
																					step={100}
																					thumbClassName="example-thumb"
																					trackClassName="example-track"
																					onChange={handlePriceChange}
																				/>
																			)}

																			<div className="group-range-title mt-2">
																				<label className="d-flex justify-content-between mb-0">
																					<span>{formatPropertyPrice(priceRange[0])} DH</span>
																					<span>{formatPropertyPrice(priceRange[1])} DH</span>
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
																				value={sizeRange ?? 0}
																				thumbClassName="example-thumb"
																				trackClassName="example-track"
																				onChange={handleSizeChange}
																			/>

																			<div className="group-range-title mt-2">
																				<label className="d-flex justify-content-between mb-0">
																					<span>{sizeRange[0] ?? 0} m²</span>
																					<span>{sizeRange[1] ?? 0} m²</span>
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
																							const selectedValue = filters.amenities_id_object_with_value?.[project.id] || "";

																							return (
																								<div key={project.id} className="amenity-group">
																									<div className="title-select text-variant-1" htmlFor={project.id}>
																										{t("numberOfAminities")} {project.name}:
																									</div>
																									<fieldset className="box box-fieldse aminities-radio-sec">
																										<div className="radio-group">
																											{[
																												{ label: "1", value: "1" },
																												{ label: "2", value: "2" },
																												{ label: "3", value: "3" },
																												{ label: "3+", value: "4" }
																											].map((option) => (
																												<label key={`${project.id}-${option.value}`} className="radio-label custom-radio" style={{ marginRight: '10px' }}>
																													<input
																														type="radio"
																														className="nice-radio"
																														value={option.value}
																														checked={selectedValue === option.value}
																														name={project.id}
																														onChange={() => handleNumberChange(project.id, option.value)}
																													/>
																													<span>{option.label}</span>
																												</label>
																											))}
																										</div>
																									</fieldset>
																								</div>
																							);
																						}
																						return null;
																					})
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
															</div>
														</div>
													</div>
												</div>
											</div>
											<div className="form-btn-fixed d-flex">
												<button
													type="button"
													className="tf-btn primary clear-btn"
													onClick = {() => handleClearAll()}
												>
													{t("clearAll")}
												</button>
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
										</form>
									</div>
								</div>
							)}
							<div className="wrap-inner">
								<div className="tab-content">
									<div className={(isSwitch) ? "property-sec-list hide-main-section" : "property-sec-list"}>
										<div className="project-listing-pagination">
												<div className="box-title-listing style-1">
													<h5>{t("propertylisting")}</h5>
													{(!isDefaultPropertyViewMobile) &&(
														<div className="flex items-center cursor-pointer select-none">
															{/* <span className="switch-text">{t('switchMapText')}</span> */}
															{/* <Image src="/images/logo/location-solid.svg" alt="switch"></Image> */}
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
											
											{( isDefaultPropertyViewMobile)  && (
												<div className="property-change-view">
													<button 
														className={`tf-btn primary-1 ${isPropertyViewMobile ? 'property-active' : ''}`}
														onClick={() => handlePropertyview()}
													>
														{t('property')}
													</button>
													<button 
														className={`tf-btn primary-1 ${isPropertyViewMap ? 'property-active' : ''}`}
														onClick={(e) => handlePropertyMapview(e)}
													>
														{t('map')}
													</button>
												</div>
											)}
											<div className={`project-listing 
												${( isPropertyViewMobile)? 'property-show-mobile' : 'property-hide-mobile'} 
												`}>
												{(!propertys  && loading) ? (
													<Preloader />
												) : error ? (
													<p>{error}</p>
												) : propertys.length > 0 ?(

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
																							<SwiperSlide
																								key={index}
																								onClick={() => handleClick(property.slug)} // <-- FIX: now it's a function
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
																					<li className="flag-tag style-1">{t(property.transaction)}</li>
																				</ul>
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
																		<div onClick={() => handleClick(property.slug)} className="link">
																			<div className="content">
																				<div className="h7 text-capitalize fw-7 truncate-text">
																					{/* <Link href={`/property/${property.slug}`} className="link"> */}
																					{property.title}
																					{/* </Link> */}
																				</div>
																				<div className="desc">
																					<i className="fs-16 icon icon-mapPin" />
																					<p className="truncate-text">{[property?.district, property?.city, property?.state]
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
																					<li className="filteration">
																						<PercentageHeart percentage={property.filter_result.total_percentage} />
																					</li>
																				</ul>
																			</div>
																		</div>
																	</div>
																	<div onClick={() => handleClick(property.slug)} className="link">
																		<div className="archive-bottom d-flex justify-content-between align-items-center">
																			<div className="d-flex gap-8 align-items-center">
																				<div className="avatar avt-40 round">
																					<img src={property.user_image || '/images/avatar/user-image.png'} alt="user" />
																				</div>
																				<span>{property.user_name}</span>
																			</div>
																			<div className="d-flex align-items-center">
																			<h6>{formatPropertyPrice(property.price)} {property.currency}</h6>
																			<span className="text-variant-1"></span>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														))}
													</div>

												) : (
													<div style={{ textAlign: "center" }}>
														<img
															src="/images/not-found/item-not-found.png"
															alt="No projects found"
															style={{ height: "300px" }}
														/>
													</div>
												) }
											</div>
											{pagination.totalCount > pagination.itemsPerPage && (
												<div className={`${( isPropertyViewMobile)? 'property-show-mobile' : 'property-hide-mobile'}`}>
													<ul className={`wd-navigation  `}>
														{console.log(pagination,'>>>>>>>>>>>>>> current')}
														{Array.from({ length: pagination.totalPages }, (_, index) => (
															<li key={index}>
																<div
																	href="#"
																	className={`nav-item ${pagination.currentPage === index + 1 ? 'active' : ''}`}
																	onClick={() => handlePageChange(index + 1)}
																>
																	{index + 1}
																</div>
															</li>
														))}
													</ul>
												</div>
											)}
										</div>
										<div className={ ` ${(isSwitch) ? "wrap-map map-section-hide" : "wrap-map" } ${( (isDefaultPropertyViewMobile)? (isPropertyViewMap )? 'property-show-mobile' : 'property-hide-mobile' : '')} ` }>
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
			}
		</>
	)
}