
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

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (dashboardData.length === 0) {
					const geDashboardInfo = await insertData('api/dashboard/list', {}, true);
					setDashboardData(geDashboardInfo);
					setLoading(false);
				}
				if (localStorage.getItem('isLoggedIn')) {
					const userDetail = JSON.parse(localStorage.getItem('user'));
					setUserType(userDetail.roles.name);
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		}
		fetchData();
	});

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
								<div className="dashboard-inner-content">
									<div className="counter-section-info">
										<h5>Today's Data</h5>
										<span>Data Sumeery</span>
									</div>
									<div className="flat-counter-v1 tf-counter counter-section-detail">
										{userType == "developer" && (
											<div className="project-count">
												<div className="flat-counter-vv2 tf-counter">
													<img src="/images/dashboard/project-icon.svg" />
													<div className="content-box inner-content-detail">
														<div className="number" data-speed={1000} data-to={dashboardData?.data?.project_count}><CountetNumber count={dashboardData?.data?.project_count} /></div>
														<h5>Total Projects</h5>
														<span>+8% from yesterday</span>
													</div>
												</div>
											</div>
										)
										}

										<div className="properties-count">
											<div className="flat-counter-vv2 tf-counter ">
												<img src="/images/dashboard/properties-icon.svg" />
												<div className="content-box counter-section-info1" >
													<div className="number" data-speed={1000} data-to={dashboardData?.data?.property_count}><CountetNumber count={dashboardData?.data?.property_count} /></div>
													<h5>Total Properties</h5>
													<span>+5% from yesterday</span>
												</div>
											</div>
										</div>

										<div className="likes-count">
											<div className="flat-counter-vv2 tf-counter ">
												<img src="/images/dashboard/likes-icon.svg" />
												<div className="content-box counter-section-info1">
													<div className="number" data-speed={1000} data-to={dashboardData?.data?.property_like_count}><CountetNumber count={dashboardData?.data?.property_like_count} /></div>
													<h5>Likes</h5>
													<span>+1,2% from yesterday</span>
												</div>
											</div>
										</div>

										<div className="impression-count">
											<div className="flat-counter-vv2 tf-counter ">
												<img src="/images/dashboard/impression-icon.svg" />
												<div className="content-box counter-section-info1">
													<div className="number" data-speed={1000} data-to="0"><CountetNumber count="0" /></div>
													<h5>Total Impression</h5>
													<span>8% from yesterday</span>
												</div>
											</div>
										</div>

										<div className="clicks-count">
											<div className="flat-counter-vv2 tf-counter ">
												<img src="/images/dashboard/clicks-icon.svg" />
												<div className="content-box counter-section-info1">
													<div className="number" data-speed={1000} data-to={dashboardData?.data?.property_visit_count}><CountetNumber count={dashboardData?.data?.property_visit_count} /></div>
													<h5>Total Property Visit</h5>
													<span>+5% from yesterday</span>
												</div>
											</div>
										</div>
										<div className="reviews-count">
											<div className="flat-counter-vv2 tf-counter ">
												<img src="/images/dashboard/proprety-icon.svg" />
												<div className="content-box counter-section-info1">
													<div className="number" data-speed={1000} data-to={dashboardData?.data?.property_view_count}><CountetNumber count={dashboardData?.data?.property_view_count} /></div>
													<h5>Total Property Views</h5>
													<span>+0,5% from yesterday</span>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="">
									<div className="activity-inner-content">
										<div className="bar-chart-container">
											< MultiGroupChart />
										</div>
										<div className="notification-container">
											<div className="notification-container-info">
												<h5>Notification</h5>
												<div className="notification-list">
													<div className="notification-item">
														<div className="notification-img">
															<img src="/images/dashboard/notification-user.svg" />
														</div>
														<div className="notification-detail">
															<h6>John Doe</h6>
															<span clasName="notification-time">3 min ago</span>
														</div>
													</div>
													<div className="notification-item">
														<div className="notification-img">
															<img src="/images/dashboard/notification-user.svg" />
														</div>
														<div className="notification-detail">
															<h6>John Doe</h6>
															<span clasName="notification-time">3 min ago</span>
														</div>
													</div>
													<div className="notification-item">
														<div className="notification-img">
															<img src="/images/dashboard/notification-user.svg" />
														</div>
														<div className="notification-detail">
															<h6>John Doe</h6>
															<span clasName="notification-time">3 min ago</span>
														</div>
													</div>
												</div>
											</div>
										</div>
										{/* <div className="traffic-container">
											<PieChart />
										</div> */}
									</div>
								</div>
								<div className="">
									<div className="activity-inner-content">
										<div className="bar-chart-container">
											{/* < MultiGroupChart data={dashboardData?.data?.likeChartData} /> */}
											<MultiGroupChart
												data={dashboardData?.data?.chartResponseData}
											/>

										</div>
										<div className="traffic-container">
											<div className="traffic-container-info">
												<p>Traffic</p>
												<span>March 2020</span>

												< PieChart />
											</div>
										</div>
									</div>
								</div>

								{/*<div className="lead-section">
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

									<div className="lead-visit-container">
										<div className="lead-visit-container-info">
											<h6>Staticis</h6>
											<h3>Lead to Visit Conversion Rate</h3>
											<DualLineChart />
										</div>
									</div>
								</div>
								<div className="activity-section">
									<div className="activity-inner-content">
										<div className="campaign-container">
											<div className="campaign-container-info">
												<h6>Staticis</h6>
												<h3>Campaign</h3>
												<DualChart />
												<div className="traffic-outer-container">
												</div>
											</div>
										</div>
									</div>
								</div> */}
							</div>
							{userType !== "user" ?
								<>
									<div>
										{/* <div className="flat-counter-v2 tf-counter">
											{userType == "developer" ?
												<div className="item custom-link" onClick={() => router.push('/project-listing')}>
													<div className="counter-box">
														<div className="box-icon w-68 round">
															<span className="icon icon-clock-countdown" />
														</div>
														<div className="content-box">
															<div className="title-count">Total Projecs</div>
															<div className="d-flex align-items-end">
																<h6 className="number" data-speed={2000} data-to={dashboardData?.data?.project_count}><CountetNumber count={dashboardData?.data?.project_count} /></h6>
															</div>
														</div>
													</div>
												</div>
												: ''}
											<div className="item custom-link" onClick={() => router.push('/property-listing')}>
												<div className="counter-box">
													<div className="box-icon w-68 round">
														<span className="icon icon-bookmark" />
													</div>
													<div className="content-box">
														<div className="title-count">Total Properties</div>
														<div className="d-flex align-items-end">
															<h6 className="number" data-speed={2000} data-to={dashboardData?.data?.property_count}><CountetNumber count={dashboardData?.data?.property_count} /></h6>
														</div>
													</div>
												</div>
											</div>
											<div className="item custom-link" onClick={() => router.push('/property-listing/like')}>
												<div className="counter-box" style={{ cursor: 'pointer' }}>
													<div className="box-icon w-68 round">
														<span className="icon icon-bookmark" />
													</div>
													<div className="content-box">
														<div className="title-count">Total Properties Likes</div>
														<div className="d-flex align-items-end">
															<h6 className="number" data-speed={2000} data-to={dashboardData?.data?.property_like_count}><CountetNumber count={dashboardData?.data?.property_like_count} /></h6>
														</div>
													</div>
												</div>
											</div>
											<div className="item custom-link" onClick={() => router.push('/property-listing/view')}>
												<div className="counter-box" style={{ cursor: 'pointer' }}>
													<div className="box-icon w-68 round">
														<span className="icon icon-bookmark" />
													</div>
													<div className="content-box">
														<div className="title-count">Total Properties Views</div>
														<div className="d-flex align-items-end">
															<h6 className="number" data-speed={2000} data-to={dashboardData?.data?.property_view_count}><CountetNumber count={dashboardData?.data?.property_view_count} /></h6>
														</div>
													</div>
												</div>
											</div>
											<div className="item custom-link" onClick={() => router.push('/property-listing/comment')}>
											<div className="counter-box" style={{ cursor: 'pointer' }}>
												<div className="box-icon w-68 round">
													<span className="icon icon-bookmark" />
												</div>
												<div className="content-box">
													<div className="title-count">Total Properties Comments</div>
													<div className="d-flex align-items-end">
														<h6 className="number" data-speed={2000} data-to={dashboardData?.data?.property_comment_count}><CountetNumber count={dashboardData?.data?.property_comment_count} /></h6>
													</div>
												</div>
											</div>
										</div>
										</div>
										<div className="wrapper-content row">
											<div className="col-xl-12">

												<div className="widget-box-2 wd-chart">
													<h6 className="title">Property Likes Engagement</h6>

													<div className="chart-box">
														<LikeChart />
													</div>
												</div>
											</div>
										</div>
										<div className="wrapper-content row" style={{ marginTop: '20px' }}>
											<div className="col-xl-12">

												<div className="widget-box-2 wd-chart">
													<h6 className="title">Lead to Visit Conversion Rate</h6>

													<div className="chart-box">
														<LeadChart />
													</div>
												</div>
											</div>
										</div>
										<div className="wrapper-content row" style={{ marginTop: '20px' }}>
											<div className="col-xl-12">

												<div className="widget-box-2 wd-chart">
													<h6 className="title">Property Comments Engagement</h6>

													<div className="chart-box">
														<CommentChart />
													</div>
												</div>
											</div>
										</div>
										<div className="wrapper-content row" style={{ marginTop: '20px' }}>
											<div className="col-xl-12">

												<div className="widget-box-2 wd-chart">
													<h6 className="title">Call Conversion Rate</h6>

													<div className="chart-box">
														<CallChart />
													</div>
												</div>
											</div>
										</div>
										<div className="wrapper-content row" style={{ marginTop: '20px' }}>
											<div className="col-xl-12">

												<div className="widget-box-2 wd-chart">
													<h6 className="title">Property Views Engagement</h6>

													<div className="chart-box">
														<ViewChart />
													</div>
												</div>
											</div>
										</div>
										<div className="wrapper-content row" style={{ marginTop: '20px' }}>
											<div className="col-xl-12">

												<div className="widget-box-2 wd-chart">
													<h6 className="title">Message Conversion Rate</h6>

													<div className="chart-box">
														<MessageChart />
													</div>
												</div>
											</div>
										</div>
										<div className="wrapper-content row" style={{ marginTop: '20px' }}>
											<div className="col-xl-12">

												<div className="widget-box-2 wd-chart">
													<h6 className="title">Property Contacts Engagement</h6>

													<div className="chart-box">
														<ContactChart />
													</div>
												</div>
											</div>
										</div> */}

									</div>
								</>
								:
								<></>
							}
						</LayoutAdmin >

					</>
				)
			}
		</>
	)
}	