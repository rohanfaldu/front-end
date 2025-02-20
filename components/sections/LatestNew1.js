'use client'
import Link from "next/link"
import { useTranslation } from "react-i18next";

export default function LatestNew1() {
	const { t } = useTranslation();
	return (
		<>

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
		</>
	)
}
