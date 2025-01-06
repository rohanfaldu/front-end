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


export default function ProjectHalfmapList() {
	const [isToggled, setToggled] = useState(false)
	const handleToggle = () => setToggled(!isToggled)

	const [initialMaxPrice, setInitialMaxPrice] = useState(0);
	const [maxPriceSliderRange, setMaxPriceSliderRange] = useState(0);
	const [priceRange, setPriceRange] = useState([]);
	const [isTab, setIsTab] = useState(2)
	const handleTab = (i) => {
		setIsTab(i)
	}
	const { t } = useTranslation();
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('');
	const [amenities, setAmenities] = useState([]);
	const [cities, setCities] = useState([]);
	const [districts, setDistricts] = useState([]);
	const [neighbourhoods, setNeighbourhoods] = useState([]);
	const [pagination, setPagination] = useState({
		totalCount: 0,
		totalPages: 1,
		currentPage: 1,
		itemsPerPage: 10,
	});
	const [filters, setFilters] = useState({
		title: '',
		description: '',
		city: '',
		neighbourhood: '',
		minPrice: priceRange[0],
		maxPrice: priceRange[1],
		amenities_id: [],
	});

	const fetchProjects = async (page = 1, updatedFilters = {}) => {
		setLoading(true);
		try {

			const requestData = {
				page,
				limit: pagination.itemsPerPage,
				...updatedFilters,
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
				setAmenities(project_meta_details || []);
				setCities(cities);
				if (!initialMaxPrice) {
					setInitialMaxPrice(maxPriceSliderRange || 0);
					setMaxPriceSliderRange(maxPriceSliderRange || 0);
					setPriceRange([0, maxPriceSliderRange || 0]);
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
			setDistricts(response.data);
		} catch (error) {
			console.error('Error fetching districts:', error);
		}
	};


	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilters({
			...filters,
			[name]: value,
		});
	};

	const handleAmenitiesChange = (selectedAmenities) => {
		setFilters({
			...filters,
			amenities_id: selectedAmenities,
		});
	};

	const getChangedFilters = () => {
		const changedFilters = {};

		Object.keys(filters).forEach(key => {

			if (filters[key] !== '' && filters[key] !== undefined && filters[key] !== null && (Array.isArray(filters[key]) ? filters[key].length > 0 : true)) {
				changedFilters[key] = filters[key];
			}
		});

		return changedFilters;
	};

	const applyFilters = () => {
		const updatedFilters = getChangedFilters();
		fetchProjects(1, updatedFilters);
	};

	useEffect(() => {
		fetchProjects(pagination.currentPage);
	}, [pagination.currentPage]);

	const handlePageChange = (page) => {
		setPagination({ ...pagination, currentPage: page });
	};

	const handlePriceChange = (newRange) => {
		setPriceRange(newRange);
		setFilters((prevFilters) => ({
			...prevFilters,
			minPrice: newRange[0],
			maxPrice: newRange[1],
		}));
	};
	console.log('>>>>>>>>projects', projects);
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
													<div className="form-style">
														<label className="title-select">{t("city")}</label>
														<select
															className="form-control"
															name="city"
															value={filters.city}
															onChange={handleFilterChange}
														>
															<option value="">Select city</option>
															{cities.map((city) => (
																<option key={city.id} value={city.id}>
																	{city.city_name}
																</option>
															))}
														</select>
													</div>

													<div className="form-style">
														<label className="title-select">{t("district")}</label>
														<select
															className="form-control"
															name="district"
															value={filters.district}
															onChange={handleFilterChange}
															disabled={!filters.city}
														>
															<option value="">Select district</option>
															{districts.map((district) => (
																<option key={district.id} value={district.id}>
																	{district.title}
																</option>
															))}
														</select>
													</div>

													<div className="form-style">
														<label className="title-select">{t("neighbourhood")}</label>
														<select
															className="form-control"
															name="neighbourhood"
															value={filters.neighbourhood}
															onChange={handleFilterChange}
															disabled={!filters.district}
														>
															<option value="">Select neighbourhood</option>
															{neighbourhoods.map((neighbourhood) => (
																<option key={neighbourhood.id} value={neighbourhood.id}>
																	{neighbourhood.title}
																</option>
															))}
														</select>
													</div>


													<div className="form-style widget-price">
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
																						value={filters[amenity.id] || ""}
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
																						checked={filters.amenities_id.includes(amenity.id)}
																						onChange={(e) => {
																							const updatedAmenities = e.target.checked
																								? [...filters.amenities_id, amenity.id]
																								: filters.amenities_id.filter((id) => id !== amenity.id);
																							setFilters({ ...filters, amenities_id: updatedAmenities });
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
													</div>
													<div className="form-style btn-hide-advanced" onClick={handleToggle} style={{ display: `${isToggled ? "block" : "none"}` }}>
														<a className="filter-advanced pull-right">
															<span className="icon icon-faders" />
															<span className="text-advanced">Hide Advanced</span>
														</a>
													</div>
													<div className="form-btn-fixed">
														<button type="submit" className="tf-btn primary" href="#">{t("findprojects")}</button>
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
							<h5>Project listing</h5>
							<div className="box-filter-tab">

							</div>
						</div>
						<div className="tab-content">

							{loading ? (
								<Preloader />
							) : error ? (
								<p>{error}</p>
							) : projects.length === 0 ? (
								<p>Not Found</p>
							) : (
								<div className="row">
									{projects.map((project) => (
										<div className="col-md-6" key={project.id}>
											<div className="homeya-box">
												<div className="archive-top">
													<Link
														href={`/project/${project.slug}`}
														className="images-group"
													>

														<div className="images-style">
															<img
																src={project.picture[0] || "/images/banner/no-banner.png"}
																alt={project.name}
															/>
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
													</Link>
													<div className="content">
														<div className="h7 text-capitalize fw-7">
															<Link
																href={`/project/${project.slug}`}
																className="link"
															>
																{project.title}
															</Link>
														</div>
														<div className="desc">
															<i className="fs-16 icon icon-mapPin" />
															<p>
																{[project?.state, project?.city, project?.district]
																	.filter(Boolean)
																	.join(', ')} </p>

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
					</div >
					<div className="wrap-map">
						<PropertyMap topmap={false} singleMap={false} propertys={projects} />
					</div>
				</section >

			</Layout >
		</>
	)
}