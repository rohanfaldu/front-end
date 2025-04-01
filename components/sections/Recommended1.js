'use client'
import Link from "next/link"
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Preloader from "../elements/Preloader";
import { getData, insertData } from "../api/Helper";
import { useTranslation } from "react-i18next";
import PropertyBlog from "../sections/PropertyBlog";
import PropertyData from "../sections/PropertyData";
export default function Recommended1() {
	const [isTab, setIsTab] = useState(0)
	const [isVisible, setIsVisible] = useState(true)
	const [propertyType, setPropertyType] = useState(null); // To store fetched data
	const [properties, setProperties] = useState(null); // To store fetched data
	const [loading, setLoading] = useState(true); // To manage loading state
	const [error, setError] = useState(null); // To manage error state
	const { t, i18n } = useTranslation();
	useEffect(() => {
		const fetchData = async () => {
			try {
				const lang = i18n.language;
				const propertyTypeObj = { page: 1, limit: 5, lang: lang };
				const propertTypeResponse = await getData('api/property-type/', propertyTypeObj);
				setPropertyType(propertTypeResponse.data.list);

				const propertyObj = { page: 1, limit: 6, lang: lang };
				const response = await getData('api/property/', propertyObj);
				console.log('response');
				console.log(response);
				setProperties(response.data.list); // Save data to state
				setLoading(false); // Stop loading
				setError(null);
			} catch (err) {
				setError(err.response?.data?.message || 'An error occurred'); // Handle error
				setLoading(false); // Stop loading
			}
		};

		const userActivity = async () => {
			try {
				await insertData('api/property/user-activity',{}, true);
			} catch (err) {
				setError(err.response?.data?.message || 'An error occurred'); // Handle error
			}
		};

		// userActivity();
		localStorage.getItem('token') ? userActivity() : null;

		fetchData(); // Fetch data on component mount
	}, [i18n.language]); // Empty dependency array ensures this runs only once on mount

	// if (loading) return <p>Loading...</p>; // Show loading message
	// if (error) return <p>Error: {error}</p>; 
	//// console.log(properties);
	/*const handleTab = (i) => {
		setIsTab(i)
		setIsVisible(false)
		setTimeout(() => {
			setIsVisible(true)
		}, 200)
	}*/
	const handleTab = async (i, id) => {
		// console.log(i);
		// console.log(id);
		setIsTab(i);
		// setIsVisible(false);

		// //setLoading(true);
		setTimeout(async () => {
			try {
				const lang = i18n.language;
				const propertyObj =
					i === 0
						? { page: 1, limit: 6, lang: lang } // Fetch all properties for "View All"
						: { page: 1, limit: 6, lang: lang, type_id: id }; // Fetch properties by type

				const response = await getData('api/property/', propertyObj);
				setProperties(response.data.list); // Update properties data
				setIsVisible(true); // Make content visible after fetching data
				//setLoading(false);
			} catch (err) {
				setError(err.response?.data?.message || 'An error occurred'); // Handle errors
				setIsVisible(true); // Ensure content is visible even if there’s an error
			}
		}, 200); // Delay to create transition effect
	};
	console.log('property');
	console.log(propertyType);
	return (
		<>
			{loading ?
				<Preloader />
				:
				<>
					<section className="flat-section flat-recommended">
						<div className="container">
							<div className="text-center wow fadeInUpSmall" data-wow-delay=".2s" data-wow-duration="2000ms">
								<div className="text-subtitle text-primary">{t("featuredproperties")}</div>
								<h4 className="mt-4">{t("recommendedforyou")}</h4>
							</div>
							<div className="flat-tab-recommended wow fadeInUpSmall" data-wow-delay=".2s" data-wow-duration="2000ms">
								<ul className="nav-tab-recommended justify-content-center" role="tablist">
									<li className="nav-tab-item" onClick={() => handleTab(0, 0)}>
										<a className={isTab == 0 ? "nav-link-item active" : "nav-link-item"} data-bs-toggle="tab">{t("viewall")}</a>
									</li>
									{propertyType?.map((typeList, index) => (
										<li className="nav-tab-item" onClick={() => handleTab(index + 1, typeList.id)}>
											<a className={isTab == (index + 1) ? "nav-link-item active" : "nav-link-item"} data-bs-toggle="tab">{typeList.title}</a>
										</li>
									))}
								</ul>
								<div className="tab-content">
									<div
									>
										<div className="row">
											{properties?.filter(property => property.status)?.length ? (
												properties.filter(property => property.status).map((property) => (
													<div key={property.id} className="col-xl-4 col-lg-6 col-md-6">
														<PropertyData data={property} slide={false} />
													</div>
												))
											) : (
												<div style={{ textAlign: "center" }}>
													<img 
														src="/images/not-found/item-not-found.png" 
														alt="No projects found" 
														style={{ height: "300px" }} 
													/>
												</div>
											)}
										</div>

									</div>
								</div>
								{/* <div className="text-center">
									<Link href="/property" className="tf-btn primary size-1">{t("viewallproperties")}</Link>
								</div> */}
							</div>
						</div>
					</section>
				</>
			}
		</>
	)
}
