'use client'
import PropertyMap from "@/components/elements/PropertyMap"
import RangeSlider from "@/components/elements/RangeSlider"
import SidebarFilter from "@/components/elements/SidebarFilter"
import TabNav from "@/components/elements/TabNav"
import { getData, insertData } from "../../components/api/Axios/Helper";
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
export default function PropertyHalfmapList() {
	const [isTab, setIsTab] = useState(2)
	const handleTab = (i) => {
		setIsTab(i)
	}
	const { t } = useTranslation();
	const [projects, setProjects] = useState([]); // Store properties for the current page
	const [loading, setLoading] = useState(true); // Manage loading state
	const [error, setError] = useState(null); // Manage error state
	const [searchTerm, setSearchTerm] = useState(''); // Store search input
	const [statusFilter, setStatusFilter] = useState(''); // Store selected status filter
	const [pagination, setPagination] = useState({
		totalCount: 0,
		totalPages: 1,
		currentPage: 1,
		itemsPerPage: 6,
	}); // Track pagination info

	const fetchProjects = async (page = 1, term = '', status = '') => {
		setLoading(true);
		try {
			const requestData = {
				page,
				limit: pagination.itemsPerPage,
				lang: "en",
				title: "",
				description: "",
				minPrice: "",
				maxPrice: "",
				amenities_id: []
			};

			const response = await insertData("api/projects", requestData, true);
			if (response.status) {
				const { projects, totalCount, totalPages, currentPage } = response.data;
				setProjects(projects);
				setPagination({
					...pagination,
					totalCount,
					totalPages,
					currentPage,
				});
				setError(null);
			}

		} catch (err) {
			setError(err.response?.data?.message || "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProjects(pagination.currentPage);
	}, [pagination.currentPage]);

	const handlePageChange = (page) => {
		setPagination({ ...pagination, currentPage: page });
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
										<form method="post">
											<div className="wd-filter-select">
												<div className="inner-group inner-filter">
													<div className="form-style">
														<label className="title-select">{t("title")}</label>
														<input type="text" className="form-control" placeholder="Search ." name="s" title="Search for" required />
													</div>
													<div className="form-style">
														<label className="title-select">{t("description")}</label>
														<div className="group-ip ip-icon">
															<input type="text" className="form-control" placeholder="Search Location" name="s" title="Search for" required />
															<Link href="#" className="icon-right icon-location" />
														</div>
													</div>

													<div className="form-style widget-price">
														<RangeSlider />
													</div>

													<SidebarFilter />
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
							</div>
						</div>
						<div className="tab-content">
							
							{loading ? (
								<p>Loading...</p>
							) : error ? (
								<p>{error}</p>
							) : (
								<div className="row">
									{projects.map((project) => (
										<div className="col-md-6" key={project.id}>
											<div className="homeya-box">
												<div className="archive-top">
													<Link href="/property-details-v1" className="images-group">
														<div className="images-style">
															<img
																src={project.picture[0]?.original_url || '/default.jpg'}
																alt={project.name}
															/>
														</div>
														<div className="top">
															<ul className="d-flex gap-8">
																{project.isFeatured && (
																	<li className="flag-tag success">Featured</li>
																)}
																<li className="flag-tag style-1">{project.status || 'For Sale'}</li>
															</ul>
															<ul className="d-flex gap-4">
																<li className="box-icon w-32">
																	<span className="icon icon-arrLeftRight" />
																</li>
																<li className="box-icon w-32">
																	<span className="icon icon-heart" />
																</li>
																<li className="box-icon w-32">
																	<span className="icon icon-eye" />
																</li>
															</ul>
														</div>
														<div className="bottom">
															<span className="flag-tag style-2">
																{project.meta_details?.propertyType || 'Studio'}
															</span>
														</div>
													</Link>
													<div className="content">
														<div className="h7 text-capitalize fw-7">
															<Link href="/property-details-v1" className="link">
																{project.title}
															</Link>
														</div>
														<div className="desc">
															<i className="fs-16 icon icon-mapPin" />
															<p>{project.address}, {project.city}, {project.state}</p>
														</div>
														{/* <ul className="meta-list">
															<li className="item">
																<i className="icon icon-bed" />
																<span>{project.meta_details?.bedrooms || 0}</span>
															</li>
															<li className="item">
																<i className="icon icon-bathtub" />
																<span>{project.meta_details?.bathrooms || 0}</span>
															</li>
															<li className="item">
																<i className="icon icon-ruler" />
																<span>
																	{project.meta_details?.size || '0'} SqFT
																</span>
															</li>
														</ul> */}
													</div>
												</div>
												<div className="archive-bottom d-flex justify-content-between align-items-center">
													<div className="d-flex gap-8 align-items-center">
														<div className="avatar avt-40 round">
															<img
																src={project.user_image || '/images/avatar/default-avatar.jpg'}
																alt={project.agent?.name || 'Agent'}
															/>
														</div>
														<span>{project.user_name || 'Unknown Agent'}</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>{project.price || '0.00'} </h6>
														<span className="text-variant-1">
															{project.currency || 'USD'}/SqFT
														</span>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
							
						</div>
						<div className="pagination-container">
							<button
								disabled={pagination.currentPage === 1}
								onClick={() => handlePageChange(pagination.currentPage - 1)}
							>
								Prev
							</button>

							{Array.from({ length: pagination.totalPages }, (_, i) => (
								<button
									key={i + 1}
									className={`pagination-btn ${pagination.currentPage === i + 1 ? 'active' : ''}`}
									onClick={() => handlePageChange(i + 1)}
								>
									{i + 1}
								</button>
							))}

							<button
								disabled={pagination.currentPage === pagination.totalPages}
								onClick={() => handlePageChange(pagination.currentPage + 1)}
							>
								Next
							</button>
						</div>
					</div >
					<div className="wrap-map">
						<PropertyMap />
					</div>
				</section >

			</Layout >
		</>
	)
}