'use client'
import PropertyMap from "@/components/elements/PropertyMap"
import RangeSlider from "@/components/elements/RangeSlider"
import SidebarFilter from "@/components/elements/SidebarFilter"
import TabNav from "@/components/elements/TabNav"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { getData } from "../../components/api/Helper";
import ReactSlider from "react-slider"
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import Preloader from "@/components/elements/Preloader";
export default function PropertyHalfmapList() {
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
	const [propertys, setPropertys] = useState([]); // Store properties for the current page
	const [loading, setLoading] = useState(true); // Manage loading state
	const [error, setError] = useState(null); // Manage error state
	const [searchTerm, setSearchTerm] = useState(''); // Store search input
	const [statusFilter, setStatusFilter] = useState(''); // Store selected status filter
	const [amenities, setAmenities] = useState([]);
	const [pagination, setPagination] = useState({
		totalCount: 0,
		totalPages: 1,
		currentPage: 1,
		itemsPerPage: 10,
	}); // Track pagination info
	const [filters, setFilters] = useState({
		title: '',
		description: '',
		minPrice: priceRange[0],
		maxPrice: priceRange[1],
		amenities_id: [],
		type_id: ''
	});

	const fetchPropertys = async (page = 1, updatedFilters = {}) => {
		setLoading(true);
		try {
			// Set the filters to the updated filters, defaulting to empty values if not provided
			const requestData = {
				page,
				limit: pagination.itemsPerPage,
				...updatedFilters, // Spread the updated filters only (dynamic fields)
			};

			const response = await getData("api/property", requestData, true);
			if (response.status) {
				const { list, totalCount, totalPages, currentPage, property_meta_details, maxPriceSliderRange } = response.data;
				setPropertys(list);
				setPagination({
					...pagination,
					totalCount,
					totalPages,
					currentPage,
				});
				setAmenities(property_meta_details);
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
		setFilters({
			...filters,
			[name]: value, // Dynamically update filters based on input name
		});
	};

	// Handle Amenities Change (Multi-Select)
	const handleAmenitiesChange = (selectedAmenities) => {
		setFilters({
			...filters,
			amenities_id: selectedAmenities,
		});
	};

	const getChangedFilters = () => {
		const changedFilters = {};

		// Loop through all filter fields and include only the ones that are not empty or default
		Object.keys(filters).forEach(key => {
			// Include filter only if its value is not the default (empty string or empty array)
			if (filters[key] !== '' && filters[key] !== undefined && filters[key] !== null && (Array.isArray(filters[key]) ? filters[key].length > 0 : true)) {
				changedFilters[key] = filters[key];
			}
		});

		return changedFilters;
	};
	// Apply Filters Button
	const applyFilters = () => {
		const updatedFilters = getChangedFilters();  // Get only changed filters
		fetchPropertys(1, updatedFilters);  // Fetch data with updated filters
	};

	useEffect(() => {
		fetchPropertys(pagination.currentPage);
	}, [pagination.currentPage]);

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
	console.log('>>>>>>>>propertys', propertys);
	console.log('>>>>>>>>', propertys[0]?.type_details);
	return (
		<>

			<Layout headerStyle={1}>
				<section className="wrapper-layout-3">
					<div className="wrap-sidebar">
						<div className="flat-tab flat-tab-form widget-filter-search">
							<div className="h7 title fw-7">Search</div>
							<ul className="nav-tab-form" role="tablist">
								<TabNav />
							</ul>
							<div className="tab-content">
								<div className="tab-pane fade active show" role="tabpanel">
									<div className="form-sl">
										<form method="post" onSubmit={(e) => { e.preventDefault(); applyFilters(); }}>
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
															placeholder="Search Title"

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
																placeholder="Search Description"

															/>

														</div>
													</div>

													<div className="form-style widget-price">
														<div className="group-form">
															<ReactSlider
																ariaLabelledby="slider-label"
																className="horizontal-slider st2"
																min={0}
																max={initialMaxPrice}
																value={priceRange} // Bind to state
																thumbClassName="example-thumb"
																trackClassName="example-track"
																onChange={handlePriceChange} // Handle changes
															/>

															<div className="group-range-title mt-2">
																<label className="d-flex justify-content-between mb-0">
																	<span>{priceRange[0]}$</span>
																	<span>{priceRange[1]}$</span>
																</label>
															</div>
														</div>
													</div>

													<div className="form-style">
														<label className="title-select">Property Type</label>

													</div>

													<div className="form-style btn-show-advanced" onClick={handleToggle} style={{ display: `${isToggled ? "none" : "block"}` }}>
														<a className="filter-advanced pull-right">
															<span className="icon icon-faders" />
															<span className="text-advanced">Show Advanced</span>
														</a>
													</div>
													<div className="form-style wd-amenities" style={{ display: `${isToggled ? "block" : "none"}` }}>
														<div className="group-checkbox">
															<div className="text-1">Amenities:</div>
															<div className="group-amenities">
																{amenities.map((amenity) => (
																	<fieldset className="amenities-item" key={amenity.id}>
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
																		<label htmlFor={`amenity-${amenity.id}`} className="text-cb-amenities">
																			{amenity.name}
																		</label>
																	</fieldset>
																))}
															</div>
														</div>
													</div>
													<div className="form-style btn-hide-advanced" onClick={handleToggle} style={{ display: `${isToggled ? "block" : "none"}` }}>
														<a className="filter-advanced pull-right">
															<span className="icon icon-faders" />
															<span className="text-advanced">Hide Advanced</span>
														</a>
													</div>
													<div className="form-btn-fixed">
														<button type="submit" className="tf-btn primary" href="#">{t("findproperties")}</button>
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
							<h5>Property listing</h5>
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
							) : propertys.length === 0 ? (
								<p>Not Found</p>
							) : (

								<div className="row">
									{propertys.map((property) => (
										<div className="col-md-6" key={property.id}>
											<div className="homeya-box">
												<div className="archive-top">
													<Link
														href={`/property/${property.id}`}
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
															<span className="flag-tag style-2">{property.type_details[0].title}</span>
														</div>
													</Link>
													<div className="content">
														<div className="h7 text-capitalize fw-7">
															<Link href={`/property/${property.id}`} className="link">
																{property.title}
															</Link>
														</div>
														<div className="desc">
															<i className="fs-16 icon icon-mapPin" />
															<p>{property.address}</p>
														</div>
														<ul className="meta-list">
															<li className="item">
																<i className="icon icon-bed" />
																<span>{property.bedRooms}</span>
															</li>
															<li className="item">
																<i className="icon icon-bathtub" />
																<span>{property.bathRooms}</span>
															</li>
															<li className="item">
																<i className="icon icon-ruler" />
																<span>{property.size} SqFT</span>
															</li>
														</ul>
													</div>
												</div>
												<div className="archive-bottom d-flex justify-content-between align-items-center">
													<div className="d-flex gap-8 align-items-center">
														<div className="avatar avt-40 round">
															<img src={property.user_image || '/images/avatar/user-image.png'} alt="user" />
														</div>
														<span>{property.user_name}</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>{property.currency}{property.price}</h6>
														<span className="text-variant-1"></span>
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
					</div >
					<div className="wrap-map">
						<PropertyMap topmap={false} singleMap={false} propertys={propertys}/>
					</div>
				</section >

			</Layout >
		</>
	)
}