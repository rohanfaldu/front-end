'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { insertData, insertImageData } from "../../components/api/Axios/Helper";
import Preloader from "@/components/elements/Preloader";
import variablesList from "@/components/common/Variable";

export default function Blog() {
	const [loading, setLoading] = useState(true);
	const { t, i18n } = useTranslation();
	const [blogDetails, setBlogDetails] = useState([]);
	const [pagination, setPagination] = useState({
		totalCount: 0,
		totalPages: 1,
		currentPage: variablesList.currentPage,
		itemsPerPage: variablesList.itemsPerPage,
	});
	// Fetch data on component mount

	const fetchBlogDetails = async (page) => {
		try {
			setLoading(true);
			const lang = i18n.language;
			const response = await insertData(`api/blog/getall`, { page, lang, limit: pagination.itemsPerPage }, false);
	
			if (response.status) {
				const { totalCount, totalPages, blogs } = response.data; // REMOVE currentPage here
				setBlogDetails(blogs);
				setPagination((prev) => ({
					...prev,
					totalCount,
					totalPages,
				}));
			} else {
				console.log('Blog API failed');
				router.push("/");
			}
		} catch (error) {
			console.log('Error fetching blog:', error);
		} finally {
			setLoading(false);
		}
	};
	
	useEffect(() => {
		if (i18n.isInitialized) {
			fetchBlogDetails(pagination.currentPage);
		}
	}, [pagination.currentPage, i18n.language]);

	const handlePageChange = (page) => {
		console.log(page, '>>>>>> page');
		setPagination((prev) => ({ ...prev, currentPage: page }));
		//fetchBlogDetails(page);
		// handleSubmit(page)
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	}
	console.log(blogDetails, '>>>>>>>> Blog')
	console.log(pagination, '>>>>>>>> pagination')
	return (
		<>
			{
				loading ?
					<Preloader />
					: (
						<>
							<Layout headerStyle={1} footerStyle={1}>
								<section className="flat-section-v3 flat-latest-new bg-surface blog-sec">
									<div className="container">
										<div className="box-title text-center wow fadeIn" data-wow-delay=".2s" data-wow-duration="2000ms">
											<div className="text-subtitle text-primary">{t("latestnews")}</div>
											<h4 className="mt-4">{t("guides")}</h4>
										</div>
										<div className="row">
											{
												blogDetails.map((blogData) => (
													<div className="box col-lg-4 col-md-6">
														<Link href={`/blog/${blogData.slug}`} className="flat-blog-item hover-img wow fadeIn" data-wow-delay=".2s" data-wow-duration="2000ms">
															<div className="img-style">
																<img src={blogData.image} alt="img-blog" className="blog-listing-img" />
																<span className="date-post">{formatDate(blogData.created_at)}</span>
															</div>
															<div className="content-box">
																<div className="post-author">
																	{/* <span className="fw-6">{t("esther")}</span> */}
																	{/* <span>{t("furniture")}</span> */}
																</div>
																<h6 className="title">{blogData.title}</h6>
																{/* <p className="description">{t("decs")}</p> */}
															</div>
														</Link>
													</div>
												))
											}

											{/* <div className="box col-lg-4 col-md-6">
												<Link href="/blog-detail" className="flat-blog-item hover-img wow fadeIn" data-wow-delay=".4s" data-wow-duration="2000ms">
													<div className="img-style">
														<img src="/images/blog/blog-2.jpg" alt="img-blog" />
														<span className="date-post">{t("date1")}</span>
													</div>
													<div className="content-box">
														<div className="post-author">
															<span className="fw-6">{t("angle")}</span>
															<span>{t("interior")}</span>
														</div>
														<h6 className="title">{t("maindecs1")}</h6>
														<p className="description">{t("decs1")}</p>
													</div>
												</Link>
											</div>
											<div className="box col-lg-4 col-md-6">
												<Link href="/blog-detail" className="flat-blog-item hover-img wow fadeIn" data-wow-delay=".6s" data-wow-duration="2000ms">
													<div className="img-style">
														<img src="/images/blog/blog-3.jpg" alt="img-blog" />
														<span className="date-post">{t("date2")}</span>
													</div>
													<div className="content-box">
														<div className="post-author">
															<span className="fw-6">{t("colleen")}</span>
															<span>{t("Architectur")}</span>
														</div>
														<h6 className="title">{t("maindecs2")}</h6>
														<p className="description">{t("decs1")}</p>
													</div>
												</Link>
											</div> */}
										</div>
										<ul className="wd-navigation">
											{console.log(pagination.totalPages)}
											{Array.from({ length: pagination.totalPages }, (_, index) => (
												<li key={index}>
													<Link
														href="#" data-id={index}
														className={`nav-item ${pagination.currentPage === index + 1 ? 'active' : ''}`}
														onClick={() => handlePageChange(index + 1)}
													>
														{index + 1}
													</Link>
												</li>
											))}
										</ul>
									</div>
								</section>
							</Layout>
						</>
					)
			}
		</>
	)
}