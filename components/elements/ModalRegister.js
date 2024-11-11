'use client'
import Link from "next/link"
import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { userType } from "../../components/common/functions";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function ModalRegister({ isRegister, handleRegister, handleLogin }) {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [sucessMessage, setSucessMessage] = useState(false);

    const validationSchema = Yup.object({
		user_name: Yup.string()
		  .required("User Name is required"),
        email_address: Yup.string()
		  .email("Invalid email address")
          .required("Please enter valid Email address is required"),
		mobile_number: Yup.string()
			.matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
			.required("Phone Number is required"),
        password: Yup.string()
          .required("Password is required"),
		confirmPassword: Yup.string()
		  .oneOf([Yup.ref('password'), null], 'Passwords must match') // Ensure password and confirm password match
		  .required('Confirm Password is required'),
		agreeToTerms: Yup.bool().oneOf([true], 'You must accept the terms and conditions'),
    });
	const handleSubmit = async (values, {resetForm}) => {
		const userData = {
			full_name: values.user_name, 
			user_name: values.user_name, 
			email_address: values.email_address, 
			fcm_token: '', 
			image_url: '', 
			type: "user", 
			user_login_type	: userType("NONE"),
			mobile_number: values.mobile_number, 
			password: values.password
		}
		
		const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/create-normal/user`, userData, {
			headers: {
			"Content-Type": "application/json",
			},
		});
		if(response.data.status === true) {
			setSucessMessage(true);
			setErrorMessage(response.data.message);
			resetForm();
		} 
		setErrorMessage(response.data.message);
    };
	const messageClass = (sucessMessage) ? "message success" : "message error";
	return (
		<>
			<div className={`modal fade ${isRegister ? "show d-block" : ""}`} id="modalRegister">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="flat-account bg-surface">
							<h3 className="title text-center">Register</h3>
							<span className="close-modal icon-close2" onClick={handleRegister} />
							{errorMessage && <div className={messageClass}>{errorMessage}</div>}
							
								<Formik
									initialValues={{ user_name: "", mobile_number: "", email_address: "", password: "", confirmPassword: "", agreeToTerms: false, subscribeNewsletter: false, }}
									validationSchema={validationSchema}
									onSubmit={handleSubmit}
									>
									{({ errors, touched, handleChange, handleBlur }) => (
										<Form>
											<fieldset className="box-fieldset">
												<label htmlFor="name">User Name<span>*</span>:</label>
												<Field type="text" id="user_name" name="user_name" className="form-control style-1" />
												<ErrorMessage name="user_name" component="div" className="error" />
											</fieldset>
											<fieldset className="box-fieldset">
												<label htmlFor="name">email address<span>*</span>:</label>
												<Field type="text" id="email_address" name="email_address" className="form-control style-1" />
												<ErrorMessage name="email_address" component="div" className="error" />
											</fieldset>
											<fieldset className="box-fieldset">
												<label htmlFor="name">Mobile Number<span>*</span>:</label>
												<Field type="text" id="mobile_number" name="mobile_number" className="form-control style-1" />
												<ErrorMessage name="mobile_number" component="div" className="error" />
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
													{showPassword ? <img src="/images/favicon/password-hide.png" /> : <img src="/images/favicon/password-show.png" /> }
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
													{showConfirmPassword ? <img src="/images/favicon/password-hide.png" /> : <img src="/images/favicon/password-show.png" />}
												</span>
												<ErrorMessage name="confirmPassword" component="div" className="error" />
											</fieldset>
											<fieldset className="box-fieldset">
												<label>
												<Field
													type="checkbox"
													name="agreeToTerms"
													className="tf-checkbox style-2 aggree-checkbox"
												/>
												I agree to the terms of use
												</label>
												<ErrorMessage name="agreeToTerms" component="div" className="error" />
											</fieldset>
											<fieldset className="box-fieldset">
												<label>
													<Field 
														type="checkbox" 
														name="subscribeNewsletter" 
														className="tf-checkbox style-2 aggree-checkbox"
													/>
													Subscribe to the newsletter
												</label>
												</fieldset>
											<div className="d-flex justify-content-between flex-wrap gap-12">
												<button type="submit" className="tf-btn primary w-100">Register</button>
											</div>
											<div className="mt-12 text-variant-1 text-center noti">Already have an account?
												<a onClick={() => { handleLogin(); handleRegister() }} className="text-black fw-5">Login Here</a>
											</div>
										</Form>
									)}
								</Formik>
						</div>
					</div>
				</div>
			</div>
			{isRegister &&
				<div className={`modal-backdrop fade show`} onClick={handleRegister} />
			}
		</>
	)
}
