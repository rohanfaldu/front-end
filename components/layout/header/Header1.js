'use client'
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Menu from "../Menu";
import MobileMenu from "../MobileMenu";
import React, { useEffect, useState } from 'react';
import { capitalizeFirstChar, getRandomInt } from "../../common/Functions.js";
import LanguageSwitcher from "../langSwitcher";
import { useTranslation } from "react-i18next";

export default function Header1({ scroll, isMobileMenu, handleMobileMenu, isLogin, handleLogin, hcls, handleRegister }) {
	const [userName, setUserName] = useState('');
	const [userImage, setUserImage] = useState('');
	const [userStatus, setUserStatus] = useState(false);
	const [loggedin, setLoggedin] = useState(false);
	const [lang, setLang] = useState('en');
	const router = useRouter();
	const { t } = useTranslation();
	const handDashboard = () => {
		router.push('/dashboard');
	}

	useEffect(() => {
		if( localStorage.getItem('isLoggedIn') ){
			const userDetail = JSON.parse(localStorage.getItem('user'));
			setUserImage(userDetail.image)
			const capitalizedString = capitalizeFirstChar(userDetail.user_name);
			setUserName(capitalizedString)
			setUserStatus(localStorage.getItem('isLoggedIn'));
			
		}
		console.log(localStorage.getItem("lang"),"/////////////////////")
			if(localStorage.getItem("lang") !== null && localStorage.getItem("lang") !== undefined){
				setLang(localStorage.getItem("lang"))
			}else{
				setLang("fr")
			}
	}, []);

	return (
		<>
			<header className={`main-header fixed-header ${hcls ? "header-style-2" : ""} ${scroll ? "fixed-header is-fixed" : ""}`}>
				{/* Header Lower */}
				<div className="header-lower header-dashboard">
					<div className="row">
						<div className="col-lg-12">
							<div className="inner-container d-flex justify-content-between align-items-center">
								{/* Logo Box */}
								<div className="logo-box">
									<div className="logo">
										<Link href="/">
											{hcls ?
												<img src="/images/logo/ogo.svg" alt="logo" width={174} height={44} />
												:
												<img src="/images/logo/logo.svg" alt="logo" width={174} height={44} />
											}
										</Link>
									</div>
								</div>
								<div className="nav-outer ">
									{/* Main Menu */}
									<nav className="main-menu show navbar-expand-md">
										<div className="navbar-collapse collapse clearfix" id="navbarSupportedContent">
											<Menu />
										</div>
									</nav>
									{/* Main Menu End*/}
								</div>
								
								<div className="header-account"> 
									<div className="register">
										{userStatus ? 
												<>
													<a className={`box-avatar dropdown-toggle `} onClick={handDashboard}>
														<div className="avatar avt-40 round" >
															{userImage? <img src={userImage} alt="avt" /> : <img src="/images/avatar/avt-2.jpg" alt="avt" />}
														</div>
														<p className="name">{userName??""}</p>
													</a>
												</> 
											: 
												<>
													<ul className="d-flex">
														<li><a onClick={handleLogin}>{t("login")}</a></li>
														<li>/</li>
														<li><a onClick={handleRegister}>{t("register")}</a></li>
													</ul>
												</>
											}
									</div>
									<LanguageSwitcher language={lang} />
									{/* <div className="flat-bt-top">
										<Link className="tf-btn primary" href="/add-property">Submit Property</Link>
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
						<div className="nav-logo"><Link href="/"><img src="/images/logo/logo.svg" alt="nav-logo" width={174} height={44} /></Link></div>
						<div className="bottom-canvas">
							<div className="login-box flex align-items-center">
								<div className="login-registraion-sec">
								{userStatus ? 
												<>
													<a className={`box-avatar `} onClick={handDashboard}>
														<p className="name harmburger-name ">{userName??""}</p>
													</a>
												</> 
											: 
												<>
													<ul className="d-flex">
														<li><a onClick={handleLogin}>{t("login")}</a></li>
														<li>/</li>
														<li><a onClick={handleRegister}>{t("register")}</a></li>
													</ul>
												</>
											}
								</div>
								<div className="lang-sec">
									<LanguageSwitcher language={lang} />
								</div>
							</div>
							<MobileMenu />
							{/* <div className="button-mobi-sell">
								<Link className="tf-btn primary" href="/add-property">Submit Property</Link>
							</div> */}
							<div className="mobi-icon-box">
								<div className="box d-flex align-items-center">
									<span className="icon icon-phone2" />
									<div>1-333-345-6868</div>
								</div>
								<div className="box d-flex align-items-center">
									<span className="icon icon-mail" />
									<div>themesflat@gmail.com</div>
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
