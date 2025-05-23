'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { insertData, insertImageData } from "../../components/api/Axios/Helper";
import Preloader from "@/components/elements/Preloader";
import variablesList from "@/components/common/Variable";
import { navigateTo } from '@/components/common/Functions';

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
	const router = useRouter();

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
														<div className="flat-blog-item hover-img wow fadeIn custom-link" data-wow-delay=".2s" data-wow-duration="2000ms"
															onClick={() => navigateTo(router, `/blog/${blogData.slug}`)}>
															<div className="img-style">
																<img src={blogData.image} alt="img-blog" className="blog-listing-img" />
																<span className="date-post">{formatDate(blogData.created_at)}</span>
															</div>
															<div className="content-box">
																<div className="post-author">
																</div>
																<h6 className="title">{blogData.title}</h6>
															</div>
														</div>
													</div>
												))
											}
										</div>
										{
											pagination.totalCount > pagination.itemsPerPage && (
												<ul className="wd-navigation">
													{console.log(pagination.totalPages)}
													{Array.from({ length: pagination.totalPages }, (_, index) => (
														<li key={index}>
															<div className={`nav-item ${pagination.currentPage === index + 1 ? 'active' : ''}`} onClick={() => handlePageChange(index + 1)} href="#"
																style={{ cursor: 'pointer' }} data-id={index}>
																{index + 1}
															</div>
														</li>
													))}
												</ul>
											)
										}
									</div>
								</section>
							</Layout>
						</>
					)
			}
		</>
	)
}