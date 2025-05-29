
'use client'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { use, useState, useEffect } from "react"
import CountetNumber from "@/components/elements/CountetNumber"
import DashboardChart from "@/components/elements/DashboardChart"
import DeleteFile from "@/components/elements/DeleteFile"
import LayoutAdmin from "@/components/layout/LayoutAdmin"
import Link from "next/link";
import { insertData, deletedData } from "../../components/api/Axios/Helper";
import Preloader from "@/components/elements/Preloader";
import DashboardLineChart from "@/components/elements/DashboardLineChart"
import SimpleBarChart from "@/components/elements/DashboardLineChart"
import CommentChart from "@/components/elements/CommentChart"
import ViewChart from "@/components/elements/ViewChart"
import LikeChart from "@/components/elements/DashboardLineChart"
import LeadChart from "@/components/elements/LeadChart"
import CallChart from "@/components/elements/CallChart"
import MessageChart from "@/components/elements/MessageChart"
import ContactChart from "@/components/elements/ContactChat"
import { navigateTo } from '@/components/common/Functions';
import { useRouter } from 'next/navigation';
import PieChart from "@/components/chart/PieChart"
import MultiGroupChart from "@/components/chart/BarChart"
import ConversionRateChart from "@/components/chart/ConversionRateChart"
import DualLineChart from "@/components/chart/DualLineChart"
import SemicircularProgressChart from "@/components/chart/SemicircularProgressChart"
import DualChart from "@/components/chart/DualChart"

