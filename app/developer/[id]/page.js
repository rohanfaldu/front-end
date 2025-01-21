'use client'
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { insertData } from "../../../components/api/Axios/Helper";
import SidebarFilter from "@/components/elements/SidebarFilter";
import ProjectBlog from "@/components/sections/ProjectBlog";
const toCapitalCase = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const swiperOptions = (agencyDetails) => ({
    modules: [Autoplay, Pagination, Navigation],
    autoplay: agencyDetails?.picture.length > 1
        ? {
            delay: 2000,
            disableOnInteraction: false,
        }
        : false, // Disable autoplay for single image
    speed: 2000,
    navigation: agencyDetails?.picture.length > 1
        ? { // Enable navigation buttons only for multiple images
            clickable: true,
            nextEl: ".nav-prev-location",
            prevEl: ".nav-next-location",
        }
        : false, // Hide navigation buttons for single image
    pagination: agencyDetails?.picture.length > 1
        ? { // Enable pagination only for multiple images
            el: ".swiper-pagination1",
            clickable: true,
        }
        : false, // Hide pagination for single image
    slidesPerView: 1,
    loop: agencyDetails?.picture.length > 1, // Disable loop for single image
    spaceBetween: agencyDetails?.picture.length > 1 ? 20 : 0, // No spacing for single image
    centeredSlides: agencyDetails?.picture.length > 1, // Center slide for single image
    breakpoints: agencyDetails?.picture.length > 1
        ? { // Enable breakpoints only for multiple images
            600: {
                slidesPerView: 2,
                spaceBetween: 20,
                centeredSlides: false,
            },
            991: {
                slidesPerView: 2,
                spaceBetween: 20,
                centeredSlides: false,
            },
            1520: {
                slidesPerView: 2,
                spaceBetween: 20,
                centeredSlides: false,
            },
        }
        : {}, // No breakpoints for single image
});

const swiperOptions2 = {
    modules: [Autoplay, Pagination, Navigation],
    autoplay: {
        delay: 2000,
        disableOnInteraction: false,
        reverseDirection: false,
    },

    speed: 3000,
    slidesPerView: 1,
    loop: true,
    spaceBetween: 30,
    centeredSlides: false,
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

        1550: {
            slidesPerView: 3,
            spaceBetween: 30,
        },
    },
}

