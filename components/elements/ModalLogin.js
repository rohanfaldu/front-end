'use client'
import Link from "next/link"
import FacebookLogin from 'react-facebook-login';
import React, { useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { userType } from "../../components/common/functions";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";


export default function ModalLogin({ isLogin, handleLogin, isRegister, handleRegister, handleForgotPassword }) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [OTPEnter, setOTPEnter] = useState(false);
 	const [user, setUser] = useState(null);
 	const [errorMessage, setErrorMessage] = useState('');
 	const [errorOtpMessage, setErrorOtpMessage] = useState('');
 	const [emailAddress, setEmailAddress] = useState('');
 	const [phoneNumber, setPhoneNumber] = useState('');
	 const [sucessMessage, setSucessMessage] = useState(false);
 	const base_url = process.env.NEXT_PUBLIC_API_URL;
	const clientId = process.env.NEXT_PUBLIC_GOOGLE_LOGIN_CLIENT_ID;
	const responseFacebook = async (response) => {
		console.log(response); // Contains user data from Facebook
		if (response.status !== 'unknown') {
		  // Process response (e.g., save the user data or access token)
		  const APP_API_URL = base_url;
			const userData = {
				full_name: response.name, 
				user_name: response.name, 
				email_address: response.email, 
				fcm_token: response.accessToken, 
				image_url: response.picture.data.url?response.picture.data.url : '', 
				type: "user", 
				user_login_type	: userType("FACEBOOK"),
				mobile_number: '', 
				password: ''
			}
			try {
				const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/create/user`, userData, {
					headers: {
						'Content-Type': 'application/json'
					},
				});
				if(response.data.status === true) {
					localStorage.setItem('token', response.data.token);
					localStorage.setItem('user', JSON.stringify(response.data.data.userProfile));
					const expirationTime = Date.now() + 3600000; // 1 hour from now
					localStorage.setItem('tokenExpiration', expirationTime);
					localStorage.setItem('isLoggedIn', 'true');
					router.push('/dashboard');
				}
				
			} catch (error) {
				console.error('Error sending data:', error);
			}
		}
	};
	const router = useRouter();
  	const onSuccess = async (response) => {
		const APP_API_URL = base_url;
		const userObject = jwtDecode(response.credential); // Decode JWT to extract user info
		const userData = {
			full_name: userObject.name, 
			user_name: userObject.given_name, 
			email_address: userObject.email, 
			fcm_token: userObject.fcm_token, 
			image_url: 	userObject.picture?userObject.picture : '', 
			type: "user",
			user_login_type	: "GOOGLE", 
			mobile_number: '', 
			password: ''
		}
		try {
			const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/create/user`, userData, {
				headers: {
					'Content-Type': 'application/json'
				},
			});
			
			if(response.data.status === true) {
				localStorage.setItem('token', response.data.token);
				localStorage.setItem('user', JSON.stringify(response.data.data.userProfile));

				// Set the token to expire in 1 hour (3600 seconds)
				const expirationTime = Date.now() + 3600000; // 1 hour from now
				localStorage.setItem('tokenExpiration', expirationTime);
				localStorage.setItem('isLoggedIn', 'true');
				router.push('/dashboard');
			}
			
		} catch (error) {
			console.error('Error sending data:', error);
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
    });
	const handleSubmit =async (values) => {
		try {

			console.log(values);

			let email_address = "";
			if (validateEmail(values.email_address)) {
				setEmailAddress(values.email_address);
				email_address = values.email_address;
			} else{
				setErrorMessage('Please check your email address.');
			}

			let phone_number = "";
			if (validatePhoneNumber(values.email_address)) {
				setPhoneNumber(values.email_address);
				phone_number = values.email_address;
			} else {
				setErrorMessage('Please check your phone number.');
			}

			const sendData = JSON.stringify({email_address: email_address, phone_number: phone_number});
			const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/sendotp`, sendData, {
			  headers: {
				"Content-Type": "application/json",
			  },
			});
			console.log(response.data.status);
			if(response.data.status === true) {

				setSucessMessage(true);
				setErrorMessage(response.data.message);
				setOTPEnter(true);
			} else {
				setErrorMessage(response.data.message);
			}
		  } catch (error) {
			setErrorMessage('Server Error. Please try again later.');
		}
    };
	
	const otpvalidationSchema = Yup.object({
		otp: Yup.array()
		.of(Yup.string().length(1, "Each OTP digit must be 1 character").matches(/^\d$/, "Each OTP digit must be a number"))
		.length(6, "OTP must be 6 digits")
		.required("OTP is required"),
	});

	const handleOtpChange = (e, index) => {
		let value = e.target.value;
		if (value.match(/^\d$/)) {
		  const updatedOtp = [...otp];
		  updatedOtp[index] = value;
		  setOtp(updatedOtp);

		  if (index < otp.length - 1) {
			document.getElementById(`otp-${index + 1}`).focus();
		  }

		}
	};
	const handleKeyDown = (e, index) => {
		if (e.key === "Backspace" && index > 0 && otp[index] === '') {
		  document.getElementById(`otp-${index - 1}`).focus();
		}
	};
	const otphandleSubmit =async (values) => {
		try {
			const OTP = otp.join('');
			const sendData = JSON.stringify({email_address: emailAddress, phone_number: phoneNumber, code: OTP});
			const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, sendData, {
			  headers: {
				"Content-Type": "application/json",
			  },
			});
			if(response.data.status === true) {
				localStorage.setItem('token', response.data.token);
				localStorage.setItem('user', JSON.stringify(response.data.data.userProfile));

				// Set the token to expire in 1 hour (3600 seconds)
				const expirationTime = Date.now() + 3600000; // 1 hour from now
				localStorage.setItem('tokenExpiration', expirationTime);
				localStorage.setItem('isLoggedIn', 'true');
				router.push('/dashboard');
			} else {
				setErrorOtpMessage(response.data.message);
			}	
		  } catch (error) {
			setErrorOtpMessage('Server Error. Please try again later.');
		}
    };
	const messageClass = (sucessMessage) ? "message success" : "message error";
	return (
		<>
			<div className={`modal fade ${isLogin ? "show d-block" : ""}`} id="modalLogin">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="flat-account bg-surface">
						{OTPEnter?
							<>
								<div>
									<h3 className="title text-center">OTP</h3>
								 	<span className="close-modal icon-close2" onClick={handleLogin} />
									{errorOtpMessage && <div className="message error">{errorOtpMessage}</div>}

									<Formik
										initialValues={{ otp }}
										validationSchema={otpvalidationSchema}
										onSubmit={otphandleSubmit}
									>
										{({ errors, touched, handleChange, handleBlur }) => (
										<Form>
											<fieldset className="box-fieldset">
												<label htmlFor="otp">
													Enter OTP<span>*</span>:
												</label>
												<div className="otp-input-container">
													{/* Render 6 input boxes for OTP */}
													{otp.map((digit, index) => (
													<input
														key={index}
														type="text"
														id={`otp-${index}`}
														name={`otp[${index}]`}
														value={digit}
														onChange={(e) => handleOtpChange(e, index)} // Handle OTP change
														onBlur={handleBlur}
														onKeyDown={(e) => handleKeyDown(e, index)} // Handle keyDown for backspace auto-tab
														maxLength="1"
														className="otp-input"
													/>
													))}
												</div>
												<ErrorMessage name="otp" component="div" className="error" />
											</fieldset>

											<div className="d-flex justify-content-between flex-wrap gap-12">
												<button type="submit" className="tf-btn primary w-100">
													Submit OTP
												</button>
											</div>
										</Form>
										)}
									</Formik>
								</div>
							</>:
							<>
								<h3 className="title text-center">Log In</h3>
								<span className="close-modal icon-close2" onClick={handleLogin} />
								{errorMessage && <div className={messageClass}>{errorMessage}</div>}
								<Formik
									initialValues={{ email_address: "" }}
									validationSchema={validationSchema}
									onSubmit={handleSubmit}
									>
									{({ errors, touched, handleChange, handleBlur }) => (
										<Form>
											<fieldset className="box-fieldset">
												<label htmlFor="name">Email Address / Phone number<span>*</span>:</label>
												<Field type="text" id="email_address" name="email_address" className="form-control style-1" />
												<ErrorMessage name="email_address" component="div" className="error" />
											</fieldset>
											{/* <fieldset className="box-fieldset">
												<label htmlFor="pass">Password<span>*</span>:</label>
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
											</fieldset> */}
											<div className="d-flex justify-content-between flex-wrap gap-12">
												{/* <fieldset className="d-flex align-items-center gap-6">
													<Field
														type="checkbox"
														id="remeber_me" 
														name="remeber_me"
														className="tf-checkbox style-2"
													/>
													<label htmlFor="cb1" className="caption-1 text-variant-1">Remember me</label>
												</fieldset>
												<Link href="/" className="caption-1 text-primary" onClick={handleForgotPassword}>Forgot password?</Link> */}
												<button type="submit" className="tf-btn primary w-100">Login</button>
											</div>
										</Form>
									)}
								</Formik>
								<div className="text-variant-1 auth-line">or sign up with</div>
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
											onSuccess={onSuccess}
											onFailure={onFailure}
											cookiePolicy={'single_host_origin'}
											className="btn-login-social"
											icon={true}  // Removes the default Google icon
										
										/>
									</GoogleOAuthProvider>
								</div>
							</>
						}
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
