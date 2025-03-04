'use client'
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { insertData } from "@/components/api/Axios/Helper";

import { TextField, Button } from "@mui/material";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function ContactSeller({ data }) {  
	console.log("Received data:", data); // Debugging: Check if data is received
    const [isTab, setIsTab] = useState(1);
	const [selectedDateTime, setSelectedDateTime] = useState(null);
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => {
		console.log("Opening Modal"); // Debugging
		setIsModalOpen(true);
	};

	const closeModal = () => {
		console.log("Closing Modal"); // Debugging
		setIsModalOpen(false);
	};

	const handleTab = (i) => {
        setIsTab(i);
    };

	const visitSchedule = async () => {
		if (!selectedDateTime) return;

		setLoading(true);
		try {
			const formattedDateTime = dayjs(selectedDateTime).toISOString();
			console.log('formattedDateTime: ', formattedDateTime);

			const requestData = {
				propertyId: data.id,
				dateAndTime: formattedDateTime,
				visitType: isTab === 1 ? "Physical" : "Virtual",
				property_publisher_id: data.user_id
			};

			const response = await insertData("api/visit/visit-schedule", requestData, true);
			if (response.status) {
				console.log(response.data);
				setIsModalOpen(false);
				setError(null);
			}
		} catch (err) {
			setError(err.response?.data?.message || "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="widget-box single-property-contact bg-surface">
				<div className="h7 title fw-7">{t("contactSeller")}</div>
				<div className="box-avatar">
					{data?.user_image ? (
						<div className="avatar avt-100 round">
							<img src={data.user_image} alt="avatar" />
						</div>
					) : null}
					<div className="info" style={{ overflow: "hidden", width: "100%" }}>
						<div className="text-1 name">{data?.user_name}</div>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<div>
								<Link href={`/${data?.user_role}/${data?.user_id}`} className="link">
									<button className="form-wg tf-btn primary" type="button" style={{ marginTop: "10px" }}>
										<span style={{ color: "#fff" }}>{t("contact")}</span>
									</button>
								</Link>
							</div>
							<div>
								<button 
									className="form-wg tf-btn primary" 
									type="button" 
									style={{ marginTop: "10px", padding: "10px 30px" }} 
									onClick={openModal} 
								>
									<span style={{ color: "#fff" }}>{t("visit")}</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{isModalOpen && (
              <div className="custom-modal">
              <div className="custom-modal-content">
                <>
				<div style={{fontSize: "24px", fontWeight: "bold", marginBottom: "20px"}}>Visit Scheduler</div>
				<section className="wrapper-layout-3">
			<div style={{ width: "100%", backgroundColor: "#f7f7f7", padding: "20px" }}>
				<div className="flat-tab flat-tab-form widget-filter-search">
					<ul className="nav-tab-form" role="tablist">
						<li className="nav-tab-item" onClick={() => handleTab(1)}>
							<a className={isTab === 1 ? "nav-link-item active" : "nav-link-item"}>{t("Physical")}</a>
						</li>
						<li className="nav-tab-item" onClick={() => handleTab(2)}>
							<a className={isTab === 2 ? "nav-link-item active" : "nav-link-item"}>{t("Virtual")}</a>
						</li>
					</ul>
				</div>

				{/* DateTime Picker */}
				<div style={{ marginTop: "20px" }}>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DateTimePicker
							label="Select Date & Time"
							value={selectedDateTime}
							onChange={(newValue) => setSelectedDateTime(newValue)}
							renderInput={(params) => <TextField {...params} fullWidth />}
						/>
					</LocalizationProvider>
				</div>

				{/* Display Selected Date & Time */}
				{selectedDateTime && (
					<div style={{ marginTop: "10px", fontWeight: "bold" }}>
						Selected Date & Time: {dayjs(selectedDateTime).format("YYYY-MM-DD HH:mm:ss.SSS")}
					</div>
				)}

				{/* Buttons */}
				<div style={{ marginTop: "20px" }}>
					<button className="tf-btn primary" disabled={!selectedDateTime || loading} onClick={visitSchedule}>
						{loading ? "Scheduling..." : "Confirm"}
					</button>
					<button className="tf-btn primary" onClick={closeModal}>
						Cancel
					</button>
				</div>

				{/* Error Message */}
				{error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
			</div>
		</section>
				  
                  
                </>
                
              </div>
              </div>
            )}

			

		</>
	);
}
