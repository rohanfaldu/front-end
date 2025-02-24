'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useTranslation } from "react-i18next";
export default function Blog() {
	const { t } = useTranslation();
	// return (
	// 	<>

	// 		<Layout headerStyle={1} footerStyle={1} breadcrumbTitle={t("blog")}>
	// 			<section className="flat-section">
	// 				<div className="container">
	// 					<div className="row">
	// 						<div className="col-lg-8">
	// 							<div className="flat-blog-list">
	// 								<div className="flat-blog-item">
	// 									<div className="img-style">
	// 										<img src="/images/blog/blog-lg-1.jpg" alt="img-blog" />
	// 										<span className="date-post">{t("date1")}</span>
	// 									</div>
	// 									<div className="content-box">
	// 										<div className="post-author">
	// 											<span className="text-black fw-7">Esther</span>
	// 											<span>{t("furniture")}</span>
	// 										</div>
	// 										<h5 className="title">{t("title")}</h5>
	// 										<p className="description body-1">{t("decs")}</p>
	// 										<Link href="/blog-detail" className="btn-read-more">Read More</Link>
	// 									</div>
	// 								</div>
	// 								<div className="flat-blog-item">
	// 									<div className="img-style">
	// 										<img src="/images/blog/blog-lg-2.jpg" alt="img-blog" />
	// 										<span className="date-post">January 28, 2024</span>
	// 									</div>
	// 									<div className="content-box">
	// 										<div className="post-author">
	// 											<span className="text-black fw-7">Angel</span>
	// 											<span>Interior</span>
	// 										</div>
	// 										<h5 className="title">92% of millennial homebuyers say inflation has impacted their plans</h5>
	// 										<p className="description body-1">Delve into the art of home staging as an effective strategy to attract buyers and sell your home...</p>
	// 										<Link href="/blog-detail" className="btn-read-more">Read More</Link>
	// 									</div>
	// 								</div>
	// 								<div className="flat-blog-item">
	// 									<div className="img-style">
	// 										<img src="/images/blog/blog-lg-3.jpg" alt="img-blog" />
	// 										<span className="date-post">January 28, 2024</span>
	// 									</div>
	// 									<div className="content-box">
	// 										<div className="post-author">
	// 											<span className="text-black fw-7">Eduardo</span>
	// 											<span>Realtor</span>
	// 										</div>
	// 										<h5 className="title">The Art of Staging: How to Sell Your Home Quickly at a High Price.</h5>
	// 										<p className="description body-1">Delve into the art of home staging as an effective strategy to attract buyers and sell your home...</p>
	// 										<Link href="/blog-detail" className="btn-read-more">Read More</Link>
	// 									</div>
	// 								</div>
	// 								<ul className="flat-pagination">
	// 									<li><Link href="#" className="page-numbers current">1</Link></li>
	// 									<li><Link href="#" className="page-numbers">2</Link></li>
	// 									<li><Link href="#" className="page-numbers">3</Link></li>
	// 									<li><Link href="#" className="page-numbers"><i className="icon icon-arr-r" /></Link></li>
	// 								</ul>
	// 							</div>
	// 						</div>
	// 						<div className="col-lg-4">
	// 							<aside className="sidebar-blog fixed-sidebar">
	// 								<div className="widget-search">
	// 									<div className="h7 fw-7 text-black">{t("search")}</div>
	// 									<div className="search-box">
	// 										<input className="search-field" type="text" placeholder={t("search")}/>
	// 										<Link href="#" className="right-icon icon-search" />
	// 									</div>
	// 								</div>
	// 								<div className="widget-box bg-surface recent">
	// 									<div className="h7 fw-7 text-black">{t("recentposts")}</div>
	// 									<ul>
	// 										<li>
	// 											<Link href="/blog-detail" className="recent-post-item hover-img">
	// 												<div className="img-style">
	// 													<img src="/images/blog/post-recent-1.jpg" alt="post-recent" />
	// 												</div>
	// 												<div className="content">
	// 													<span className="subtitle">{t("date")}</span>
	// 													<div className="title">{t("post")}</div>
	// 												</div>
	// 											</Link>
	// 										</li>
	// 										<li>
	// 											<Link href="/blog-detail" className="recent-post-item hover-img">
	// 												<div className="img-style">
	// 													<img src="/images/blog/post-recent-2.jpg" alt="post-recent" />
	// 												</div>
	// 												<div className="content">
	// 													<span className="subtitle">{t("date")}</span>
	// 													<div className="title">{t("post1")}</div>
	// 												</div>
	// 											</Link>
	// 										</li>
	// 										<li>
	// 											<Link href="/blog-detail" className="recent-post-item hover-img">
	// 												<div className="img-style">
	// 													<img src="/images/blog/post-recent-3.jpg" alt="post-recent" />
	// 												</div>
	// 												<div className="content">
	// 													<span className="subtitle">{t("date")}</span>
	// 													<div className="title">{t("post2")}</div>
	// 												</div>
	// 											</Link>
	// 										</li>
	// 									</ul>
	// 								</div>
	// 								<div className="widget-box bg-surface categories">
	// 									<div className="h7 fw-7 text-black">{t("bycategories")}</div>
	// 									<ul>
	// 										<li><Link href="#" className="categories-item"><span>{t("marketupdates")}</span><span>(112)</span></Link></li>
	// 										<li><Link href="#" className="categories-item"><span>{t("buyingtips")}</span><span>(13)</span></Link></li>
	// 										<li><Link href="#" className="categories-item current"><span>{t("interiorinspiration")}</span><span>(42)</span></Link></li>
	// 										<li><Link href="#" className="categories-item"><span>{t("investmentinsights")}</span><span>(32)</span></Link></li>
	// 										<li><Link href="#" className="categories-item"><span>{t("legalguidance")}</span><span>(54)</span></Link></li>
	// 										<li><Link href="#" className="categories-item"><span>{t("homeconstruction")}</span><span>(93)</span></Link></li>
	// 										<li><Link href="#" className="categories-item"><span>{t("communityspotlight")}</span><span>(52)</span></Link></li>
	// 										<li><Link href="#" className="categories-item"><span>{t("trendwatch")}</span><span>(14)</span></Link></li>
	// 									</ul>
	// 								</div>
	// 								<div className="widget-box bg-surface tag">
	// 									<div className="h7 fw-7 text-black">{t("populartags")}</div>
	// 									<ul>
	// 										<li><Link href="#" className="tag-item">{t("property")}</Link></li>
	// 										<li><Link href="#" className="tag-item current">{t("realty")}</Link></li>
	// 										<li><Link href="#" className="tag-item">{t("finance")}</Link></li>
	// 										<li><Link href="#" className="tag-item">{t("design")}</Link></li>
	// 										<li><Link href="#" className="tag-item">{t("invest")}</Link></li>
	// 										<li><Link href="#" className="tag-item">{t("legal")}</Link></li>
	// 										<li><Link href="#" className="tag-item">{t("renovate")}</Link></li>
	// 										<li><Link href="#" className="tag-item">{t("neighborhood")}</Link></li>
	// 										<li><Link href="#" className="tag-item">{t("market")}</Link></li>
	// 									</ul>
	// 								</div>
	// 							</aside>
	// 						</div>
	// 					</div>
	// 				</div>
	// 			</section>

	// 		</Layout>
	// 	</>
	// )

	return (
		<>
		<Layout headerStyle={1} footerStyle={1}>
			<section className="flat-section-v3 flat-latest-new bg-surface">
				<div className="container">
					<div className="box-title text-center wow fadeIn" data-wow-delay=".2s" data-wow-duration="2000ms">
						<div className="text-subtitle text-primary">{t("latestnews")}</div>
						<h4 className="mt-4">{t("guides")}</h4>
					</div>
					<div className="row">
						<div className="box col-lg-4 col-md-6">
							<Link href="/blog-detail" className="flat-blog-item hover-img wow fadeIn" data-wow-delay=".2s" data-wow-duration="2000ms">
								<div className="img-style">
									<img src="/images/blog/blog-1.jpg" alt="img-blog" />
									<span className="date-post">{t("date")}</span>
								</div>
								<div className="content-box">
									<div className="post-author">
										<span className="fw-6">{t("esther")}</span>
										<span>{t("furniture")}</span>
									</div>
									<h6 className="title">{t("maindecs")}</h6>
									<p className="description">{t("decs")}</p>
								</div>
							</Link>
						</div>
						<div className="box col-lg-4 col-md-6">
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
						</div>
					</div>
				</div>
			</section>
		</Layout>
		</>
	)
}