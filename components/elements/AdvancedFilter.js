'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import RangeSlider from "./RangeSlider";
import { useTranslation } from "react-i18next";
import variablesList from "../common/Variable";
import { getData, insertData } from "../../components/api/Helper";
import ReactSlider from "react-slider"
import debounce from "lodash.debounce";
import { formatPropertyPrice } from "@/components/common/Functions";
import { useRouter } from 'next/navigation';
import TabNav from "@/components/elements/TabNav";
import { useNavigate } from "react-router-dom";

export default function AdvancedFilter({ sidecls, propertiesData }) {
	const [isToggled, setToggled] = useState(false);
	const [propertyType, setpropertyType] = useState([]);
	const [propertys, setPropertys] = useState([]);
	const [amenities, setAmenities] = useState([]);
	const [developers, setDevelopers] = useState([]);
	const [initialMaxPrice, setInitialMaxPrice] = useState(0); // Store the maximum price initially
	const [initialMaxSize, setInitialMaxSize] = useState(0);
	const [sizeRange, setSizeRange] = useState([]);
	const [priceRange, setPriceRange] = useState([]);
	const [transactionData, setTransactionData] = useState("rental");
	const { t, i18n } = useTranslation();
	const [cityOptions, setCityOptions] = useState([]);
	const [error, setError] = useState(null);

	const [searchCity, setSearchCity] = useState('');
	const [searchDistrict, setSearchDistrict] = useState('');
	const [searchNeighbourhood, setSearchNeighbourhood] = useState('');

	const [districtOptions, setDistrictOptions] = useState([]);
	const [neighbourhoodOptions, setNeighbourhoodOptions] = useState([]);

	const [searchTerm, setSearchTerm] = useState('');
	const [searchTermDistrict, setSearchTermDistrict] = useState('');
	const [searchTermNeighbourhood, setSearchTermNeighbourhood] = useState('');
	const [searchTermTitle, setSearchTermTitle] = useState(''); // Store search input

	const [showDistrict, setShowDistrict] = useState(false);
	const [showNeighbourhood, setShowNeighbourhood] = useState(false);
	const [cityId, setCityId] = useState(['']);

	const [districtId, setDistrictId] = useState(['']);
	const defaultSuggestions = ['Apple', 'Banana', 'Orange', 'Pineapple', 'Grapes'];
	const [suggestions, setSuggestions] = useState([]);
	const [formReady, setFormReady] = useState(false);
	const handleFocus = () => {
		setSuggestions(defaultSuggestions);
	};
	const [isFocused, setIsFocused] = useState(false);


	const [pagination, setPagination] = useState({
		totalCount: 0,
		totalPages: 1,
		currentPage: variablesList.currentPage,
		itemsPerPage: variablesList.itemsPerPage,
	});
	// Initialize formData state
	const defaultData = {
		title: '',
		description: '',
		type_id: '',
		city: "",
		district: "",
		neighbourhood: "",
		direction: "",
		developer_id: '',
		city_name: '',
		city_slug: '',
		district_name: '',
		neighbourhood_name: '',
		minPrice: priceRange[0],
		maxPrice: priceRange[1],
		minSize: sizeRange[0],
		maxSize: sizeRange[1],
		amenities_id_object_with_value: {},
		amenities_id_array: [],
	};

	const [formData, setFormData] = useState(defaultData);
	const [maxsizeVal, setMaxsizeVal] = useState(sizeRange[1]? sizeRange[1] : 2000);
	const [maxPriceVal, setMaxPriceVal] = useState(priceRange[1]? priceRange[1] : 10000000);
	const router = useRouter();
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value
		}));
	};
	
	const handleDistrictSelect = (districtId, districtName) => {
		setSearchDistrict(districtName); // Set the selected city name in the input
		setFormData(() => ({
			...formData,
			district_name: districtName
		}));
		handleFilterChange({ target: { name: 'district', value: districtId } }); // Call filter change with selected city ID
	};

	const handleInputChangeCity = (e) => {
		setSearchTerm(e.target.value);
		setSearchCity(e.target.value)
	};

	const handleInputChangeTitle = (e) => {
		setSearchTermTitle(e.target.value);
		setFormData((prevFilters) => ({
			...prevFilters,
			title: e.target.value,
		}))
	};
	//   const handlePriceChange = (newRange) => {
	// 	setPriceRange(newRange); // Update the range state
	// 	setFormData((prevFilters) => ({
	// 		...prevFilters,
	// 		minPrice: newRange[0], // Set minPrice
	// 		maxPrice: newRange[1], // Set maxPrice
	// 	}));
	// };


	const handleCitySelect = (cityId, cityName, slug) => {
		// console.log(cityName);
		setFormData(() => ({
			...formData,
			city_name: cityName,
			city_slug: slug,
			city: cityId
		}));
		setSearchCity(cityName); // Set the selected city name in the input
		handleFilterChange({ target: { name: slug, value: cityId } }); // Call filter change with selected city ID
	};

	const handleCitySelectTitle = (cityId, cityName, latitude, longitude) => {
		setFormData((prevFilters) => ({
			...prevFilters,
			title: cityName,
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

	const handleNeighbourhoodSelect = (neighbourhoodId, neighbourhoodName) => {
		setSearchNeighbourhood(neighbourhoodName);
		setFormData(() => ({
			...formData,
			neighbourhood_name: neighbourhoodName
		}));
		handleFilterChange({ target: { name: 'neighbourhood', value: neighbourhoodId } });
	};

	const handleFilterChange = async (e) => {
		const { name, value } = e.target;

		setFormData((prevFilters) => ({
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

	const fetchPropertys = async (page = 1, updatedFilters = {}) => {
		// console.log("hit fetchPropertys");
		try {
			const lang = i18n.language;
			const requestData = {
				page,
				lang,
				limit: pagination.itemsPerPage,
				transaction: transaction
			};
			// console.log(requestData,";;;;;;;;;;;;;;;;;;;;")
			const response = await getData("api/property", requestData, true);
			// console.log('response: ', response);
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
				// console.log(property_types,"property_types")
				if (initialMaxPrice !== maxPriceSliderRange) {
					setInitialMaxPrice(maxPriceSliderRange);
					setPriceRange([0, maxPriceSliderRange]);
				}

				if (initialMaxSize !== maxSizeSliderRange) {
					setInitialMaxSize(maxSizeSliderRange);
					setSizeRange([0, maxSizeSliderRange])
						
				}
			
				setError(null);
			}
		} catch (err) {
			setError(err.response?.data?.message || "An error occurred");
		}
	};

	const handlePriceChange = (newRange) => {
		setPriceRange(newRange); // Update the range state
		setFormData((prevFilters) => ({
			...prevFilters,
			minPrice: newRange[0], // Set minPrice
			maxPrice: newRange[1], // Set maxPrice
		}));
	};


	const handleSizeChange = (newRange) => {
		setSizeRange(newRange); // Update the range state
		setFormData((prevFilters) => ({
			...prevFilters,
			minSize: newRange[0], // Set minPrice
			maxSize: newRange[1], // Set maxPrice
		}));
	};


	const handleNumberChange = (amenityId, value) => {
		setFormData((prevFilters) => ({
			...prevFilters,
			amenities_id_object_with_value: {
				...prevFilters.amenities_id_object_with_value,
				[amenityId]: value,
			},
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
			//console.log(cityOptions, '>>>>>>>>>>>>>>>> cityOptions')
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


	const handleCheckboxChange = (e) => {
		const { id } = e.target;
		setFormData((prevData) => {
			const amenities = prevData.amenities.includes(id)
				? prevData.amenities.filter(amenity => amenity !== id)
				: [...prevData.amenities, id];
			return { ...prevData, amenities };
		});
	};


	useEffect(() => {
		//setTransaction(localStorage.getItem("transaction"));
		//setTransactionData(localStorage.getItem("transaction"));
		// fetchPropertys(pagination.currentPage);
		//localStorage.setItem("transaction","rental");

		if (!localStorage.getItem("transaction")) {
			localStorage.setItem("transaction", "rental");
		}
		if (propertiesData !== undefined) {
			const { list, totalCount, totalPages, currentPage, property_meta_details, maxPriceSliderRange, property_types, maxSizeSliderRange, developers } = propertiesData;
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
			// console.log(property_types,"property_types")
			// console.log(maxPriceSliderRange,"maxPriceSliderRange")
			if (maxPriceSliderRange !== null) {
				setInitialMaxPrice(maxPriceSliderRange);
				setPriceRange([0, maxPriceSliderRange]);
				setMaxPriceVal(maxPriceSliderRange)
				setFormData((prevFilters) => ({
					...prevFilters,
					minPrice: 1000, // Set minPrice
					maxPrice: maxPriceSliderRange, // Set maxPrice
				}));
			} else {
				setInitialMaxPrice(10000000);
				setPriceRange([0, 10000000]);
				setFormData((prevFilters) => ({
					...prevFilters,
					minPrice: 0, // Set minPrice
					maxPrice: 10000000, // Set maxPrice
				}));
			}


			if (maxSizeSliderRange !== null) {
				setInitialMaxSize(maxSizeSliderRange);
				setSizeRange([0, maxSizeSliderRange])
				setFormData((prevFilters) => ({
					...prevFilters,
					minSize: 0, // Set minPrice
					maxSize: maxSizeSliderRange, // Set maxPrice
				}));
				setMaxsizeVal(maxSizeSliderRange)
			} else {
				setInitialMaxSize(2000);
				setSizeRange([0, 2000])
				setFormData((prevFilters) => ({
					...prevFilters,
					minSize: 0, // Set minPrice
					maxSize: 2000, // Set maxPrice
				}));
			}
		}

		if (searchTerm) {
			fetchCityOptions(searchTerm);
		} else if (searchTermTitle) {
			fetchCityOptions(searchTermTitle);
		}
		fetchDistrictOptions(searchTermDistrict)
		fetchNeighbourhoodOptions(searchTermNeighbourhood);
		if(localStorage.getItem("transaction")){
			setTransactionData(localStorage.getItem("transaction"));
		}
		setFormReady(true);
	}, [pagination.currentPage, i18n.language, transactionData, searchTerm, searchTermDistrict, searchTermNeighbourhood, searchTermTitle]);
	const passingData = () => {
		//const transactionData = localStorage.getItem("transaction") || "rental";
		const updatedFormData = {
			...formData,
			transaction: transactionData,
		};
		console.log(updatedFormData, 'updatedFormData')
		// Create queryData from the updatedFormData
		const queryData = { ...updatedFormData };
		queryData.amenities_id_object_with_value = JSON.stringify(updatedFormData.amenities_id_object_with_value);
		console.log(queryData,)
		// Generate the query string
		const queryString = new URLSearchParams(queryData).toString();
		// console.log('queryString: ', queryString);
		sessionStorage.setItem('filterStatus', true);
		// Update the URL
		// window.location.href = `/property?${queryString}`;
		localStorage.setItem('propertyFilterData', JSON.stringify(queryData));
		router.push(`/property/`);
	};

	const handleToggle = () => setToggled(!isToggled);
	const handleTab = (i) => {
		setTransactionData(i);
		localStorage.setItem("transaction",i)
    };

	const handleClearAll = () =>{
		console.log(defaultData,"defaultData.maxSize")
		console.log(maxsizeVal,"maxsizeVal")
		setSearchCity("")
		setPriceRange([0, maxPriceVal])
		setSizeRange([0, maxsizeVal])
		setFormData((prevFilters) => ({
			...prevFilters,
			maxPrice: maxPriceVal,
			maxSize: maxsizeVal,	
			minPrice: 0,
			minSize: 0,
			type_id: '',
			amenities_id_object_with_value: {},
			amenities_id_array:[]
		}));
		
		defaultData.minPrice = 0;
		defaultData.maxPrice = maxPriceVal;
		defaultData.minSize = 0;
		defaultData.amenities_id_object_with_value = "{}";
		defaultData.transaction = transactionData;
		defaultData.maxSize = maxsizeVal;

		localStorage.setItem('propertyFilterData', JSON.stringify(defaultData));
	}

	if (!formReady) return null;
	
	return (
		<>
			<div className="flat-tab flat-tab-form">
				<form method="post">
					<ul className="nav-tab-form style-1 justify-content-center" role="tablist">
							<li className="nav-tab-item" onClick={() => handleTab('rental')}>
							<a className={transactionData === "rental" ? "nav-link-item active" : "nav-link-item"}>{t("forrent")}</a>
						</li>
						<li className="nav-tab-item" onClick={() => handleTab('sale')}>
							<a className={transactionData === "sale" ? "nav-link-item active" : "nav-link-item"}>{t("forsale")}</a>
						</li>
					</ul>
					<div className="tab-content">
						<div className="tab-pane fade active show" role="tabpanel">
							<div className="form-sl">
								<input type="hidden" name="transaction_new" value={transactionData} />
								<div className={`wd-find-select ${sidecls ? sidecls : ""}`}>
									<div className="inner-group">
										<div className="form-group-1 search-form form-style">
											<label className="title-select">{t("location")}</label>
											<input
												type="text"
												className="form-control"
												id="city"
												name="city"
												value={searchCity}
												onChange={handleInputChangeCity}
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
													<ul className="city-dropdown form-style" style={{ marginTop: "0px", width: "35%", position: "absolute" }}>
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
										<div className="form-group-3 form-style">
											<label>{t("propertytype")}</label>
											<div className="group-select">

												<select
													className="nice-select"
													id="propertyType"
													name="type_id"
													value={formData.type_id}
													onChange={handleInputChange}
												>
													<option value="">{t("selectpropertytype")}</option>
													{propertyType.map((property) => (
														<option key={property.id} value={property.id}>
															{property.title}
														</option>
													))}
												</select>
											</div>
										</div>
										<div className="form-group-4 box-filter">
											<a className="filter-advanced pull-right" onClick={handleToggle}>
												<span className="icon icon-faders" />
												<span className="text-1">{t("advanced")}</span>
											</a>
										</div>
									</div>
									<button type="button" className="tf-btn primary" onClick={passingData}>{t("findproperties")}</button>
								</div>
								<div className={`wd-search-form ${isToggled ? "show" : ""}`}>
									<div className="grid-2 group-box group-price">
										<div className="widget-price">
											<label className="title-select" style={{ marginBottom: "0px" }}>{t("price")}</label>
											<div className="group-form">
												{/* { // console.log(priceRange, ' >>>>>> priceRange')} */}
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
														{(priceRange[0] !== undefined) ? (<span>{formatPropertyPrice(priceRange[0])} DH</span>) : null}
														{(priceRange[1] !== undefined) ? (<span>{formatPropertyPrice(priceRange[1])} DH</span>) : null}
													</label>
												</div>
											</div>
										</div>
										<div className="widget-price">
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
									</div>
									<div className="grid-1 group-box">
										<div className="group-select aminity-filter-sec">
											{amenities && amenities.length > 0 ? (
												[...amenities].reverse().map((project) => {
													if (project.type === "number") {
														const selectedValue = formData.amenities_id_object_with_value?.[project.id] || "";

														return (
															<div key={project.id} className="radio-btn-filter-sec">
																<div className="title-select text-variant-1" htmlFor={project.id}>
																	{t("numberOfAminities")} {project.name}:
																</div>
																<fieldset className="box box-fieldset aminities-radio-sec advance-filter-radio">
																	<div className="radio-group">
																		{[
																			{ label: "1", value: "1" },
																			{ label: "2", value: "2" },
																			{ label: "3", value: "3" },
																			{ label: "3+", value: "4" },
																		].map((option) => (
																			<label
																				key={option.value}
																				className="radio-label custom-radio"
																				style={{ marginRight: "10px" }}
																			>
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
															</div>
														);
													}
													return null;
												})
											) : null}
										</div>
									</div>
									<div className="group-checkbox">
										<div className="text-1">{t("amenities")}:</div>
										<div className="group-amenities mt-8 grid-6">
											{amenities.map((amenity) => (
												amenity.type === "boolean" ? (
													<fieldset className="amenities-item" key={amenity.id}>
														<input
															type="checkbox"
															className="tf-checkbox style-1"
															id={`amenity-${amenity.id}`}
															checked={formData?.amenities_id_array?.includes(amenity.id)} // Updated to amenities_id_array
															onChange={(e) => {
																const updatedAmenities = e.target.checked
																	? [...formData.amenities_id_array, amenity.id] // Updated to amenities_id_array
																	: formData.amenities_id_array.filter((id) => id !== amenity.id); // Updated to amenities_id_array
																setFormData({ ...formData, amenities_id_array: updatedAmenities }); // Updated to amenities_id_array
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
									<div className="group-checkbox filter-clear-btn">
										<div className="form-btn-fixed d-flex">
											<button
												type="button"
												className="tf-btn primary clear-btn"
												onClick = {() => handleClearAll()}
											>
												{t("clearAll")}
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}
