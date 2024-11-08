'use client'
import Link from "next/link"
import googleLogin from "../../components/api/Auth/Google"
import React, { useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { usePathname } from 'next/navigation'
import Dashboard from "@/app/dashboard/page";
export default function ModalLogin({ isLogin, handleLogin, isRegister, handleRegister }) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
 	const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
 	const base_url = process.env.APP_API_URL;
	const clientId = '137209708934-r21oa7tpg8q2ef31qnge136u3pogt3hf.apps.googleusercontent.com';
    const handleLoginSubmit = async (e) => {
        const APP_API_URL = "http://localhost:7000";
		e.preventDefault();
		try {
			const response = await axios.post(`${APP_API_URL}/auth/login`, {
				email_address: email,
				password: password
			}, {
				headers: {
					'Content-Type': 'application/json'
				},
			});

			if (response.data.status === true) {
				localStorage.setItem('token', response.data.token);
				localStorage.setItem('user', JSON.stringify(response.data.data.userProfile));

				// Set token expiration
				const expirationTime = Date.now() + 3600000;
				localStorage.setItem('tokenExpiration', expirationTime);
				localStorage.setItem('isLoggedIn', 'true');
				navigate('/dashboard');
			} else {
				console.error('Login failed: ', response.data.message);
			}
		} catch (error) {
			console.error('Error logging in:', error);
		}
	};
  	const onSuccess = async (response) => {
		const APP_API_URL = "http://localhost:7000";
		const userObject = jwtDecode(response.credential); // Decode JWT to extract user info
		console.log(userObject);
		const userData = {
			full_name: userObject.name,
			user_name: userObject.given_name,
			email_address: userObject.email,
			fcm_token: userObject.fcm_token,
			image_url: 	userObject.picture?userObject.picture : '',
			type: "user",
			mobile_number: '',
			password: ''
		}
		try {
			const response = await axios.post(`${APP_API_URL}/auth/user`, userData, {
				headers: {
					'Content-Type': 'application/json'
				},
			});
			console.log(response);
            const navigate = useNavigate(); // Hook for navigation

			if(response.data.status === true) {
				localStorage.setItem('token', response.data.token);
				localStorage.setItem('user', JSON.stringify(response.data.data.userProfile));

				// Set the token to expire in 1 hour (3600 seconds)
				const expirationTime = Date.now() + 3600000; // 1 hour from now
				localStorage.setItem('tokenExpiration', expirationTime);
				localStorage.setItem('isLoggedIn', 'true');
                navigate('/dashboard');
				//window.location.href = '/dashboard';
				//window.history.pushState({}, '', `/dashboard`);
    			//setPage('dashboard');
				//handleLogin();
				//setIsLoggedIn(true);
			}

		} catch (error) {
			console.error('Error sending data:', error);
		}
	};

	const onFailure = (response) => {
		console.error('Login failed: res:', response);
	};

	return (
		<>

			<div className={`modal fade ${isLogin ? "show d-block" : ""}`} id="modalLogin">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="flat-account bg-surface">
							<h3 className="title text-center">Log In</h3>
							<span className="close-modal icon-close2" onClick={handleLogin} />
							<form action="#" onSubmit={handleLoginSubmit}>
								<fieldset className="box-fieldset">
									<label htmlFor="name">Your Names<span>*</span>:</label>
									<input
										type="text"
										className="form-contact style-1"
										placeholder="Email Address"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</fieldset>
								<fieldset className="box-fieldset">
									<label htmlFor="pass">Password<span>*</span>:</label>
									<div className="box-password">
										<input
											type="password"
											className="form-contact style-1 password-field"
											placeholder="Password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
										/>
										<span className="show-pass">
											<i className="icon-pass icon-eye" />
											<i className="icon-pass icon-eye-off" />
										</span>
									</div>
								</fieldset>
								<div className="d-flex justify-content-between flex-wrap gap-12">
									<fieldset className="d-flex align-items-center gap-6">
										<input type="checkbox" className="tf-checkbox style-2" id="cb1" />
										<label htmlFor="cb1" className="caption-1 text-variant-1">Remember me</label>
									</fieldset>
									<Link href="#" className="caption-1 text-primary">Forgot password?</Link>
								</div>
								<div className="text-variant-1 auth-line">or sign up with</div>
								<div className="login-social">
									<Link href="#" className="btn-login-social">
										<img src="/images/logo/fb.jpg" alt="img" />
										Continue with Facebook
									</Link>
									<Link href="#" className="btn-login-social">
										<img src="/images/logo/google.jpg" alt="img" />
										Continue with Google
									</Link>
									<GoogleOAuthProvider clientId={clientId}>
										<GoogleLogin
											clientId={clientId}
											onSuccess={onSuccess}
											onFailure={onFailure}
											cookiePolicy={'single_host_origin'}
											className="btn-login-social"
											icon={false}  // Removes the default Google icon
											render={(renderProps) => (
												<button onClick={renderProps.onClick} disabled={renderProps.disabled} className="btn-login-social">
													<img src="/images/logo/google.jpg" alt="img" />
													Continue with Google
												</button>
											)}
										/>
									</GoogleOAuthProvider>
								</div>
								<button type="button"  onClick={googleLogin()} className="tf-btn primary w-100">Login Google</button>
								<button type="submit" className="tf-btn primary w-100">Login</button>
								<div className="mt-12 text-variant-1 text-center noti">Not registered yet?
									<a onClick={() => { handleLogin(); handleRegister() }} className="text-black fw-5">Sign Up</a>
								</div>
							</form>
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
