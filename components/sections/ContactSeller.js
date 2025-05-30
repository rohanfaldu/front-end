'use client'
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { insertData } from "@/components/api/Axios/Helper";
import { TextField, Button } from "@mui/material";
import ModalLogin from "../common/ModalLogin";
import ModalRegister from "../common/ModalRegister";
import ModalForgotPassword from "../common/ModalForgotPassword";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getDoc, doc, setDoc, collection, } from "firebase/firestore";
import { db } from '@/components/layout/firebaseConfig';
import { Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function ContactSeller({ data, login }) {
	// // console.log("Received data:", data); // Debugging: Check if data is received
	const [isTab, setIsTab] = useState(1);
	const [selectedDateTime, setSelectedDateTime] = useState(null);
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isContactModelOpen, setIsContactModelOpen] = useState(false);
	const [isLogin, setLogin] = useState(false);
	const [isRegister, setRegister] = useState(false);
	const [isForgotPassword, setForgotPassword] = useState(false);
	const router = useRouter();
	const handleLogin = () => {
		document.body.classList.remove("mobile-menu-visible");
		setLogin(!isLogin)
		!isLogin ? document.body.classList.add("modal-open") : document.body.classList.remove("modal-open")
	}
	const handleRegister = () => {
		setRegister(!isRegister)
		!isRegister ? document.body.classList.add("modal-open") : document.body.classList.remove("modal-open")
	}

	const handleForgotPassword = () => {
		setForgotPassword(!isForgotPassword)
		!isForgotPassword ? document.body.classList.add("modal-open") : document.body.classList.remove("modal-open")
		!isLogin ? document.body.classList.remove("modal-open") : ""
	}

	useEffect(() => {
		{
			// const isLoggedIn = (localStorage.getItem('isLoggedIn'))? true : false;
			// setIsLogin(isLoggedIn);
		}
	});
	// // console.log(islogin,' >>>>>>>>>> islogin')
	const openModal = () => {
		// // console.log("Opening Modal"); // Debugging
		const token = localStorage.getItem('token');
		if (!token) {
			setIsContactModelOpen(true);
			return;
		} else {
			setIsContactModelOpen(false);
			setIsModalOpen(true);
		}
	};

	const closeModal = () => {
		// // console.log("Closing Modal"); // Debugging
		setIsModalOpen(false);
	};

	const handleTab = (i) => {
		setIsTab(i);
	};

	const closeContactModal = () => {
		setIsContactModelOpen(false);
		//setShowLoginModal(true);
	};
	const visitSchedule = async () => {
		if (!selectedDateTime) return;

		setLoading(true);
		try {
			const formattedDateTime = dayjs(selectedDateTime).toISOString();
			// // console.log('formattedDateTime: ', formattedDateTime);

			const requestData = {
				propertyId: data.id,
				dateAndTime: formattedDateTime,
				visitType: isTab === 1 ? "Physical" : "Virtual",
				property_publisher_id: data.user_id
			};

			const response = await insertData("api/visit/visit-schedule", requestData, true);
			if (response.status) {
				// // console.log(response.data);
				setIsModalOpen(false);
				setError(null);
			}
		} catch (err) {
			setError(err.response?.data?.message || "Please log in after creating the visit.");
		} finally {
			setLoading(false);
		}
	};


	const checkAndCreateChatDocument = async () => {
		console.log('Here 1')
		try {
			const documentId = `${data.user_id}_${data.id}_${localStorage.getItem("user_id")}`;

			const docRef = doc(db, "test_chat_new", documentId);
			const docSnap = await getDoc(docRef);
			if (!docSnap.exists()) {
				if (data.user_role === 'developer') {
					await setDoc(docRef, {
						agency_id: "",
						agency_name: "",
						agency_image: "",
						developer_id: data.user_id || "",
						developer_name: data.user_name || "",
						developer_image: data.user_image || "",
						propertyPrice: data.price || 0,
						property_id: data.id,
						property_name: data.title || "",
						property_image: data.picture[0] || "",
						user_id: localStorage.getItem("user_id"),
						user_name: localStorage.getItem("user_name") || "",
						user_image: localStorage.getItem("user_image") || "",
						last_activity: Timestamp.now()
					});
				} else if (data.user_role === 'agency') {
					await setDoc(docRef, {
						agency_id: data.user_id || "",
						agency_name: data.user_name || "",
						agency_image: data.user_image || "",
						developer_id: "",
						developer_name: "",
						developer_image: "",
						propertyPrice: data.price || 0,
						property_id: data.id,
						property_name: data.title || "",
						property_image: data.picture[0] || "",
						user_id: localStorage.getItem("user_id"),
						user_name: localStorage.getItem("user_name") || "",
						user_image: localStorage.getItem("user_image") || "",
						last_activity: Timestamp.now()
					});
				}

				// // console.log("New chat document created with ID:", documentId);
				const chatCollectionRef = collection(docRef, "chat");
				const blankDocRef = doc(chatCollectionRef); // Firestore will generate a random ID
				await setDoc(blankDocRef, {}); // Creates an empty document
				const chatRequestData = {
					property_id: data.id,
					user_id: localStorage.getItem("user_id"),
				};

				const response = await insertData("api/chat/create", chatRequestData, true);
				console.log(response, " >>>> response");
	
				router.push(`/user-chat`);
				//window.location.href = "/user-chat";
				return documentId;
			} else {
				// // console.log("Chat document already exists with ID:", documentId);
				//window.location.href = "/user-chat";


				const chatRequestData = {
					property_id: data.id,
					user_id: localStorage.getItem("user_id"),
				};

				const response = await insertData("api/chat/create", chatRequestData, true);
				console.log(response, " >>>> response");
	

				
				router.push(`/user-chat`);
				return documentId;
			}
		} catch (error) {
			console.error("Error checking/creating chat document:", error);
			throw error;
		}
	};

	// Function to handle the click event
	const handleContactClick = () => {
		const token = localStorage.getItem('token');

		if (!token) {
			setIsContactModelOpen(true);
			return;
		} else {
			console.log('Here');
			checkAndCreateChatDocument()
				.then(documentId => {
					// // console.log("Chat document ID:", documentId);
					// You can add navigation to chat page here if needed
					// Example: router.push(`/chat/${documentId}`);
				})
				.catch(error => {
					console.error("Error in handleContactClick:", error);
				});
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
						<div className="property-contact-sec" >
							{/* {islogin?( */}
							<div>
								<div className="link">
									<button
										className="form-wg tf-btn primary"
										type="button"
										style={{ marginTop: "10px", width: "205px" }}
										onClick={handleContactClick}
									>
										<span style={{ color: "#fff" }}>{t("contact")}</span>
									</button>
								</div>
							</div>
							{/* ):null} */}
							<div>
								<button
									className="form-wg tf-btn primary"
									type="button"
									style={{ marginTop: "10px", padding: "10px 30px", width: "205px" }}
									onClick={openModal}
								>
									<span style={{ color: "#fff" }}>{t("visit")}</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{isContactModelOpen && (
				<div className="modal" style={{ display: 'block', position: 'fixed', zIndex: 1000, top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
					<div className="modal-content-alert login-alert-sec" >
						<>
							<img
								src="/images/logo/logo.svg" // Replace with your actual image path
								alt="Logo"
								style={{ width: '150px', marginBottom: '15px' }}
							/><br></br>
							<h4>{t('loginAlert')}</h4>
							<p>{t('loginText')}</p>
							<div className="modal-buttons">
								<button className="tf-btn primary" onClick={() => {
									closeContactModal();
									setLogin(true)
								}}>{t("login")}</button>
								<button className="tf-btn primary" onClick={() => setIsContactModelOpen(false)} style={{ marginLeft: '15px' }}>{t("cancel")}</button>
							</div>
						</>
					</div>
				</div>
			)}
			{isModalOpen && (
				<div className="custom-modal">
					<div className="custom-modal-content">
						<>
							<div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>{t("visitSchedule")}</div>
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
												ampm={false}
												onChange={(newValue) => setSelectedDateTime(newValue)}
												renderInput={(params) => <TextField {...params} fullWidth />}
											/>
										</LocalizationProvider>
									</div>

									{/* Display Selected Date & Time */}
									{selectedDateTime && (
										<div style={{ marginTop: "10px", fontWeight: "bold" }}>
											Selected Date & Time: {dayjs(selectedDateTime).format("YYYY-MM-DD HH:mm")}
										</div>
									)}

									{/* Buttons */}
									<div style={{ marginTop: "20px" }}>
										<button className="tf-btn primary" disabled={!selectedDateTime || loading} onClick={visitSchedule}>
											{loading ? "Scheduling..." : t("confirm")}
										</button>
										<button className="tf-btn primary" onClick={closeModal}>
											{t("cancel")}
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
			{isLogin ?
				<>
					<ModalLogin isLogin={isLogin} handleLogin={handleLogin} isRegister={isRegister} handleRegister={handleRegister} handleForgotPassword={handleForgotPassword} />
				</>
				: null}
		</>
	);
}