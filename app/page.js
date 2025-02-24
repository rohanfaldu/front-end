"use client";

import Layout from "@/components/layout/Layout"
import Agents1 from "@/components/sections/Agents1"
import Benefit1 from "@/components/sections/Benefit1"
import LatestNew1 from "@/components/sections/LatestNew1"
import Location1 from "@/components/sections/Location1"
import Partner from "@/components/sections/Partner"
import Property1 from "@/components/sections/Property1"
import Recommended1 from "@/components/sections/Recommended1"
import Service1 from "@/components/sections/Service1"
import Slider1 from "@/components/sections/Slider1"
import Testimonial1 from "@/components/sections/Testimonial1"
import variablesList from "@/components/common/Variable"
import { useEffect, useState } from "react"
import { getData } from "@/components/api/Helper"
import { useTranslation } from "react-i18next";

export default function Home() {
	const [pagination, setPagination] = useState({
		totalCount: 0,
		totalPages: 1,
		currentPage: variablesList.currentPage,
		itemsPerPage: variablesList.itemsPerPage,
	});
	const [properties, setProperties] = useState();
	const { t, i18n } = useTranslation();
	const [transaction, setTransaction] = useState("");
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		setProperties();
		setTransaction(localStorage.getItem("transaction"));
		fetchPropertys(pagination.currentPage);

	}, [pagination.currentPage, i18n.language]);

	const fetchPropertys = async (page = 1) => {
		console.log("hit fetchPropertys");
			try {
				const lang = i18n.language;
				const requestData = {
					page,
					lang,
					limit: pagination.itemsPerPage,
					transaction: transaction
				};
				
				console.log(requestData,";;;;;;;;;;;;;;;;;;;;")
				const response = await getData("api/property", requestData, true);
				console.log('responsedddddddddd: ', response);
				if (response.status) {
					setProperties(response.data);
					setPagination({
						...pagination,
						totalCount,
						totalPages,
						currentPage,
					});
					setLoading(false);
				}
			} catch (err) {
				// setError(err.response?.data?.message || "An error occurred");
			}
		};

	return (
		<>

			<Layout headerStyle={1} footerStyle={1}>
				{ loading && ( 
					<>
						<Slider1 properties={properties}/>
						<Recommended1 />
						<Property1 />
						<Testimonial1 />
						{/* <LatestNew1 /> */}
						{/* <Partner /> */}
					</>
				)}
			</Layout>
		</>
	)
}