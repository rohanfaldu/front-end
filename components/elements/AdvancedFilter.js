'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import RangeSlider from "./RangeSlider";
import { useTranslation } from "react-i18next";
import variablesList from "../common/Variable";
import { getData, insertData } from "../../components/api/Helper";
import ReactSlider from "react-slider"
import debounce from "lodash.debounce";

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
	const [transaction, setTransaction] = useState();
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

	const [showDistrict, setShowDistrict] = useState(false);
	const [showNeighbourhood, setShowNeighbourhood] = useState(false);
	const [cityId, setCityId] = useState(['']);
	const [districtId, setDistrictId] = useState(['']);

	const [pagination, setPagination] = useState({
		totalCount: 0,
		totalPages: 1,
		currentPage: variablesList.currentPage,
		itemsPerPage: variablesList.itemsPerPage,
	});
	// Initialize formData state
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		type_id: '',
		city: "",
		district: "",
		neighbourhood: "",
		direction: "",
		developer_id: '',
		city_name: '',
		district_name: '',
		neighbourhood_name: '',

		
		// amenities: [],

		minPrice: priceRange[0],
		maxPrice: priceRange[1],
		minSize: sizeRange[0],
		maxSize: sizeRange[1],
		amenities_id_object_with_value: {},
		amenities_id_array: [],


	});

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

	//   const handlePriceChange = (newRange) => {
	// 	setPriceRange(newRange); // Update the range state
	// 	setFormData((prevFilters) => ({
	// 		...prevFilters,
	// 		minPrice: newRange[0], // Set minPrice
	// 		maxPrice: newRange[1], // Set maxPrice
	// 	}));
	// };


	  const handleCitySelect = (cityId, cityName) => {
		console.log(cityName);
		setFormData(() => ({
			...formData,
			city_name: cityName
		}));
		setSearchCity(cityName); // Set the selected city name in the input
		handleFilterChange({ target: { name: 'city', value: cityId } }); // Call filter change with selected city ID
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
		console.log("hit fetchPropertys");
			try {
				const lang = i18n.language;
				const requestData = {
					page,
					lang,
					limit: pagination.itemsPerPage,
					transaction: transaction
				};
				console.log(requestData,";;;;;;;;;;;;;;;;;;;;")
				const response = await getData("api/property", requestData, true);
				console.log('response: ', response);
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
					console.log(property_types,"property_types")
					if (initialMaxPrice !== maxPriceSliderRange) {
						setInitialMaxPrice(maxPriceSliderRange);
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
			setTransaction(localStorage.getItem("transaction"));
			// fetchPropertys(pagination.currentPage);
			if(propertiesData !== undefined){
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
			console.log(property_types,"property_types")
			if (initialMaxPrice !== maxPriceSliderRange) {
				setInitialMaxPrice(maxPriceSliderRange);
				setPriceRange([0, maxPriceSliderRange]);
			}
			if (initialMaxSize !== maxSizeSliderRange){
				setInitialMaxSize(maxSizeSliderRange);
				setSizeRange([0, maxSizeSliderRange])
			}
		}

			fetchCityOptions(searchTerm);
			fetchDistrictOptions(searchTermDistrict)
			fetchNeighbourhoodOptions(searchTermNeighbourhood)
	}, [pagination.currentPage, i18n.language, transaction, searchTerm, searchTermDistrict, searchTermNeighbourhood]);

	const passingData = () => {
		// Create a shallow copy of formData
		const queryData = { ...formData };
	  
		// Stringify the nested object explicitly
		queryData.amenities_id_object_with_value = JSON.stringify(formData.amenities_id_object_with_value);
	  
		// Generate the query string
		const queryString = new URLSearchParams(queryData).toString();
		console.log('queryString: ', queryString);
	  
		// Update the URL
		window.location.href = `/property?${queryString}`;
	  };
	  

	const handleToggle = () => setToggled(!isToggled);

	return (
		<>
			<div className={`wd-find-select ${sidecls ? sidecls : ""}`}>
				<div className="inner-group">
					<div className="form-group-1 search-form form-style">
						<label>{t("keyword")}</label>
						<input
							type="text"
							className="form-control"
							placeholder={t("searchkeyword")}
							name="title"
							title="Search for"
							required
							value={formData.title}
							onChange={handleInputChange}
						/>
					</div>
					{/* <div className="form-group-2 form-style">
						<label>{t("description")}</label>
						<div className="group-ip">
							<input
								type="text"
								className="form-control"
								placeholder={t("searchdescription")}
								name="description"
								title="Search for"
								required
								value={formData.description}
								onChange={handleInputChange}
							/>
						</div>
					</div> */}
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

			<div className="grid-1 group-box">
				<div className="group-select grid-3">
					<div className="form-style">
						<label className="title-select">{t("city")}</label>
						<input
							type="text"
							className="form-control"
							id="city"
							name="city"
							value={searchCity}
							onChange={handleInputChangeCity}
							placeholder={t("searchCity")}
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

					{/* {showDistrict && ( */}
					<div className="form-style">
						<label className="title-select">{t("distric")}</label>
						<input
							type="text"
							className="form-control"
							id="district"
							name="district"
							value={searchDistrict}
							onChange={handleInputChangeDistrict}
							placeholder={t("searchDistrict")}
							disabled ={!showDistrict}
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
					{/* )} */}

					{/* {showNeighbourhood && ( */}
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
								disabled ={!showNeighbourhood}
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
						{/* )} */}

				</div>
			</div>


			<div className="grid-1 group-box">
				<div className="group-select grid-2">
					{/* <div className="form-style">
						<label className="title-select">{t("direction")}</label>
						<select
							className="form-control"
							id="direction"
							name="direction"
							value={formData.direction} 
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
							value={formData.developer_id} 
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
				</div>
			</div>


				<div className="grid-2 group-box group-price">
					<div className="widget-price">
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
									<span>{priceRange[0]}DH</span>
									<span>{priceRange[1]}DH</span>
								</label>
							</div>
						</div>
					</div>
					<div className="widget-price">
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
								<span>{sizeRange[0]} m²</span>
								<span>{sizeRange[1]} m²</span>
							</label>
						</div>
					</div>
					</div>
				</div>
				<div className="grid-1 group-box">

					<div className="group-select grid-4">
							{amenities && amenities.length > 0 ? (
								amenities.map((project) =>
								project.type === "number" ? (
									<fieldset key={project.id} className="box box-fieldset">
									<label className="title-select text-variant-1" htmlFor={project.id}>
										{t("numberOfAminities")}{project.name}:
									</label>
									<input
										type="number"
										className="nice-select"
										value={formData.amenities_id_object_with_value?.[project.id] || ""}
										name={project.id}
										onChange={(e) => handleNumberChange(project.id, e.target.value)}
									/>
									</fieldset>
								) : null
								)
							) : null}

						<div className="form-style">
							<label className="title-select">{t("direction")}</label>
							<select
								className="form-control"
								id="direction"
								name="direction"
								value={formData.direction} 
								onChange={handleFilterChange}
								style={{padding:"10px 16px"}}
							>
								<option value="">{t("selectdiretion")}</option>
								<option value="north">North</option>
								<option value="south">South</option>
								<option value="east">East</option>
								<option value="west">West</option>
							</select>
						</div>
					</div>
				</div>
				<div className="group-checkbox">
					<div className="text-1">Amenities:</div>
					{/* <div className="group-amenities mt-8 grid-6">
						{[
							{ id: "cb1", label: "Air Condition" },
							{ id: "cb2", label: "Cable TV" },
							{ id: "cb3", label: "Ceiling Height" },
							{ id: "cb4", label: "Fireplace" },
							{ id: "cb5", label: "Disabled Access" },
							{ id: "cb6", label: "Elevator" },
							{ id: "cb7", label: "Fence" },
							{ id: "cb8", label: "Garden" },
							{ id: "cb9", label: "Floor" },
							{ id: "cb10", label: "Furnishing" },
							{ id: "cb11", label: "Garage" },
							{ id: "cb12", label: "Pet Friendly" },
							{ id: "cb13", label: "Heating" },
							{ id: "cb14", label: "Intercom" },
							{ id: "cb15", label: "Parking" },
							{ id: "cb16", label: "WiFi" },
							{ id: "cb17", label: "Renovation" },
							{ id: "cb18", label: "Security" },
							{ id: "cb19", label: "Swimming Pool" },
						].map((amenity) => (
							<div className="box-amenities" key={amenity.id}>
								<fieldset className="amenities-item">
									<input
										type="checkbox"
										className="tf-checkbox style-1"
										id={amenity.id}
										checked={formData.amenities.includes(amenity.id)}
										onChange={handleCheckboxChange}
									/>
									<label htmlFor={amenity.id} className="text-cb-amenities">{amenity.label}</label>
								</fieldset>
							</div>
						))}
					</div> */}
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
			</div>
		</>
	);
}
