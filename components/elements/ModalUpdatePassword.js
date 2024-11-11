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

export default function ModalUpdatePassword({isUpdatePassword, handleUpdatePassword }) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
 	const [user, setUser] = useState(null);
 	const [errorMessage, setErrorMessage] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [sucessMessage, setSucessMessage] = useState(false);
 	const base_url = process.env.NEXT_PUBLIC_API_URL;
	
	/*****  Login *******/
	const [showPassword, setShowPassword] = useState(false);
    const validationSchema = Yup.object({
        email_address: Yup.string()
		  .email("Please enter valid Email address")
          .required("Please enter valid Email address"),
        otp: Yup.string()
          .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
          .required("OTP is required"),
        password: Yup.string()
            .required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match') // Ensure password and confirm password match
            .required('Confirm Password is required'),
    });
	// if(isLogin && isForgotPassword){
	// 	const modalDiv = document.querySelector("#modalLogin");
	// 	modalDiv.classList.remove("show"); 
	// 	modalDiv.classList.remove("d-block"); 
	// }
	const handleSubmit =async (values, {resetForm}) => {
		
			const sendData = {email_address: values.email_address, code: Number(values.otp), password: values.password}
			const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/updatepassword`, sendData, {
			  	headers: {
					"Content-Type": "application/json",
			  	},
			});
			if(response.data.status === true) {
				
				setErrorMessage(response.data.message);
				//if(response.data.status === true) {
					setSucessMessage(true);	
					resetForm();
				//}
			} else {
				setErrorMessage(response.data.message);
			}
    };
	const messageClass = (sucessMessage) ? "message success" : "message error";
	return (
		<>
		
			<div className={`modal fade ${isUpdatePassword ? "show d-block" : ""}`} id="modalUpdatePassword">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="flat-account bg-surface">
							<h3 className="title text-center">Update Password</h3>
							<span className="close-modal icon-close2" onClick={handleUpdatePassword} />
							{errorMessage && <div className={messageClass}>{errorMessage}</div>}
								<Formik
									initialValues={{ email_address: "", password: "", otp: "", confirmPassword: "" }}
									validationSchema={validationSchema}
									onSubmit={handleSubmit}
									>
									{({ errors, touched, handleChange, handleBlur }) => (
										<Form>
											<fieldset className="box-fieldset">
												<label htmlFor="name">Email Address<span>*</span>:</label>
												<Field type="text" id="email_address" name="email_address" className="form-control style-1" />
												<ErrorMessage name="email_address" component="div" className="error" />
											</fieldset>
                                            <fieldset className="box-fieldset">
												<label htmlFor="otp">OTP<span>*</span>:</label>
												<Field type="text" id="otp" name="otp" className="form-control style-1" />
												<ErrorMessage name="otp" component="div" className="error" />
											</fieldset>
											<fieldset className="box-fieldset">
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
											</fieldset>
											<fieldset className="box-fieldset">
												<label htmlFor="confirmPassword">Confirm Password<span>*</span>:</label>
												<Field
													type={showConfirmPassword ? 'text' : 'password'}
													id="confirmPassword"
													name="confirmPassword"
													onChange={handleChange}
													onBlur={handleBlur}
													className="form-control style-1"
												/>
												<span
													onClick={() => setShowConfirmPassword((prev) => !prev)} className="show-password confirm-password" 
												>
													{showConfirmPassword ? <img src="/images/favicon/password-show.png" /> : <img src="/images/favicon/password-hide.png" />}
												</span>
												<ErrorMessage name="confirmPassword" component="div" className="error" />
											</fieldset>
											<div className="d-flex justify-content-between flex-wrap gap-12">
												<button type="submit" className="tf-btn primary w-100">Forgot Password</button>
											</div>
										</Form>
									)}
								</Formik>
								
						</div>
					</div>
				</div>
			</div>

			{isUpdatePassword &&
				<div className={`modal-backdrop fade show`} onClick={handleUpdatePassword} />
			}

		</>
	)
}
