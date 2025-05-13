
'use client'
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from 'react';
import { insertData, insertImageData } from "../../components/api/Axios/Helper";
import Preloader from "@/components/elements/Preloader";
import variablesList from "@/components/common/Variable";
import { useRouter } from 'next/navigation';
const swiperOptions = {
	modules: [Autoplay, Pagination, Navigation],
	slidesPerView: 1,
	spaceBetween: 30,
	navigation: {
		clickable: true,
		nextEl: ".nav-prev-testimonial",
		prevEl: ".nav-next-testimonial",
	},
	pagination: {
		el: ".sw-pagination-testimonial",
		clickable: true,
	},
	breakpoints: {
		768: {
			slidesPerView: 2,
			spaceBetween: 20,
		},
		991: {
			slidesPerView: 2,
			spaceBetween: 20,
		},

		1550: {
			slidesPerView: 3,
			spaceBetween: 30,
		},
	},
}
export default function Testimonial1() {
	const [loading, setLoading] = useState(true);
	const { t, i18n } = useTranslation();
	const [commentDetails, setCommentDetails] = useState([]);
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
			const response = await insertData(`api/property/get-all-comment`, { page, lang, limit: pagination.itemsPerPage }, false);

			if (response.status) {
				const { totalCount, totalPages, list } = response.data; // REMOVE currentPage here
				setCommentDetails(list);
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
	const router = useRouter();
	const handleClick = (link) => {
		router.push(link);
	};
	//console.log(commentDetails, ' >>>>> commentDetails')
	return (
		<>

			<section className="flat-section-v3 bg-surface flat-testimonial">
				<div className="cus-layout-1">
					<div className="row align-items-center">
						<div className="col-lg-3">
							<div className="box-title">
								<div className="text-subtitle text-primary">{t("topproperties")}</div>
								<h4 className="mt-4">{t("what’speoplesay’s")}</h4>
							</div>
							<p className="text-variant-1 p-16">{t("testimonia")}</p>
							<div className="box-navigation">
								<div className="navigation swiper-nav-next nav-next-testimonial"><span className="icon icon-arr-l" /></div>
								<div className="navigation swiper-nav-prev nav-prev-testimonial"><span className="icon icon-arr-r" /></div>
							</div>
						</div>
						<div className="col-lg-9">
							<div className="swiper tf-sw-testimonial">
								<Swiper {...swiperOptions} className="swiper-wrapper">
									{commentDetails.length > 0
										? commentDetails.map((commentData, index) => (
											<SwiperSlide key={index}>
												<div onClick={() => handleClick(`${`property/${commentData.property.slug}`}`)} >
													<div className="box-tes-item wow fadeIn" data-wow-delay=".2s" data-wow-duration="2000ms">
														<ul className="list-star">
															{Array.from({ length: commentData.rating }, (_, starIndex) => (
																<li key={starIndex} className="icon icon-star" />
															))}
														</ul>
														<p className="note body-1">
															{commentData.comment}
														</p>
														<div className="box-avt d-flex align-items-center gap-12">
															<div className="avatar avt-60 round">
																<img
																	src={commentData.users?.image || "/images/avatar/user-image.png"}
																	alt="avatar"
																/>
															</div>
															<div className="info">
																<div className="h7 fw-7">{commentData.users?.full_name}</div>
															</div>
														</div>
													</div>
												</div>
											</SwiperSlide>
										))
										: null}
								</Swiper>

							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