import PropertyMapMarker from "@/components/elements/PropertyMapMarker"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import React, { useEffect, useState } from 'react';
import Preloader from '@/components/elements/Preloader';
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
export default function AgencyDetail({ params }) {
    const { id } = params;
    const searchParams = useSearchParams();
    const projectId = searchParams.get("id");
    const [isAccordion, setIsAccordion] = useState(1)
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [developerDetails, setDeveloperDetails] = useState([]);
    const [propertiesList, setPropertiesList] = useState('');
    const fetchDeveloperDetails = async () => {
        setLoading(true); // Start loading
        try {
            const requestData = {
                developer_id: id
            };
            console.log(234)
            // API call
            const response = await insertData(`api/developer/getbyid`, requestData, false);
            
            if (response.status) {
                setDeveloperDetails(response.data.developer);
                setPropertiesList(response.data.developer.project_details);
                setError(null);
            } else {
                setError("No project details found.");
            }
        } catch (err) {
            // Handle API errors
            setError(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false); // Stop loading
        }
    };
    // Fetch data on component mount
    useEffect(() => {
        fetchDeveloperDetails();
    }, []);

    // Translation hook
    const { t, i18n } = useTranslation();
    console.log(developerDetails,'>>>>>>>>>>>>>>>> Developer Details');
    return (
        <>
            {loading ?
                <Preloader />
                :
                <Layout headerStyle={1} footerStyle={1} breadcrumbTitle={developerDetails}>
                    <div>
                        <section className="flat-section pt-10 flat-property-detail">
                            <div className="container">

                                <div className="row">
                                    <div className="col-lg-8">
                                        <div className="single-property-element single-property-desc">
                                            {developerDetails.agency_name !== null ? (
                                                <div class="content-top d-flex justify-content-between align-items-center">
                                                    <div class="box-name">
                                                        <a class="flag-tag primary" href="#">{developerDetails?.agency_name}</a>
                                                    </div>
                                                </div>
                                            ) : ''}
                                            {developerDetails.description !== "" ? (
                                                <>
                                                    <div className="h7 title fw-7">{t("description")}</div>
                                                    <p className="body-2 text-variant-1">{developerDetails.description}</p>
                                                </>
                                            ) : ''}
                                        </div>
                                        <div className="single-property-element single-property-overview">
                                            <div className="h7 title fw-7">{t("socialinformation")}</div>
                                            <ul className="info-box">
                                                {developerDetails.facebook_link !== null ? (
                                                    <li className="item">
                                                        <Link target="_blank" href={developerDetails.facebook_link} className="box-icon w-52"><i className="icon icon-facebook" /></Link>
                                                        <div className="content">
                                                            <span className="label">Facebook</span>
                                                        </div>
                                                    </li>
                                                ) : ''}
                                                {developerDetails.twitter_link !== null ? (
                                                    <li className="item">
                                                        <Link target="_blank" href={developerDetails.twitter_link} className="box-icon w-52"><i className="icon icon-twitter" /></Link>
                                                        <div className="content">
                                                            <span className="label">Twitter</span>
                                                        </div>
                                                    </li>
                                                ) : ''}
                                                {developerDetails.youtube_link !== null ? (
                                                    <li className="item">
                                                        <Link target="_blank" href={developerDetails.youtube_link} className="box-icon w-52"><i className="icon icon-youtube" /></Link>
                                                        <div className="content">
                                                            <span className="label">Youtube</span>
                                                        </div>
                                                    </li>
                                                ) : ''}
                                                {developerDetails.pinterest_link !== null ? (
                                                    <li className="item">
                                                        <Link target="_blank" href={developerDetails.pinterest_link} className="box-icon w-52"><i className="icon icon-pinterest" /></Link>
                                                        <div className="content">
                                                            <span className="label">pinterest</span>
                                                        </div>
                                                    </li>
                                                ) : ''}
                                                {developerDetails.linkedin_link !== null ? (
                                                    <li className="item">
                                                        <Link target="_blank" href={developerDetails.linkedin_link} className="box-icon w-52"><i className="icon icon-linkedin" /></Link>
                                                        <div className="content">
                                                            <span className="label">linkedin</span>
                                                        </div>
                                                    </li>
                                                ) : ''}
                                                {developerDetails.instagram_link !== null ? (
                                                    <li className="item">
                                                        <Link target="_blank" href={developerDetails.instagram_link} className="box-icon w-52"><i className="icon icon-instagram" /></Link>
                                                        <div className="content">
                                                            <span className="label">instagram</span>
                                                        </div>
                                                    </li>
                                                ) : ''}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="widget-sidebar fixed-sidebar wrapper-sidebar-right">
                                            <div className="widget-box single-property-contact bg-surface">
                                                {/* <div className="h7 title fw-7">Contact Sellers</div> */}
                                                <div className="box-avatar">
                                                    <div className="avatar avt-100 round">
                                                        <img
                                                            src={developerDetails?.image && developerDetails.image !== ''
                                                                ? developerDetails.image
                                                                : '/images/avatar/user-image.png'}
                                                            alt="avatar"
                                                        />
                                                    </div>
                                                    {developerDetails ? (
                                                        <div className="info">
                                                            <div className="text-1 name">{developerDetails?.user_name}</div>
                                                            <span className="truncate-text">{developerDetails?.user_email_adress}</span><br />
                                                            <span>{developerDetails?.user_country_code} {developerDetails?.user_mobile_number}</span>
                                                        </div>
                                                    ) : ''}
                                                </div>
                                            </div>

                                            <div className="widget-box single-property-whychoose bg-surface">
                                                <div className="h7 title fw-7">{t("whychooseus")}</div>
                                                <ul className="box-whychoose">
                                                    <li className="item-why">
                                                        <i className="icon icon-secure" />
                                                        {t("securebooking")}
                                                    </li>
                                                    <li className="item-why">
                                                        <i className="icon icon-guarantee" />
                                                        {t("bestpriceguarantee")}
                                                    </li>
                                                    <li className="item-why">
                                                        <i className="icon icon-booking" />
                                                        {t("easybookingprocess")}
                                                    </li>
                                                    <li className="item-why">
                                                        <i className="icon icon-support" />
                                                        {t("availablesupport24/7")}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div >
                                </div >
                            </div >
                        </section >
                        <section className="flat-latest-property">
                            <div className="container">
                                {propertiesList.length > 0 && ( // Render title only if properties.length > 0
                                    <div className="box-title">
                                        <div className="text-subtitle text-primary">{t("featureproperties")}</div>
                                        <h4 className="mt-4">{t("themostrecentproject")}</h4>
                                    </div>
                                )}
                                <div className="swiper tf-latest-property" data-preview-lg={3} data-preview-md={2} data-preview-sm={2} data-space={30} data-loop="true">
                                    <Swiper {...swiperOptions2} className="swiper-wrapper">
                                        {propertiesList.map((property) => (
                                            <SwiperSlide>
                                                <ProjectBlog data={property} slide={true} />
                                                
                                            </SwiperSlide>
                                        ))}

                                    </Swiper>
                                </div>
                            </div>
                        </section>
                    </div>

                </Layout >
            }
        </>
    )
}