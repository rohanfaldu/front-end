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

export default function ModalForgotPassword({ isLogin, isForgotPassword, handleForgotPassword }) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
 	const [user, setUser] = useState(null);
 	const [errorMessage, setErrorMessage] = useState('');
	const [sucessMessage, setSucessMessage] = useState(false);
 	const base_url = process.env.NEXT_PUBLIC_API_URL;
	
	/*****  Login *******/
	const [showPassword, setShowPassword] = useState(false);
    const validationSchema = Yup.object({
        email_address: Yup.string()
		  .email("Please enter valid Email address")
          .required("Please enter valid Email address"),
    });
	if(isLogin && isForgotPassword){
		const modalDiv = document.querySelector("#modalLogin");
		modalDiv.classList.remove("show"); 
		modalDiv.classList.remove("d-block"); 
	}
	const handleSubmit =async (values, {resetForm}) => {
		
			const sendData = {email_address: values.email_address}
			const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/check/user`, sendData, {
			  	headers: {
					"Content-Type": "application/json",
			  	},
			});
			if(response.data.status === true) {
				const sendMailData = {email_address: values.email_address, subject: "Password Reset Code"}
				const sendMailResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/agencies/sendmail`, sendMailData, {
					headers: {
					"Content-Type": "application/json",
					},
				});
				
				setErrorMessage(sendMailResponse.data.message);
				if(sendMailResponse.data.status === true) {
					setSucessMessage(true);	
					setTimeout(() => {
						const modalDiv1 = document.querySelector("#modalUpdatePassword");
						modalDiv1.classList.add("show"); 
						modalDiv1.classList.add("d-block"); 

						const modalDiv = document.querySelector("#modalLogin");
						modalDiv.classList.remove("show"); 
						modalDiv.classList.remove("d-block"); 

						const modalDiv2 = document.querySelector("#modalForgotPassword");
						modalDiv2.classList.remove("show"); 
						modalDiv2.classList.remove("d-block"); 

						
					}, 2000);
					resetForm();
				}
			} else {
				setErrorMessage(response.data.message);
			}
    };
	const messageClass = (sucessMessage) ? "message success" : "message error";
	return (
		<>
		
			<div className={`modal fade ${isForgotPassword ? "show d-block" : ""}`} id="modalForgotPassword">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="flat-account bg-surface">
							<h3 className="title text-center">Reset Password</h3>
							<span className="close-modal icon-close2" onClick={handleForgotPassword} />
							{errorMessage && <div className={messageClass}>{errorMessage}</div>}
								<Formik
									initialValues={{ email_address: "", password: "" }}
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

			{isForgotPassword &&
				<div className={`modal-backdrop fade show`} onClick={handleForgotPassword} />
			}

		</>
	)
}
