'use client'
import PropertyMap from "@/components/elements/PropertyMap"
import RangeSlider from "@/components/elements/RangeSlider"
import SidebarFilter from "@/components/elements/SidebarFilter"
import TabNav from "@/components/elements/TabNav"
import { getData } from "../../components/api/Helper";
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import React, { useEffect, useState } from 'react';
import ReactSlider from "react-slider"
import { useTranslation } from "react-i18next";
const { defaultImage } = "/images/banner/no-banner.png";
import Preloader from "@/components/elements/Preloader";
import variablesList from "@/components/common/Variable";
import debounce from "lodash.debounce";
import { useRouter } from 'next/navigation';

export default function developerListing() {
  const [isToggled, setToggled] = useState(false)
  const handleToggle = () => setToggled(!isToggled)

  const [initialMaxPrice, setInitialMaxPrice] = useState(0); // Store the maximum price initially
  const [maxPriceSliderRange, setMaxPriceSliderRange] = useState(0); // Dynamic slider range
  const [priceRange, setPriceRange] = useState([]); // Selected range
  const [isTab, setIsTab] = useState(2)
  const handleTab = (i) => {
    setIsTab(i)
  }
  const { t } = useTranslation();
  const [developerList, setDeveloperList] = useState([]); // Store properties for the current page
  const [loading, setLoading] = useState(true); // Manage loading state
  const [error, setError] = useState(null); // Manage error state
  const [searchTerm, setSearchTerm] = useState(''); // Store search input
  const [statusFilter, setStatusFilter] = useState(''); // Store selected status filter
  const [amenities, setAmenities] = useState([]);
  const [cities, setCities] = useState([]); // City options
  const [districts, setDistricts] = useState([]); // District options
  const [neighbourhoods, setNeighbourhoods] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [seachAccordion, setSeachAccordion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    currentPage: variablesList.currentPage,
    itemsPerPage: 9,
  }); // Track pagination info
  const [filters, setFilters] = useState({
    title: '',
    description: '',
    city: '',
    neighbourhood: '',
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    amenities_id: [],
  });


  const handleInputChange = (e) => {
    // console.log(e,"lllllllllllll")
    setSearchTerm(e.target.value);
    setSearchCity(e.target.value)
    if (e.target.name === "city" && e.target.value.trim() === "") {
      setFilters((prevFilters) => ({ ...prevFilters, city: "" }));
    }
  };

  const fetchCityOptions = debounce(async (value, page = 1) => {
    if (value.trim() === "") {
      setCityOptions([]);
      return;
    }
    try {
      const requestData = {
        page,
        limit: pagination.itemsPerPage,
        city_name: value
      };
      const response = await getData("api/city", requestData, true);
      setCityOptions(response.data.cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  }, 300);


  useEffect(() => {
    fetchCityOptions(searchTerm);
    const checkViewport = () => {
      setIsMobile((window.innerWidth < 768) ? true : false);
      if (window.innerWidth < 768) {
        setSeachAccordion(false);
      } else {
        console.log(213);
        setSeachAccordion(true);
      }
    };
    checkViewport();
  }, [searchTerm]);


  const fetchDeveloperList = async (page = 1, updatedFilters = {}) => {
    setLoading(true);
    try {
      // Set the filters to the updated filters, defaulting to empty values if not provided
      const requestData = {
        page,
        limit: pagination.itemsPerPage,
        ...updatedFilters, // Spread the updated filters only (dynamic fields)
      };

      const response = await getData("api/developer", requestData, true);
      // console.log(response);
      if (response.status) {
        const { list, totalCount, totalPages, currentPage, project_meta_details, maxPriceSliderRange, cities } = response.data;
        setDeveloperList(list);
        setPagination({
          ...pagination,
          totalCount,
          totalPages,
          currentPage,
        });
        setAmenities(project_meta_details || []);
        setCities(cities);
        if (!initialMaxPrice) { // Only set once
          setInitialMaxPrice(maxPriceSliderRange || 0); // Store the maximum price initially
          setMaxPriceSliderRange(maxPriceSliderRange || 0); // Set slider max value
          setPriceRange([0, maxPriceSliderRange || 0]);    // Default slider range
        }
        setError(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (page = pagination.currentPage) => {
    setLoading(true);
    try {
      // Set the filters to the updated filters, defaulting to empty values if not provided
      const requestData = {
        page,
        limit: pagination.itemsPerPage,
        city_id: filters.city,
        user_name: filters.title,
      };
      // console.log(requestData,"requestData")
      const response = await getData("api/developer", requestData, true);
      // console.log(response);
      if (response.status) {
        const { list, totalCount, totalPages, currentPage, project_meta_details, maxPriceSliderRange, cities } = response.data;
        setDeveloperList(list);
        setPagination({
          ...pagination,
          totalCount,
          totalPages,
          currentPage: list.length === 0 ? 1 : currentPage,
        });
        setAmenities(project_meta_details || []);
        setCities(cities);
        if (!initialMaxPrice) { // Only set once
          setInitialMaxPrice(maxPriceSliderRange || 0); // Store the maximum price initially
          setMaxPriceSliderRange(maxPriceSliderRange || 0); // Set slider max value
          setPriceRange([0, maxPriceSliderRange || 0]);    // Default slider range
        }
        setError(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  // Handle Filter Changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
      ...(name === "city" && { district_id: "", neighbourhood_id: "" }),
      ...(name === "district" && { neighbourhood_id: "" }),
    }));
  };


  useEffect(() => {
    handleSubmit(pagination.currentPage);
  }, [pagination.currentPage]);

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  const handleCitySelect = (cityId, cityName, latitude, longitude) => {
    setSearchCity(cityName); // Set the selected city name in the input
    handleFilterChange({ target: { name: 'city', value: cityId } }); // Call filter change with selected city ID
  };
  const handlesearchAccordion = (status) => {
    const updateStatus = (status) ? false : true;
    setSeachAccordion(updateStatus);
  }
  const router = useRouter();
  const handleClick = (slug) => {
    router.push(slug);
  };

  return (
    <>

      <Layout headerStyle={1} footerStyle={1}>
        <section className="wrapper-layout-3 developer user-inner-sec">
          {isMobile && (
            <div className="accordion-section">
              <button
                onClick={() => handlesearchAccordion(seachAccordion)}
                className="accordion-button"
              >
                <span className="h7 title fw-7">{t("search")}</span>
                <span className="arrow-icon">
                  <img
                    src="/images/avatar/down-arrow.svg"
                    alt="Arrow Icon"
                    className={seachAccordion ? 'rotated' : ''}
                    width="20"
                    height="20"
                  />
                </span>
              </button>
            </div>
          )}
          {seachAccordion && (
            <div className="wrap-sidebar">
              <div className="flat-tab flat-tab-form widget-filter-search">
                <div className="h7 title fw-7 search-text">{t("search")}</div>
                <div className="tab-content">
                  <div className="tab-pane fade active show" role="tabpanel">
                    <div className="form-sl">
                      <form method="post" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <div className="wd-filter-select">
                          <div className="inner-group inner-filter">

                            <div className="form-style">
                              <label className="title-select">{t("titleDeveloper")}</label>
                              <input
                                type="text"
                                className="form-control"
                                value={filters.title}
                                onChange={handleFilterChange}
                                name="title"
                                placeholder={t("searchtitle")}

                              />
                            </div>
                            <div className="form-style">
                              <label className="title-select">{t("city")}</label>
                              <input
                                type="text"
                                className="form-control"
                                id="city"
                                name="city"
                                value={searchCity}
                                onChange={handleInputChange}
                                placeholder={t("searchCity")}
                              />
                              {searchTerm.length > 0 && (
                                cityOptions.length > 0 && (
                                  <ul className="city-dropdown form-style" style={{ marginTop: "0px" }}>
                                    {cityOptions.map((city) => (
                                      <li
                                        key={city.id}
                                        onClick={() => {
                                          handleCitySelect(city.id, city.city_name);
                                          setSearchTerm('');
                                        }}
                                        className="city-option"
                                      >
                                        {city.city_name}
                                      </li>
                                    ))}
                                  </ul>
                                )
                              )}
                            </div>

                          </div>
                          <div className="form-btn-fixed d-flex">
                            <button
                              type="submit"
                              className="tf-btn primary"
                            >
                              {t("finddeveloper")}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div >
              </div >
            </div >
          )}
          <div className="wrap-inner-55">
            <div className="box-title-listing style-1">
              <h5>{t("developerlisting")}</h5>
            </div>
            <div className="tab-content">

              {loading ? (
                <Preloader />
              ) : error ? (
                <p>{error}</p>
              ) : developerList?.length === 0 ? (
                <div style={{ textAlign: "center" }}>
                  <img src="/images/not-found/item-not-found.png" alt="No projects found" style={{ height: "300px" }} />
                </div>
              ) : (
                <div className="row">
                  {developerList?.map((developerUserData) => (
                    <div className="col-md-4" key={developerUserData.id}>
                      <div className="homeya-box">
                        <div className="archive-top">
                          <div onClick={() => handleClick(`/developer/${developerUserData.slug}`)} className="link custom-link images-group">
                            <div className="images-style">
                              <img
                                src={developerUserData.image || "/images/banner/no-banner.png"}
                                alt={developerUserData.name}
                              />
                            </div>
                          </div>
                          <div className="content user-listing-sec">
                            <div className="h7 text-capitalize fw-7">
                              <div onClick={() => handleClick(`/developer/${developerUserData.slug}`)} className="link custom-link">
                                {developerUserData.user_name}
                              </div>
                            </div>
                            <div className="desc">
                              <i className="fs-16 icon icon-mapPin" />
                              <p>{[developerUserData?.city, developerUserData?.districts]
                                .filter(Boolean)
                                .join(', ')} </p>
                            </div>
                            <div className="user-social-icons">
                              <ul className="info-box">
                                {developerUserData.facebook_link ? (
                                  <li className="item">
                                    <Link target="_blank" href={developerUserData.facebook_link} className="box-icon w-52"><i className="icon icon-facebook" /></Link>
                                  </li>
                                ) : ''}
                                {/* {developerUserData.twitter_link ? (
                                  <li className="item">
                                    <Link target="_blank" href={developerUserData.twitter_link} className="box-icon w-52"><i className="icon icon-twitter" /></Link>
                                  </li>
                                ) : ''} */}
                                {developerUserData.youtube_link ? (
                                  <li className="item">
                                    <Link target="_blank" href={developerUserData.youtube_link} className="box-icon w-52"><i className="icon icon-youtube" /></Link>
                                  </li>
                                ) : ''}
                                {/* {developerUserData.pinterest_link ? (
                                  <li className="item">
                                    <Link target="_blank" href={developerUserData.pinterest_link} className="box-icon w-52"><i className="icon icon-pinterest" /></Link>
                                  </li>
                                ) : ''} */}
                                {developerUserData.linkedin_link ? (
                                  <li className="item">
                                    <Link target="_blank" href={developerUserData.linkedin_link} className="box-icon w-52"><i className="icon icon-linkedin" /></Link>
                                  </li>
                                ) : ''}
                                {developerUserData.instagram_link ? (
                                  <li className="item">
                                    <Link target="_blank" href={developerUserData.instagram_link} className="box-icon w-52"><i className="icon icon-instagram" /></Link>
                                  </li>
                                ) : ''}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {pagination.totalCount > pagination.itemsPerPage && (
              <ul className="wd-navigation">
                {Array.from({ length: pagination.totalPages }, (_, index) => (
                  <li key={index}>
                    <div
                      className={`nav-item ${pagination.currentPage === index + 1 ? 'active' : ''}`}
                      onClick={() => handlePageChange(index + 1)}
                      style={{ cursor: 'pointer' }}
                    >
                      {index + 1}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div >
        </section >

      </Layout >
    </>
  )
}