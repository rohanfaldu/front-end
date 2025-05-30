'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { GoogleOAuthProvider, useGoogleLogout, googleLogout } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { navigateTo } from '@/components/common/Functions';
import { debugLog } from '@/components/common/Functions';


export default function Sidebar() {
	const [userType, setUserType] = useState('')

	const pathname = usePathname()
	const [currentMenuItem, setCurrentMenuItem] = useState("")
	const router = useRouter();

	useEffect(() => {
		const loggedInStatus = JSON.parse(localStorage.getItem('user'));
		setUserType(loggedInStatus.roles.name);
		setCurrentMenuItem(pathname)
		
		debugLog('User loggedInStatus:', loggedInStatus);

	}, [pathname])

	const checkCurrentMenuItem = (path) => currentMenuItem === path ? "current" : ""
	const checkParentActive = (paths) => paths.some(path => currentMenuItem.startsWith(path)) ? "current" : ""

	const [isAccordion, setIsAccordion] = useState(1)

	const handleAccordion = (key) => {
		setIsAccordion(prevState => prevState === key ? null : key)
	}

	debugLog('User pathname:', pathname);



	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		localStorage.removeItem('tokenExpiration');
		localStorage.removeItem('isLoggedIn');
		router.push('/');
	}
	const clientId = process.env.NEXT_PUBLIC_GOOGLE_LOGIN_CLIENT_ID;
	return (
		<>
			<div className="sidebar-menu-dashboard admin-sidebar">
				<ul className="box-menu-dashboard">
					<li className={`nav-menu-item ${pathname === '/dashboard' ? 'active' : ''}`}>
						<div className="nav-menu-link custom-link" onClick={() => navigateTo(router, '/dashboard')}>
							<span className="icon icon-dashboard" /> Dashboards
						</div>
					</li>
					{(userType !== 'user') ?
						<>
							{(userType == 'developer') && (
								<li className={`nav-menu-item dropdown2 ${(pathname === '/create-project') || (pathname === '/project-listing') ? 'active' : ''}`}>
									<div
										className="nav-menu-link custom-link"
										onClick={() => navigateTo(router, '/create-project')}
									><svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M19.5 3H4.5C4.10218 3 3.72064 3.15804 3.43934 3.43934C3.15804 3.72064 3 4.10218 3 4.5V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H19.5C19.8978 21 20.2794 20.842 20.5607 20.5607C20.842 20.2794 21 19.8978 21 19.5V4.5C21 4.10218 20.842 3.72064 20.5607 3.43934C20.2794 3.15804 19.8978 3 19.5 3ZM19.5 19.5H4.5V4.5H19.5V19.5ZM16.5 12C16.5 12.1989 16.421 12.3897 16.2803 12.5303C16.1397 12.671 15.9489 12.75 15.75 12.75H12.75V15.75C12.75 15.9489 12.671 16.1397 12.5303 16.2803C12.3897 16.421 12.1989 16.5 12 16.5C11.8011 16.5 11.6103 16.421 11.4697 16.2803C11.329 16.1397 11.25 15.9489 11.25 15.75V12.75H8.25C8.05109 12.75 7.86032 12.671 7.71967 12.5303C7.57902 12.3897 7.5 12.1989 7.5 12C7.5 11.8011 7.57902 11.6103 7.71967 11.4697C7.86032 11.329 8.05109 11.25 8.25 11.25H11.25V8.25C11.25 8.05109 11.329 7.86032 11.4697 7.71967C11.6103 7.57902 11.8011 7.5 12 7.5C12.1989 7.5 12.3897 7.57902 12.5303 7.71967C12.671 7.86032 12.75 8.05109 12.75 8.25V11.25H15.75C15.9489 11.25 16.1397 11.329 16.2803 11.4697C16.421 11.6103 16.5 11.8011 16.5 12Z" fill="#A3ABB0" />
										</svg>
										Project
									</div>
									<ul style={{ display: `${isAccordion == 6 ? "block" : "none"}` }}>
										<li className={`${checkCurrentMenuItem("/create-project")}`}>
											<div className="sidebar-sudtom-tab custom-link" onClick={() => navigateTo(router, '/create-project')}>
												Create Project
											</div>
										</li>
										<li className={`${checkCurrentMenuItem("/project-listing")}`}>
											<div className="sidebar-sudtom-tab custom-link" onClick={() => navigateTo(router, '/project-listing')}>
												Project Listing
											</div>
										</li>
									</ul>
									<div className="dropdown2-btn" onClick={() => handleAccordion(6)} />
								</li>)}
							<li className={`nav-menu-item dropdown2 ${(pathname === '/create-property') ? 'active' : ''}`}>
								<div
									className="nav-menu-link custom-link"
									onClick={() => navigateTo(router, '/create-property')}
								><svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M19.5 3H4.5C4.10218 3 3.72064 3.15804 3.43934 3.43934C3.15804 3.72064 3 4.10218 3 4.5V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H19.5C19.8978 21 20.2794 20.842 20.5607 20.5607C20.842 20.2794 21 19.8978 21 19.5V4.5C21 4.10218 20.842 3.72064 20.5607 3.43934C20.2794 3.15804 19.8978 3 19.5 3ZM19.5 19.5H4.5V4.5H19.5V19.5ZM16.5 12C16.5 12.1989 16.421 12.3897 16.2803 12.5303C16.1397 12.671 15.9489 12.75 15.75 12.75H12.75V15.75C12.75 15.9489 12.671 16.1397 12.5303 16.2803C12.3897 16.421 12.1989 16.5 12 16.5C11.8011 16.5 11.6103 16.421 11.4697 16.2803C11.329 16.1397 11.25 15.9489 11.25 15.75V12.75H8.25C8.05109 12.75 7.86032 12.671 7.71967 12.5303C7.57902 12.3897 7.5 12.1989 7.5 12C7.5 11.8011 7.57902 11.6103 7.71967 11.4697C7.86032 11.329 8.05109 11.25 8.25 11.25H11.25V8.25C11.25 8.05109 11.329 7.86032 11.4697 7.71967C11.6103 7.57902 11.8011 7.5 12 7.5C12.1989 7.5 12.3897 7.57902 12.5303 7.71967C12.671 7.86032 12.75 8.05109 12.75 8.25V11.25H15.75C15.9489 11.25 16.1397 11.329 16.2803 11.4697C16.421 11.6103 16.5 11.8011 16.5 12Z" fill="#A3ABB0" />
									</svg>
									Property
								</div>
								<ul style={{ display: `${isAccordion == 8 ? "block" : "none"}` }}>
									<li className={`${checkCurrentMenuItem("/create-property")}`}>
										<div className="sidebar-sudtom-tab custom-link" onClick={() => navigateTo(router, '/create-property')}>
											Create Property
										</div>
									</li>
									<li className={`${checkCurrentMenuItem("/property-listing")}`}>
										<div className="sidebar-sudtom-tab custom-link" onClick={() => navigateTo(router, '/property-listing')}>
											Property Listing
										</div>

									</li>
								</ul>
								<div className="dropdown2-btn" onClick={() => handleAccordion(8)} />
							</li>
						</> : ""}
					<li className={`nav-menu-item ${pathname === '/liked-properties' ? 'active' : ''}`}>
						<div className="nav-menu-link custom-link" onClick={() => navigateTo(router, '/liked-properties')}>
							<img src={'/images/logo/thumbs-up-black.svg'} className="icon" style={{ height: "24px" }} />
							Liked Properties
						</div>
					</li>
					{(userType == 'user') &&
						<li className={`nav-menu-item ${pathname === '/user-chat' ? 'active' : ''}`}>
							<div className="nav-menu-link custom-link" onClick={() => navigateTo(router, '/user-chat')}>
								<img src={'/images/logo/chat-icon-new.svg'} className="icon" style={{ height: "24px" }} />
								Chats
							</div>
						</li>
					}
					{(userType == 'developer' || userType == 'agency') &&
						<li className={`nav-menu-item ${pathname === '/agent-chat' ? 'active' : ''}`}>
							<div className="nav-menu-link custom-link" onClick={() => navigateTo(router, '/agent-chat')}>
								<img src={'/images/logo/chat-icon-new.svg'} className="icon" style={{ height: "24px" }} />
								Chats
							</div>
						</li>
					}
					{((userType == 'developer') || (userType == 'agency')) &&
						<li className={`nav-menu-item ${pathname === '/visit-schedule' ? 'active' : ''}`}>
							<div className="nav-menu-link custom-link" onClick={() => navigateTo(router, '/visit-schedule')}>
								<div className="box-icon w-6 h-6 flex items-center justify-center">
									<span className="icon icon-clock-countdown" />
								</div>
								Visit Schedule
							</div>
						</li>
					}
					{(userType == 'user') &&
						<li className={`nav-menu-item ${pathname === '/visit-scheduler' ? 'active' : ''}`}>
							<div className="nav-menu-link custom-link" onClick={() => navigateTo(router, '/visit-scheduler')}>
								<div className="box-icon w-6 h-6 flex items-center justify-center">
									<span className="icon icon-clock-countdown" />
								</div>
								Visit Scheduler
							</div>
						</li>
					}

					<li className={`nav-menu-item ${pathname === '/edit-profile' ? 'active' : ''}`}>
						<div className="nav-menu-link custom-link" onClick={() => navigateTo(router, '/edit-profile')}>
							<img src={'/images/logo/userl.png'} className="icon" style={{ height: "24px" }} />
							Edit Profile
						</div>
					</li>
					<li className={`nav-menu-item ${pathname === '/' ? 'active' : ''}`}>
						<div className="nav-menu-link custom-link" onClick={handleLogout} href="/">
							<span className="icon icon-sign-out" />
							Logout
						</div>
					</li>
				</ul>
			</div>

		</>
	)
}