export default function Dashboard() {
	const [startDate, setStartDate] = useState(new Date())
	const [endDate, setEndDate] = useState(new Date())
	const [loading, setLoading] = useState(true);
	const [dashboardData, setDashboardData] = useState([]);
	const [userType, setUserType] = useState('')
	const router = useRouter();
	const [notifications, setNotifications] = useState([]);
	const [notificationLoading, setNotificationLoading] = useState(false);
	const [chatUserData, setChatUserData] = useState([]); // Add this line



	console.log(notifications, '>>>>>>>>>>>>>>>>>>notifications');

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		try {
	// 			if (dashboardData.length === 0) {
	// 				const geDashboardInfo = await insertData('api/dashboard/list', {}, true);
	// 				setDashboardData(geDashboardInfo);
	// 				setLoading(false);
	// 			}

	// 			if (localStorage.getItem('isLoggedIn')) {
	// 				const userDetail = JSON.parse(localStorage.getItem('user'));
	// 				setUserType(userDetail.roles.name);
	// 			}

	// 			if (notifications.length === 0) {
	// 				setNotificationLoading(true);
	// 				const userDetail = JSON.parse(localStorage.getItem('user'));

	// 				const getNotification = await insertData('api/notification/get', {
	// 					userId: userDetail.id, // Make sure to pass the userId
	// 					page: 1,
	// 					limit: 10
	// 				}, true);

	// 				// console.log(getNotification, '>>>>>>>>>>>>>>>>>>getNotification');

	// 				if (getNotification && getNotification.data && getNotification.data.notifications) {
	// 					setNotifications(getNotification.data.notifications);
	// 				} else if (getNotification && Array.isArray(getNotification)) {
	// 					setNotifications(getNotification);
	// 				} else {
	// 					console.warn('Unexpected notification response structure:', getNotification);
	// 					setNotifications([]);
	// 				}

	// 				setNotificationLoading(false);
	// 			}

	// 		} catch (error) {
	// 			console.error('Error fetching data:', error);
	// 			setNotificationLoading(false);
	// 		}
	// 	}

	// 	fetchData();
	// }, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch dashboard data if empty
				if (dashboardData.length === 0) {
					const geDashboardInfo = await insertData('api/dashboard/list', {}, true);
					setDashboardData(geDashboardInfo);
					setLoading(false);
				}

				// Set user type from localStorage
				const isLoggedIn = localStorage.getItem('isLoggedIn');
				if (isLoggedIn) {
					const userDetail = JSON.parse(localStorage.getItem('user'));
					setUserType(userDetail.roles.name);
				}

				if (notifications.length === 0) {
					setNotificationLoading(true);
					const userDetail = JSON.parse(localStorage.getItem('user'));

					const getNotification = await insertData('api/notification/get', {
						userId: userDetail.id, // Make sure to pass the userId
						page: 1,
						limit: 10
					}, true);

					// console.log(getNotification, '>>>>>>>>>>>>>>>>>>getNotification');

					if (getNotification && getNotification.data && getNotification.data.notifications) {
						setNotifications(getNotification.data.notifications);
					} else if (getNotification && Array.isArray(getNotification)) {
						setNotifications(getNotification);
					} else {
						console.warn('Unexpected notification response structure:', getNotification);
						setNotifications([]);
					}

					setNotificationLoading(false);
				}

				console.log(chatUserData, '>>>>>>>>>>>> chatUserData');
				// Fetch notifications/chat messages if empty
				if (chatUserData.length === 0) {
					setNotificationLoading(true);

					const userDetail = JSON.parse(localStorage.getItem('user'));
					const getNotification = await insertData('api/notification/get-chat', {
						userId: userDetail.id,
						page: 1,
						limit: 10
					}, true);

					// Ensure getNotification.data.chatUserData exists
					if (getNotification && getNotification.data && getNotification.data.chatUserData) {
						setChatUserData(getNotification.data.chatUserData); // Replace setNotifications with setChatUserData
					} else if (getNotification && Array.isArray(getNotification)) {
						setChatUserData(getNotification); // Fallback if response is an array
					} else {
						console.warn('Unexpected chat data response structure:', getNotification);
						setChatUserData([]); // Fallback to empty array
					}

					setNotificationLoading(false);
				}

			} catch (error) {
				console.error('Error fetching data:', error);
				setNotificationLoading(false);
			}
		};

		fetchData();
	}, []);


	//if (loading) return <p>Loading notifications...</p>;

	return (
		<>
			{
				loading ? (
					<Preloader />
				) : (
					<>
						<DeleteFile />
						<LayoutAdmin>
							<div className="dashboard-section">
								<div className="data-section">
									<div className="dashboard-inner-content">
										<div className="counter-section-info">
											<h5>Today's Data</h5>
											<span>Data Sumeery</span>
										</div>
										<div className="flat-counter-v1 tf-counter counter-section-detail">
											{userType == "developer" && (
												<div
													className="project-count custom-link"
													onClick={() => navigateTo(router, '/project-listing')}>
													<div className="flat-counter-vv2 tf-counter">
														<img src="/images/dashboard/project-icon.svg" />
														<div className="content-box inner-content-detail">
															<div className="number" data-speed={1000} data-to={dashboardData?.data?.project_count}>
																<CountetNumber count={dashboardData?.data?.project_count} />
															</div>
															<h5>Total Projects</h5>
															<span className={ (dashboardData?.data?.project_yesterday.flag == 1)?`success`: `error`} >{dashboardData?.data?.project_yesterday.text} from yesterday</span>
														</div>
													</div>
												</div>
											)}


											<div className="properties-count custom-link"
												onClick={() => navigateTo(router, '/property-listing')}>
												<div className="flat-counter-vv2 tf-counter ">
													<img src="/images/dashboard/properties-icon.svg" />
													<div className="content-box counter-section-info1" >
														<div className="number" data-speed={1000} data-to={dashboardData?.data?.property_count}><CountetNumber count={dashboardData?.data?.property_count} /></div>
														<h5>Total Properties</h5>
														{/* <span>+5% from yesterday</span> */}
														<span className={ (dashboardData?.data?.property_yesterday.flag == 1)?`success`: `error`} >{dashboardData?.data?.property_yesterday.text} from yesterday</span>

													</div>
												</div>
											</div>

											<div className="likes-count custom-link"
												onClick={() => navigateTo(router, '/liked-properties')}>
												<div className="flat-counter-vv2 tf-counter ">
													<img src="/images/dashboard/likes-icon.svg" />
													<div className="content-box counter-section-info1">
														<div className="number" data-speed={1000} data-to={dashboardData?.data?.property_like_count}><CountetNumber count={dashboardData?.data?.property_like_count} /></div>
														<h5>Likes</h5>
														<span className={ (dashboardData?.data?.property_like_yesterday.flag == 1)?`success`: `error`} >{dashboardData?.data?.property_like_yesterday.text} from yesterday</span>
													</div>
												</div>
											</div>
											<div className="clicks-count custom-link"
												onClick={() => navigateTo(router, '/visit-schedule')}>
												<div className="flat-counter-vv2 tf-counter ">
													<img src="/images/dashboard/clicks-icon.svg" />
													<div className="content-box counter-section-info1">
														<div className="number" data-speed={1000} data-to={dashboardData?.data?.property_visit_count}><CountetNumber count={dashboardData?.data?.property_visit_count} /></div>
														<h5>Total Property Visit</h5>
														<span className={ (dashboardData?.data?.property_visit_yesterday.flag == 1)?`success`: `error`} >{dashboardData?.data?.property_visit_yesterday.text} from yesterday</span>
													</div>
												</div>
											</div>
										
											<div className="impression-count custom-link">
												<div className="flat-counter-vv2 tf-counter ">
													<img src="/images/dashboard/impression-icon.svg" />
													<div className="content-box counter-section-info1">
														<div className="number" data-speed={1000} data-to="0"><CountetNumber count="0" /></div>
														<h5>Total Impression</h5>
														<span>0% from yesterday</span>
													</div>
												</div>
											</div>
											<div className="reviews-count custom-link">
												<div className="flat-counter-vv2 tf-counter ">
													<img src="/images/dashboard/proprety-icon.svg" />
													<div className="content-box counter-section-info1">
														<div className="number" data-speed={1000} data-to={dashboardData?.data?.property_view_count}><CountetNumber count={dashboardData?.data?.property_view_count} /></div>
														<h5>Total Property Views</h5>
														<span className={ (dashboardData?.data?.property_view_yesterday.flag == 1)?`success`: `error`} >{dashboardData?.data?.property_view_yesterday.text} from yesterday</span>
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className="notification-container">
										<div className="notification-container-info">
											<h5>Notification</h5><br />
											<div className="notification-list">
												{notificationLoading ? (
													<Preloader />
												) : notifications.length === 0 ? (
													<p>No notifications found.</p>
												) : (
													notifications.map((notif) => {
														// Determine icon based on notification type
														let iconSrc;
														switch (notif.type) {
															case 'PROJECT':
																iconSrc = '/images/dashboard/property-notify.svg';
																break;
															case 'PROPERTY':
																iconSrc = '/images/dashboard/project-notify.svg';
																break;
															default:
																iconSrc = '/images/dashboard/notification.svg';
														}

														return (
															<div className="notification-item" key={notif.id}>
																<div className="notification-img">
																	<img
																		src={notif.image || iconSrc}
																		alt={`${notif.type} Notification`}
																	/>
																</div>
																<div className="notification-detail">
																	<h6>{notif.title}</h6>
																	<span className="notification-time">{notif.timeAgo}</span>
																</div>
															</div>
														);
													})
												)}
											</div>
										</div>
									</div>
								</div>

								<div className="">
									<div className="activity-inner-content">
										{/* <div className="bar-chart-container">
											< MultiGroupChart />
										</div> */}
										<div className="bar-chart-container">
											{/* < MultiGroupChart data={dashboardData?.data?.likeChartData} /> */}
											<MultiGroupChart
												data={dashboardData?.data?.chartResponseData}
											/>

										</div>
										<div className="notification-container">
											<div className="notification-container-info">
												<h5>Recent Messages</h5><br />
												<div className="notification-list">
													{notificationLoading ? (
														<Preloader />
													) : chatUserData.length === 0 ? (
														<p>No messages found.</p>
													) : (
														chatUserData.map((notif) => {
															let iconSrc = '/images/dashboard/notification.svg'; // or use notif.image if available
															return (
																<div className="notification-item" key={notif.id}>
																	<div className="notification-img">
																		<img
																			src={notif.image || iconSrc}
																			alt={`${notif.userName} Notification`}
																		/>
																	</div>
																	<div className="notification-detail">
																		<h6>{notif.title}</h6>
																		<span className="notification-time">{notif.timeAgo}</span>
																	</div>
																</div>
															);
														})
													)}

												</div>
											</div>
										</div>
									</div>
								</div>	
								{console.log(dashboardData?.data?.visit, ' >>>>>>>>>>>>> Visit data')}

								<div className="lead-section">
									<div className="lead-visit-container">
										<div className="lead-visit-container-info">
											<h6>Staticis</h6>
											<h3>Lead to Visit Conversion Rate</h3>
											<DualLineChart chartData={dashboardData?.data?.visit} />
										</div>
									</div>
									<div className="lead-inner-content">
										<div className="total-lead-container-info">
											<div className="total-lead-info">
												<div className="total-lead-container-inner">
													<h6>Total Leads</h6>
													<h3>32,000</h3>
												</div>
												<div className="total-lead-container-outer">
													<h6>Converted Lead</h6>
													<h3>7,600</h3>
												</div>
											</div>
											< SemicircularProgressChart />
										</div>
									</div>
								</div>
							</div>
						</LayoutAdmin >

					</>
				)
			}
		</>
	)
}	