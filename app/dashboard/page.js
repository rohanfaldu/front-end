
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
export default function Dashboard() {
	const [startDate, setStartDate] = useState(new Date())
	const [endDate, setEndDate] = useState(new Date())
	const [loading, setLoading] = useState(true);
	const [dashboardData, setDashboardData] = useState([]);
	const [userType, setUserType] = useState('')

	useEffect(() => {
        const fetchData = async () => {
			try {
				if(dashboardData.length === 0){
					const geDashboardInfo = await insertData('api/dashboard/list', {}, true);
					setDashboardData(geDashboardInfo);
					setLoading(false);
				}
				if( localStorage.getItem('isLoggedIn') ){
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
							{userType !== "user"? 
								<>
									<div>
										<div className="flat-counter-v2 tf-counter">
										{userType == "developer"? 
											<div className="counter-box">
												<div className="box-icon w-68 round">
													<span className="icon icon-clock-countdown" />
												</div>
												<Link href={`/project-listing`} className="item">
													<div className="content-box">
														<div className="title-count">Total Projecs</div>
														<div className="d-flex align-items-end">
															<h6 className="number" data-speed={2000} data-to={dashboardData?.data?.project_count}><CountetNumber count={dashboardData?.data?.project_count} /></h6>
														</div>
													</div>
												</Link>
											</div>
											: ''}
											<Link href={`/property-listing`} className="item">
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
											</Link>
											<Link href={`/property-listing/like`} className="item">
												<div className="counter-box" style={{cursor: 'pointer'}}>
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
											</Link>
											<Link href={`/property-listing/view`} className="item">
												<div className="counter-box" style={{cursor: 'pointer'}}>
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
											</Link>
											<Link href={`/property-listing/comment`} className="item">
												<div className="counter-box" style={{cursor: 'pointer'}}>
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
											</Link>
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
										<div className="wrapper-content row" style={{marginTop: '20px'}}>
											<div className="col-xl-12">
												
												<div className="widget-box-2 wd-chart">
													<h6 className="title">Lead to Visit Conversion Rate</h6>
													
													<div className="chart-box">
														<LeadChart />
													</div>
												</div>
											</div>
										</div>
										<div className="wrapper-content row" style={{marginTop: '20px'}}>
											<div className="col-xl-12">
												
												<div className="widget-box-2 wd-chart">
													<h6 className="title">Property Comments Engagement</h6>
													
													<div className="chart-box">
														<CommentChart />
													</div>
												</div>
											</div>
										</div>
										<div className="wrapper-content row" style={{marginTop: '20px'}}>
											<div className="col-xl-12">
												
												<div className="widget-box-2 wd-chart">
													<h6 className="title">Call Conversion Rate</h6>
													
													<div className="chart-box">
														<CallChart />
													</div>
												</div>
											</div>
										</div>
										<div className="wrapper-content row" style={{marginTop: '20px'}}>
											<div className="col-xl-12">
												
												<div className="widget-box-2 wd-chart">
													<h6 className="title">Property Views Engagement</h6>
													
													<div className="chart-box">
														<ViewChart />
													</div>
												</div>
											</div>
										</div>
										<div className="wrapper-content row" style={{marginTop: '20px'}}>
											<div className="col-xl-12">
												
												<div className="widget-box-2 wd-chart">
													<h6 className="title">Message Conversion Rate</h6>
													
													<div className="chart-box">
														<MessageChart />
													</div>
												</div>
											</div>
										</div>
										<div className="wrapper-content row" style={{marginTop: '20px'}}>
											<div className="col-xl-12">
												
												<div className="widget-box-2 wd-chart">
													<h6 className="title">Property Contacts Engagement</h6>
													
													<div className="chart-box">
														<ContactChart />
													</div>
												</div>
											</div>
										</div>

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