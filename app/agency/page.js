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
	const [pagination, setPagination] = useState({
		totalCount: 0,
		totalPages: 0,
		currentPage: variablesList.currentPage,
		itemsPerPage: variablesList.itemsPerPage,
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

	const fetchAgencyList = async (page = 1, updatedFilters = {}) => {
		setLoading(true);
		try {
			// Set the filters to the updated filters, defaulting to empty values if not provided
			const requestData = {
				page,
				limit: pagination.itemsPerPage,
				...updatedFilters, // Spread the updated filters only (dynamic fields)
			};
			console.log(requestData);
			const response = await getData("api/agencies", requestData, true);
			console.log(response);
			if (response.status) {
				const { list, totalCount, totalPages, currentPage, project_meta_details, maxPriceSliderRange, cities } = response.data;
				setAgencyList(list);
				setPagination({
					...pagination,
					totalCount,
					totalPages,
					currentPage,
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

	const fetchDistrict = async (cityId) => {
		try {
			const response = await getData('/api/district/getbycity', { city_id: cityId }, true);
			setDistricts(response.data); // Update district dropdown options
		} catch (error) {
			console.error('Error fetching districts:', error);
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
		fetchAgencyList(1, updatedFilters);  // Fetch data with updated filters
	};

	useEffect(() => {
		fetchAgencyList(pagination.currentPage);
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
	console.log('>>>>>>>>agencyList', agencyList);
	return (
		<>

			<Layout headerStyle={1}>
				<section className="wrapper-layout-3">
					<div className="wrap-sidebar">
						<div className="flat-tab flat-tab-form widget-filter-search">
							<div className="h7 title fw-7">Search</div>

							<div className="tab-content">
								<div className="tab-pane fade active show" role="tabpanel">
									<div className="form-sl">
										{/* <form method="post" onSubmit={(e) => { e.preventDefault(); applyFilters(); }}> */}
										<form method="post" onSubmit={(e) => { e.preventDefault(); }}>
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
													{/* <div className="form-btn-fixed">
														<button className="tf-btn primary" href="#">{t("findagency")}</button>
													</div> */}
												</div>
											</div>
										</form>
									</div>
								</div>
							</div >
						</div >
					</div >
					<div className="wrap-inner-55">
						<div className="box-title-listing style-1">
							<h5>Agency listing</h5>
						</div>
						<div className="tab-content">

							{loading ? (
								<Preloader />
							) : error ? (
								<p>{error}</p>
							) : agencyList.length === 0 ? (
								<p>Not Found</p>
							) : (
								<div className="row">
									{agencyList.map((agencyUserData) => (
										<div className="col-md-4" key={agencyUserData.id}>
											<div className="homeya-box">
												<div className="archive-top">
													<Link
														href={`/agency/${agencyUserData.user_id}`}
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
													<div className="content">
														<div className="h7 text-capitalize fw-7">
															<Link
																href={`/agency/${agencyUserData.id}`}// Pass ID as query param
																className="link"
															>
																{agencyUserData.user_name}
															</Link>
														</div>
														{/* <div className="desc">
															<i className="fs-16 icon icon-mapPin" />
															<p>
																{[ project?.district, project?.city, project?.state]
																	.filter(Boolean)
																	.join(', ')} </p>

														</div> */}
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