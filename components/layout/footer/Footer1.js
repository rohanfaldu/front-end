import Link from "next/link"
import { useTranslation } from "react-i18next";

export default function Footer1() {
const { t } = useTranslation();
	return (
		<>

			<footer className="footer">
				<div className="top-footer">
					<div className="container">
						<div className="content-footer-top">
							<div className="footer-logo">
								<img src="/images/logo/logo.svg" alt="logo-footer" width={174} height={44} />
							</div>
							<div className="wd-social">
								<span>{t("followus")}</span>
								<ul className="list-social d-flex align-items-center">
									<li><Link href="#" className="box-icon w-40 social"><i className="icon icon-facebook" /></Link></li>
									<li><Link href="#" className="box-icon w-40 social"><i className="icon icon-linkedin" /></Link></li>
									<li><Link href="#" className="box-icon w-40 social"><i className="icon icon-twitter" /></Link></li>
									<li><Link href="#" className="box-icon w-40 social"><i className="icon icon-pinterest" /></Link></li>
									<li><Link href="#" className="box-icon w-40 social"><i className="icon icon-instagram" /></Link></li>
									<li><Link href="#" className="box-icon w-40 social"><i className="icon icon-youtube" /></Link></li>
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div className="inner-footer">
					<div className="container">
						<div className="row">
							<div className="col-lg-4 col-md-6">
								<div className="footer-cl-1">
									<p className="text-variant-2"></p>
									<ul className="mt-12">
										<li className="mt-12 d-flex align-items-center gap-8">
											<i className="icon icon-mapPinLine fs-20 text-variant-2" />
											<p className="text-white">{t("location")}</p>
										</li>
										<li className="mt-12 d-flex align-items-center gap-8">
											<i className="icon icon-phone2 fs-20 text-variant-2" />
											<Link href="/tel:1-333-345-6868" className="text-white caption-1">{t("phone")}</Link>
										</li>
										<li className="mt-12 d-flex align-items-center gap-8">
											<i className="icon icon-mail fs-20 text-variant-2" />
											<p className="text-white">{t("email")}</p>
										</li>
									</ul>
								</div>
							</div>
							<div className="col-lg-2 col-md-6 col-6">
								<div className="footer-cl-2">
									<div className="fw-7 text-white">{t("categories")}</div>
									<ul className="mt-10 navigation-menu-footer">
										<li> <Link href="/pricing" className="caption-1 text-variant-2">{t("pricingplans")}</Link> </li>
										<li> <Link href="/our-service" className="caption-1 text-variant-2">{t("ourservices")}</Link> </li>
										<li> <Link href="/about-us" className="caption-1 text-variant-2">{t("aboutus")}</Link> </li>
										<li> <Link href="/contact" className="caption-1 text-variant-2">{t("contactus")}</Link> </li>
									</ul>
								</div>
							</div>
							<div className="col-lg-2 col-md-4 col-6">
								<div className="footer-cl-3">
									<div className="fw-7 text-white">{t("ourcompany")}</div>
									<ul className="mt-10 navigation-menu-footer">
										<li> <Link href="/topmap-list" className="caption-1 text-variant-2">{t("propertyforsale")}</Link> </li>
										<li> <Link href="/topmap-grid" className="caption-1 text-variant-2">{t("propertyforrent")}</Link> </li>
										<li> <Link href="/topmap-grid" className="caption-1 text-variant-2">{t("propertyforbuy")}</Link> </li>
										<li> <Link href="/topmap-grid" className="caption-1 text-variant-2">{t("ouragents")}</Link> </li>
									</ul>
								</div>
							</div>
							<div className="col-lg-4 col-md-6">
								<div className="footer-cl-4">
									<div className="fw-7 text-white">
									{t("newletters")}
									</div>
									<p className="mt-12 text-variant-2">{t("duration")}</p>
									<form action="#" id="subscribe-form" className="mt-12">
										<span className="icon-left icon-mail" />
										<input type="email" placeholder="Your email address" required id="subscribe-email" />
										<button type="submit" id="subscribe-button"><i className="icon icon-send" /></button>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="bottom-footer">
					<div className="container">
						<div className="content-footer-bottom">
							<div className="copyright">©{new Date().getFullYear()} 	{t("title")}</div>
							<ul className="menu-bottom">
								<li><Link href="/our-service">{t("termofservices")}</Link> </li>
								<li><Link href="/pricing">{t("privacypolicys")}</Link> </li>
								<li><Link href="/contact">{t("cookieypolicys")}</Link> </li>
							</ul>
						</div>
					</div>
				</div>
			</footer>

		</>
	)
}
