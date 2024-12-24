'use client'

import { useTranslation } from "react-i18next";
export default function Benefit1() {
	const { t } = useTranslation();
	return (
		<>

			<section className="flat-section flat-benefit bg-surface">
				<div className="container">
					<div className="box-title text-center wow fadeInUpSmall" data-wow-delay=".2s" data-wow-duration="2000ms">
						<div className="text-subtitle text-primary">{t("ourbenifits")}</div>
						<h4 className="mt-4">{t("whychoosehomeya")}</h4>
					</div>
					<div className="wrap-benefit wow fadeInUpSmall" data-wow-delay=".2s" data-wow-duration="2000ms">
						<div className="box-benefit">
							<div className="icon-box">
								<span className="icon icon-proven" />
							</div>
							<div className="content text-center">
								<h6 className="title">{t("provenexpertise")}</h6>
								<p className="description">{t("benifits")}</p>
							</div>
						</div>
						<div className="box-benefit">
							<div className="icon-box">
								<span className="icon icon-double-ruler" />
							</div>
							<div className="content text-center">
								<h6 className="title">{t("customizedsolutions")}</h6>
								<p className="description">{t("benifits1")}</p>
							</div>
						</div>
						<div className="box-benefit">
							<div className="icon-box">
								<span className="icon icon-hand" />
							</div>
							<div className="content text-center">
								<h6 className="title">{t("transparentpartnerships")}</h6>
								<p className="description">{t("benifits2")}</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
