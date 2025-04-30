'use client'
import Link from "next/link"
import React, { useEffect, useState } from 'react';
import Menu from "../Menu"
import MobileMenu from "../MobileMenu"
import { capitalizeFirstChar, getRandomInt } from "../../common/Functions.js"
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation';

export default function Header3({ scroll, isSidebar, handleSidebar, isMobileMenu,  handleMobileMenu }) {
	const [isToggled, setToggled] = useState(false)
	const handleToggle = () => setToggled(!isToggled)
	const [userName, setUserName] = useState('');
	const [userImage, setUserImage] = useState('');
	const router = useRouter();
	const [userType, setUserType] = useState('')
	const [loggedin, setLoggedin] = useState(false);
	const [showType, setShowType] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		setLoggedin(true);
	  const userDetail = JSON.parse(localStorage.getItem('user'));
	  setUserImage(userDetail.image)
	  const capitalizedString = capitalizeFirstChar(userDetail.user_name?userDetail.user_name:"user");
	  setUserName(capitalizedString)
	  // console.log(userDetail.user_name);

	  const userString  = localStorage.getItem('user')
	  if (userString) {
		const user = JSON.parse(userString);
		if(user.roles.name){
			setShowType(user.roles.name)
		}
	  } else {
		// console.log("No user data found in localStorage.");
	  }
	}, []);
	const pathname = usePathname();

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		localStorage.removeItem('tokenExpiration');
		localStorage.removeItem('isLoggedIn');
		router.push('/');
	}
	useEffect(() => {
		const loggedInStatus = JSON.parse(localStorage.getItem('user'));
		setUserType(loggedInStatus.roles.name);
	}, [])
	// console.log(userType);
	return (
		<>

			<header className="main-header fixed-header header-dashboard">
				{/* Header Lower */}
				<div className="header-lower">
					<div className="row">
						<div className="col-lg-12">
							<div className="inner-container d-flex justify-content-between align-items-center">
								{/* Logo Box */}
								<div className="logo-box d-flex">
									{showType == 'user' &&
										<div className="logo"><Link href="/"><img src="/images/logo/logo.svg" alt="logo" width={174} height={44} /></Link></div>
									}
									{showType != 'user' &&
										<div className="logo"><Link href="/"><img src="/images/logo/logo.svg" alt="logo" width={174} height={44} /></Link></div>
									}
									<div className="button-show-hide" onClick={handleSidebar}>
										<span className="icon icon-categories" />
									</div>
								</div>
								<div className="nav-outer">
									{/* Main Menu */}
									<nav className="main-menu show navbar-expand-md">
										<div className="navbar-collapse collapse clearfix" id="navbarSupportedContent">
											{/* <Menu /> */}
										</div>
									</nav>
									{/* Main Menu End*/}
								</div>
								<div className={loggedin?"header-account loggedin":"header-account"}>
									
									<a onClick={handleToggle} className={`box-avatar dropdown-toggle ${isToggled ? "show" : ""}`}>
										<div className="avatar avt-40 round">
											{userImage? <img src={userImage} alt="avt" /> : <div className="user-charcter">{userName.charAt(0)}</div>}
										</div>
										<div>
											<p className="name">{userName??""}<span className="icon icon-arr-down" /></p>
											<span className="text-variant-1" >{userType.charAt(0).toUpperCase() + userType.slice(1)}</span>
										</div>
									</a>
									
									<div className={`dropdown-menu  ${isToggled ? "show" : ""}`} >
										{/* {(userType !== 'user')?
											<>
												<Link className="dropdown-item" href="/my-favorites">My Properties</Link>
												<Link className="dropdown-item" href="/add-property">Add Property</Link>
											</>
											:""
										} */}
										{/*<Link className="dropdown-item" href="/my-invoices">My Invoices</Link>
										<Link className="dropdown-item" href="/my-favorites">My Favorites</Link>
										<Link className="dropdown-item" href="/reviews">Reviews</Link>
										<Link className="dropdown-item" href="/my-profile">My Profile</Link>
										 */}
										<Link className="dropdown-item" onClick={handleLogout}  href="/">Logout</Link>
									</div>

									{/* <div className="flat-bt-top">
										<Link className="tf-btn primary" href="#">Submit Property</Link>
									</div> */}
								</div>
								<div className="mobile-nav-toggler mobile-button" onClick={handleMobileMenu}><span /></div>
							</div>
						</div>
					</div>
				</div>
				{/* End Header Lower */}
				{/* Mobile Menu  */}
				<div className="close-btn" onClick={handleMobileMenu}><span className="icon flaticon-cancel-1" /></div>
				<div className="mobile-menu">
					<div className="menu-backdrop" onClick={handleMobileMenu} />
					<nav className="menu-box">
						<div className="nav-logo"><img src="/images/logo/logo.svg" alt="nav-logo" width={174} height={44} /></div>
						<div className="bottom-canvas">
							<MobileMenu />
							{/* <div className="button-mobi-sell">
								<Link className="tf-btn primary" href="#">Submit Property</Link>
							</div> */}
							<div className="mobi-icon-box">
								<div className="box d-flex align-items-center">
									<span className="icon icon-phone2" />
									<div>1-333-345-6868</div>
								</div>
								<div className="box d-flex align-items-center">
									<span className="icon icon-mail" />
									<div>immofindmaroc@gmail.com</div>
								</div>
							</div>
						</div>
					</nav>
				</div>
				{/* End Mobile Menu */}
			</header>

		</>
	)
}



