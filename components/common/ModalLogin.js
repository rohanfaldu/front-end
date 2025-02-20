'use client'
import Link from "next/link"
import FacebookLogin from 'react-facebook-login';
import React, { useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { userType } from "./Functions.js";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { insertData } from "../api/Axios/Helper.js";
import { split } from "./Functions.js";
import { useTranslation } from "react-i18next";
export default function ModalLogin({ isLogin, handleLogin, isRegister, handleRegister, handleForgotPassword }) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [OTPEnter, setOTPEnter] = useState(false);
 	const [user, setUser] = useState(null);
 	const [errorMessage, setErrorMessage] = useState('');
 	const [errorOtpMessage, setErrorOtpMessage] = useState('');
 	const [emailAddress, setEmailAddress] = useState('');
 	const [phoneNumber, setPhoneNumber] = useState('');
	 const [sucessMessage, setSucessMessage] = useState(false);
	 const { t, i18n } = useTranslation();
 	const base_url = process.env.NEXT_PUBLIC_API_URL;
	const clientId = process.env.NEXT_PUBLIC_GOOGLE_LOGIN_CLIENT_ID;
	const responseFacebook = async (response) => {
		console.log(response); // Contains user data from Facebook
		if (response.status !== 'unknown') {
			const checkData = { email_address: response.email,  phone_number: '' }
			const getUserInfo = await insertData('auth/check/user', checkData);
			console.log(getUserInfo);
			if(getUserInfo.status === false) {
				const APP_API_URL = base_url;
				const userData = {
					full_name: response.name, 
					user_name: split(response.name,0), 
					email_address: response.email, 
					fcm_token: response.accessToken, 
					image_url: response.picture.data.url?response.picture.data.url : '', 
					type: "user", 
					social_id: response.id,
					user_login_type	: "FACEBOOK",
					phone_number: null, 
					password: null,
					user_id: null,
					device_type: 'web'
				}
				try {
					const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/create/user`, userData, {
						headers: {
							'Content-Type': 'application/json'
						},
					});
					if(response.data.status === true) {
						localStorage.setItem('token', response.data.data.token);
						localStorage.setItem('user', JSON.stringify(response.data.data.userProfile));
						const expirationTime = Date.now() + 3600000; // 1 hour from now
						localStorage.setItem('tokenExpiration', expirationTime);
						localStorage.setItem('isLoggedIn', 'true');
						window.location.reload();
					}
					
				} catch (error) {
					console.error('Error sending data:', error);
				}
			}else{
				if(getUserInfo.data.userProfile.user_login_type != 'FACEBOOK'){
					setErrorMessage('User already exists with another social app.');
				}else{
					localStorage.setItem('token', getUserInfo.data.token);
					localStorage.setItem('user', JSON.stringify(getUserInfo.data.userProfile));
					const expirationTime = Date.now() + 3600000; // 1 hour from now
					localStorage.setItem('tokenExpiration', expirationTime);
					localStorage.setItem('isLoggedIn', 'true');
					window.location.reload();
				}
			}
		}
	};
	const router = useRouter();
  	const handleGoogleSuccess = async (response) => {
		const idToken = response.credential;
		const userObject = jwtDecode(response.credential);
		const checkData = { email_address: userObject.email,  phone_number: '' }
		const getUserInfo = await insertData('auth/check/user', checkData);
		
		if(getUserInfo.status === false) {
			const userData = {
				full_name: userObject.name, 
				user_name: split(userObject.given_name,0),
				email_address: userObject.email, 
				fcm_token: idToken, 
				image_url: 	userObject.picture?userObject.picture : '', 
				type: "user",
				social_id: userObject.sub,
				user_login_type	: "GOOGLE", 
				phone_number: null, 
				password: null,
				user_id: null,
				device_type: 'web'
			}
			console.log(userData);
			try {
				const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/create/user`, userData, {
					headers: {
						'Content-Type': 'application/json'
					},
				});
				console.log(response,"ffffff")
				if(response.data.status === true) {
					localStorage.setItem('token', response.data.data.token);
					localStorage.setItem('user', JSON.stringify(response.data.data.userProfile));
					const expirationTime = Date.now() + 3600000; // 1 hour from now
					localStorage.setItem('tokenExpiration', expirationTime);
					localStorage.setItem('isLoggedIn', 'true');
					window.location.reload();
				}
				
			} catch (error) {
				console.error('Error sending data:', error);
			}
		}else{
			if(getUserInfo.data.userProfile.user_login_type != 'GOOGLE'){
				setErrorMessage('User already exists with another social app.');
			}else{
				console.log(3)
				console.log(getUserInfo.data)
				localStorage.setItem('token', getUserInfo.data.token);
				localStorage.setItem('user', JSON.stringify(getUserInfo.data.userProfile));
				const expirationTime = Date.now() + 3600000; // 1 hour from now
				localStorage.setItem('tokenExpiration', expirationTime);
				localStorage.setItem('isLoggedIn', 'true');
				window.location.reload();
			}
		}
	};
	const onFailure = (response) => {
		console.error('Login failed: res:', response);
	};
	/*****  Login *******/
	const [showPassword, setShowPassword] = useState(false);
	const [otp, setOtp] = useState(['', '', '', '', '', '']); // Array to hold OTP values

	const validateEmail = (email) => {
		const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailPattern.test(email);
	};

	const validatePhoneNumber = (phoneNumber) => {
		const phonePattern = /^\d{10}$/;
		return phonePattern.test(phoneNumber);
	};
    const validationSchema = Yup.object({
        email_address: Yup.string()
          .required("Please enter valid Email address or phone number is required"),
        password: Yup.string()
          .required("Password is required"),
    });
	const handleSubmit =async (values) => {
		setErrorMessage('');
		try {

			let email_address = "";
			let phone_number = "";
			if (validateEmail(values.email_address)) {
				setEmailAddress(values.email_address);
				email_address = values.email_address;
			} else if (validatePhoneNumber(values.email_address)) {
				setPhoneNumber(values.email_address);
				phone_number = values.email_address;
			} else {
				setErrorMessage('Please enter valid Email address or phone number.');
			}
			
			const checkData = { email_address: values.email_address,  phone_number: '' }
			const getUserInfo = await insertData('auth/check/user', checkData);
			console.log(getUserInfo,"response")

			if(getUserInfo.status === true) {
				const sendData = JSON.stringify({email_address: values.email_address, phone_number: values.phone_number, password: values.password, device_type: "web"});
				const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/password`, sendData, {
					headers: {
						"Content-Type": "application/json",
					},
				});
				console.log(response.data.data.userProfile.role_id,"response.data.userProfile.role_id")

				if(response.data.status === true) {
					localStorage.setItem('token', response.data.data.token);
					localStorage.setItem('user', JSON.stringify(response.data.data.userProfile));

					// Set the token to expire in 1 hour (3600 seconds)
					const expirationTime = Date.now() + 3600000; // 1 hour from now
					localStorage.setItem('tokenExpiration', expirationTime);
					localStorage.setItem('isLoggedIn', 'true');
					// window.location.reload();
					console.log(response.data.data.userProfile.role_id,"response.data.userProfile.role_id")
					if(response.data.data.userProfile.role_id == 'c326e1e2-6f82-4af4-ba25-06029eba658f'){
						window.location.reload();
					}else{
						window.location.href = '/dashboard';
					}
				} else {
					setErrorMessage(response.data.message);
				}
			}else{
				console.log(getUserInfo)
				setErrorMessage(getUserInfo.message);
			}
		  } catch (error) {
			setErrorMessage('Server Error. Please try again later.');
		}
    };
	
	const messageClass = (sucessMessage) ? "message success" : "message error";
	return (
		<>
			<div className={`modal fade ${isLogin ? "show d-block" : ""}`} id="modalLogin">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="flat-account bg-surface">
							<h3 className="title text-center">{t("login")}</h3>
							<span className="close-modal icon-close2" onClick={handleLogin} />
							{errorMessage && <div className={messageClass}>{errorMessage}</div>}
							<Formik
								initialValues={{ email_address: "", password:"" }}
								validationSchema={validationSchema}
								onSubmit={handleSubmit}
								>
								{({ errors, touched, handleChange, handleBlur }) => (
										<Form>
											<fieldset className="box-fieldset">
												<label htmlFor="name">{t("emailAddress")}<span>*</span>:</label>
												<Field type="text" id="email_address" name="email_address" className="form-control style-1" />
												<ErrorMessage name="email_address" component="div" className="error" />
											</fieldset>
											<fieldset className="box-fieldset">
												<label htmlFor="pass">{t("password")}<span>*</span>:</label>
												<Field 
													type={showPassword ? "text" : "password"}
													id="password" 
													name="password"
													onChange={handleChange}
													onBlur={handleBlur} 
													style={{ width: "100%", paddingRight: "2.5rem" }}
												/>
												<span
													onClick={() => setShowPassword((prev) => !prev)}
													className="show-password"
													>
													{showPassword ? <img src="/images/favicon/password-show.png" /> : <img src="/images/favicon/password-hide.png" /> }
												</span>
												<ErrorMessage name="password" component="div" className="error" />
											</fieldset>
											<div className="d-flex justify-content-between flex-wrap gap-12">
												<fieldset className="d-flex align-items-center gap-6">
													<Field
														type="checkbox"
														id="remeber_me" 
														name="remeber_me"
														className="tf-checkbox style-2"
													/>
													<label htmlFor="cb1" className="caption-1 text-variant-1">{t("rememberme")}</label>
												</fieldset>
												<Link href="/" className="caption-1 text-primary" onClick={handleForgotPassword}>{t("forgotpassword")}</Link>
												<button type="submit" className="tf-btn primary w-100">{t('loginButton')}</button>
											</div>
										</Form>
									)}
							</Formik>
							<div className="text-variant-1 auth-line">{t('signupwith')}</div>
							<div className="login-social">
								{/* <Link href="#" className="btn-login-social">
									<img src="/images/logo/fb.jpg" alt="img" />
									Continue with Facebook
								</Link>
								<Link href="#" className="btn-login-social">
									<img src="/images/logo/google.jpg" alt="img" />
									Continue with Google
								</Link> */}
								<FacebookLogin
									appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
									autoLoad={false}
									fields="name,email,picture"
									callback={responseFacebook}
									icon="fa-facebook"
									textButton="Continue with Facebook" 
								/>
								<GoogleOAuthProvider clientId={clientId}>
									<GoogleLogin
										clientId={clientId}
										onSuccess={handleGoogleSuccess}
										onFailure={onFailure}
										cookiePolicy={'single_host_origin'}
										className="btn-login-social"
										icon={true}  // Removes the default Google icon
									
									/>
								</GoogleOAuthProvider>

							</div>
							<div className="mt-16 text-variant-1 text-center noti">{t('dontAccount')}
								<a onClick={() => { handleLogin(); handleRegister() }} className="text-black fw-5">{t('singuphere')}</a>
							</div>
						</div>
					</div>
				</div>
			</div>

			{isLogin &&
				<div className={`modal-backdrop fade show`} onClick={handleLogin} />
			}

		</>
	)
}
