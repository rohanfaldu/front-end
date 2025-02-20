'use client'
import Link from "next/link"
import CountetNumber from "../elements/CountetNumber"
import { useTranslation } from "react-i18next";

export default function Service1() {
	
const { t } = useTranslation();
	return (
		<>

			<section className="flat-section">
				<div className="container">
					<div className="box-title style-1 wow fadeInUpSmall" data-wow-delay=".2s" data-wow-duration="2000ms">
						<div className="box-left">
							 <div className="text-subtitle text-primary">{t("ourservices")}</div> 
							<h4 className="mt-4">{t("whatwedo")}</h4>
						</div>
						<Link href="#" className="btn-view"><span className="text">{t("viewallservices")}</span> <span className="icon icon-arrow-right2" /> </Link>
					</div>
					<div className="flat-service wrap-service wow fadeInUpSmall" data-wow-delay=".4s" data-wow-duration="2000ms">
						<div className="box-service hover-btn-view">
							<div className="icon-box">
								<span className="icon icon-buy-home" />
							</div>
							<div className="content">
								<h6 className="title">{t("buyanewhome")}</h6>
								<p className="description">{t("buy")}</p>
								<Link href="#" className="btn-view style-1"><span className="text">{t("learnmore")}</span> <span className="icon icon-arrow-right2" /> </Link>
							</div>
						</div>
						<div className="box-service hover-btn-view">
							<div className="icon-box">
								<span className="icon icon-rent-home" />
							</div>
							<div className="content">
								<h6 className="title">{t("rentahome")}</h6>
								<p className="description">{t("rent")}</p>
								<Link href="#" className="btn-view style-1"><span className="text">{t("learnmore1")}</span> <span className="icon icon-arrow-right2" /> </Link>
							</div>
						</div>
						<div className="box-service hover-btn-view">
							<div className="icon-box">
								<span className="icon icon-sale-home" />
							</div>
							<div className="content">
								<h6 className="title">{t("sellahome")}</h6>
								<p className="description">{t("sell")}</p>
								<Link href="#" className="btn-view style-1"><span className="text">{t("learnmore2")}</span> <span className="icon icon-arrow-right2" /> </Link>
							</div>
						</div>
					</div>
					<div className="flat-counter tf-counter wrap-counter wow fadeInUpSmall" data-wow-delay=".4s" data-wow-duration="2000ms">
						<div className="counter-box">
							<div className="count-number">
								<div className="number" data-speed={2000} data-to={85} data-inviewport="yes"><CountetNumber count={85} /></div>
							</div>
							<div className="title-count">{t("satisfiedclients")}</div>
						</div>
						<div className="counter-box">
							<div className="count-number">
								<div className="number" data-speed={2000} data-to={112} data-inviewport="yes"><CountetNumber count={112} /></div>
							</div>
							<div className="title-count">{t("awardsreceived")}d</div>
						</div>
						<div className="counter-box">
							<div className="count-number">
								<div className="number" data-speed={2000} data-to={32} data-inviewport="yes"><CountetNumber count={32} /></div>
							</div>
							<div className="title-count">{t("successfultransactions")}</div>
						</div>
						<div className="counter-box">
							<div className="count-number">
								<div className="number" data-speed={2000} data-to={66} data-inviewport="yes"><CountetNumber count={66} /></div>
							</div>
							<div className="title-count">{t("monthlytraffic")}</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
