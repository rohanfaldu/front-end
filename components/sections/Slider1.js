'use client'
import { useEffect, useState } from "react"
import TextTransition, { presets } from 'react-text-transition'
import AdvancedFilter from "../elements/AdvancedFilter"
import TabNav from "../elements/TabNav";
import { useTranslation } from "react-i18next";
const TEXTS = ['Dream Home', 'Perfect Home', 'Real Estate']
export default function Slider1({properties}) {
	const [index, setIndex] = useState(1);
	const { t } = useTranslation();
	const [transaction, setTransaction] = useState("rental");

	useEffect(() => {
		const intervalId = setInterval(
			() => setIndex((index) => index + 1),
			3000, // every 3 seconds
			console.log(properties,"aaaaaaaaaaaaaaaaaaaaaaaaaaaa")
		)
		return () => clearTimeout(intervalId)
	}, [])
	return (
		<>

			<section className="flat-slider home-1">
				<div className="container relative">
					<div className="row">
						<div className="col-lg-12">
							<div className="slider-content">
								<div className="heading text-center">
									<h1 className="text-white animationtext slide">
										{t("findYou")}
										<span className="tf-text s1 cd-words-wrapper ms-3">
											<TextTransition springConfig={presets.wobbly}>{TEXTS[index % TEXTS.length]}</TextTransition>
										</span>
									</h1>

									<p className="subtitle text-white body-1 wow fadeIn" data-wow-delay=".8s" data-wow-duration="2000ms">{t("bannerDescription")}
									</p>
								</div>
								<div className="flat-tab flat-tab-form">
									<ul className="nav-tab-form style-1 justify-content-center" role="tablist">
										<TabNav setTransaction={setTransaction}/>
									</ul>
									<div className="tab-content">
										<div className="tab-pane fade active show" role="tabpanel">
											<div className="form-sl">
												<form method="post">
													{properties && (
														<AdvancedFilter sidecls="shadow-st" propertiesData = {properties}/>)}
													{/* <AdvancedFilter sidecls="shadow-st" propertiesData = {properties}/> */}
												</form>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="overlay" />
			</section>
		</>
	)
}
