'use client'
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { getDataWithOutTOken } from "@/components/api/Helper";
import React, { useEffect, useState } from 'react';
import Preloader from "@/components/elements/Preloader";
import Link from "next/link"
import { useTranslation } from "react-i18next";

const swiperOptions = {
	modules: [Autoplay, Pagination, Navigation],
	autoplay: {
		delay: 0,
		disableOnInteraction: false,
		pauseOnMouseEnter: true,
	},
	slidesPerView: 2,
	loop: true,
	spaceBetween: 0,
	speed: 3000,
	pagination: {
		el: ".swiper-pagination",
		clickable: true,
	},
	breakpoints: {
		450: {
			slidesPerView: 4,
			spaceBetween: 30,
		},
		768: {
			slidesPerView: 5,
			spaceBetween: 30,
		},

		992: {
			slidesPerView: 6,
			spaceBetween: 30,
		},
	},
}

export default function LogoSlider() {
    const [developerData, setDeveloperData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t, i18n } = useTranslation();
    useEffect(() => {
        const fetchData = async () => {
          const requestData = {
            page: 1,
            limit: 100,
          };
      
          try {
            const developerResponse = await getDataWithOutTOken("api/developer", requestData, false);
            const agencyResponse = await getDataWithOutTOken("api/agencies", requestData, false);
            console.log(developerResponse,'>>>>>>>> Developer');
            console.log(agencyResponse,'>>>>>>>> Agency');
            let mergedData = [];
            if(agencyResponse.status){
                const agenciesWithType = agencyResponse.data.list.map(item => ({
                    ...item,
                    page_link: `agency/${item.slug}`,
                  }));
                mergedData = [...mergedData, ...agenciesWithType];
            }
            if(developerResponse.status){
                const developersWithType = developerResponse.data.list.map(item => ({
                    ...item,
                    page_link: `developer/${item.slug}`,
                  }));
                mergedData = [...mergedData, ...developersWithType];
            }
            if (mergedData.length > 0) {
                setDeveloperData(mergedData);
                setIsLoading(false);
            }
           
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
      
        fetchData();
      }, []);
      console.log(developerData,'>>>>>>>> Developer');
	return (
		<>
            {isLoading?(
                <Preloader />
            ):(
                <section className="logo-sec-list">
                  <div className="logo-sec-text">
                    <h4 class="mt-4 mb-[10px]">{t('agencyDeveloperSlider')}</h4>
                    </div>
                    <div className="logo-sec">
                      <Swiper {...swiperOptions}>
                          {developerData.map((data, index) => (
                          
                              <SwiperSlide key={index}>
                                  <Link href={data.page_link}>
                                  <img src={data.image} alt="logo"  className="w-auto object-contain mx-auto" width={100} height={100}/>
                                  </Link>
                              </SwiperSlide>

                          ))}

                      </Swiper>
                    </div>
                </section>
            )}
		</>
	)
}
