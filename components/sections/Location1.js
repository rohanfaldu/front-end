'use client'
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { useTranslation } from "react-i18next";


const swiperOptions = {
	modules: [Autoplay, Pagination, Navigation],
	
	autoplay: {
		delay: 2000,
		disableOnInteraction: false,
	},
	speed: 2000,
	navigation: {
		clickable: true,
		nextEl: ".nav-prev-location",
		prevEl: ".nav-next-location",
	},
	pagination: {
		el: ".swiper-pagination1",
		clickable: true,
	},
	slidesPerView: 1,
	loop: true,
	spaceBetween: 30,
	centeredSlides: true,
	breakpoints: {
		600: {
			slidesPerView: 2,
			spaceBetween: 20,
			centeredSlides: false,
		},
		991: {
			slidesPerView: 3,
			spaceBetween: 20,
			centeredSlides: false,
		},

		1520: {
			slidesPerView: 4,
			spaceBetween: 30,
		},

	},
}





import Link from "next/link"


export default function Location1() {
	const { t } = useTranslation();
	return (
		<>

			<section className="flat-section-v3 flat-location bg-surface">
				<div className="container-full">
					<div className="box-title text-center wow fadeInUpSmall" data-wow-delay=".2s" data-wow-duration="2000ms">
						<div className="text-subtitle text-primary">{t("explorecities")}</div>
						<h4 className="mt-4">{t("ourlocationforyou")}</h4>
					</div>
					<div className="wow fadeInUpSmall" data-wow-delay=".4s" data-wow-duration="2000ms">
						<div className="swiper tf-sw-location overlay">
							<Swiper {...swiperOptions} className="swiper-wrapper">
								<SwiperSlide>
									<Link href="#" className="box-location">
										<div className="image">
											<img src="/images/location/location-3.jpg" alt="image-location" />
										</div>
										<div className="content">
											<span className="sub-title">{t("321property")}</span>
											<h6 className="title">{t("londonunitedkingdom")}</h6>
										</div>
									</Link>
								</SwiperSlide>
								<SwiperSlide>
									<Link href="#" className="box-location">
										<div className="image">
											<img src="/images/location/location-4.jpg" alt="image-location" />
										</div>
										<div className="content">
											<span className="sub-title">{t("221property")}</span>
											<h6 className="title">{t("capetowmsouthafrica")}</h6>
										</div>
									</Link>
								</SwiperSlide>
								<SwiperSlide>
									<Link href="#" className="box-location">
										<div className="image">
											<img src="/images/location/location-5.jpg" alt="image-location" />
										</div>
										<div className="content">
											<span className="sub-title">{t("128property")}</span>
											<h6 className="title">{t("seoulsouthkorea")}</h6>
										</div>
									</Link>
								</SwiperSlide>
								<SwiperSlide>
									<Link href="#" className="box-location">
										<div className="image">
											<img src="/images/location/location-3.jpg" alt="image-location" />
										</div>
										<div className="content">
											<span className="sub-title">{t("321property1")}</span>
											<h6 className="title">{t("londonunitedkingdom")}</h6>
										</div>
									</Link>
								</SwiperSlide>
								<SwiperSlide>
									<Link href="#" className="box-location">
										<div className="image">
											<img src="/images/location/location-1.jpg" alt="image-location" />
										</div>
										<div className="content">
											<span className="sub-title">{t("231property1")}</span>
											<h6 className="title">{t("sydneyaustralia")}</h6>
										</div>
									</Link>
								</SwiperSlide>
								<SwiperSlide>
									<Link href="#" className="box-location">
										<div className="image">
											<img src="/images/location/location-2.jpg" alt="image-location" />
										</div>
										<div className="content">
											<span className="sub-title">{t("234property")}</span>
											<h6 className="title">{t("newjerseynewyork")}</h6>
										</div>
									</Link>
								</SwiperSlide>
							</Swiper>
							<div className="box-navigation">
								<div className="navigation swiper-nav-next nav-next-location"><span className="icon icon-arr-l" /></div>
								<div className="navigation swiper-nav-prev nav-prev-location"><span className="icon icon-arr-r" /></div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
