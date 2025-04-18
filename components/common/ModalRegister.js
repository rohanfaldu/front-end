'use client'
import Link from "next/link"
import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { userType } from "./Functions.js";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { allCountries } from "country-telephone-data"; 
import { insertData } from "../api/Axios/Helper.js";
import { useTranslation } from "react-i18next";
export default function ModalRegister({ isRegister, handleRegister, handleLogin }) {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [sucessMessage, setSucessMessage] = useState(false);
	const [selectedCode, setSelectedCode] = useState("");
	const { t, i18n } = useTranslation();
    const validationSchema = Yup.object({
		user_name: Yup.string()
		  .required("User Name is required"),
        email_address: Yup.string()
		  .email("Invalid email address")
          .required("Please enter valid Email address is required"),
        password: Yup.string()
          .required("Password is required"),
		confirmPassword: Yup.string()
		  .oneOf([Yup.ref('password'), null], 'Passwords must match') // Ensure password and confirm password match
		  .required('Confirm Password is required'),
		agreeToTerms: Yup.bool().oneOf([true], 'You must accept the terms and conditions'),
    });
	const handleSubmit = async (values, {resetForm}) => {
		// console.log(values);
		const userData = {
			full_name: values.user_name??null, 
			user_name: values.user_name??null, 
			email_address: values.email_address??null, 
			fcm_token: null, 
			image_url: null, 
			type: "user", 
			country_code: values.country_code,
			user_login_type	: userType("NONE"),
			phone_number: values.mobile_number.toString(),
			password: values.password??null,
            user_id: null,
			social_id: null,
			device_type:"web"
		}

        const checkData = {
			email_address: values.email_address, 
			// phone_number: parseInt(values.mobile_number,10)
		}
		const getUserInfo = await insertData('auth/check/user', checkData);
        if(getUserInfo.status === false) {
            const createUserInfo = await insertData('auth/create/user', userData);
            if(createUserInfo.status === true) {
            	setSucessMessage(true);
            	setErrorMessage(createUserInfo.message);
            	resetForm();
				handleLogin();
				handleRegister();
            } 
            setErrorMessage(createUserInfo.message);   
        }else{
            setErrorMessage(getUserInfo.message);
        }
    };
	const messageClass = (sucessMessage) ? "message success" : "message error";
	return (
		<>
			<div className={`modal fade ${isRegister ? "show d-block" : ""}`} id="modalRegister">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="flat-account bg-surface">
							<h3 className="title text-center">{t("register")}</h3>
							<span className="close-modal icon-close2" onClick={handleRegister} />
							{errorMessage && <div className={messageClass}>{errorMessage}</div>}
							
								<Formik
									initialValues={{ country_code: "+33", user_name: "", mobile_number: "", email_address: "", password: "", confirmPassword: "", agreeToTerms: false, subscribeNewsletter: false, }}
									validationSchema={validationSchema}
									onSubmit={handleSubmit}
									>
									{({ errors, touched, handleChange, handleBlur, setFieldValue }) => (
										<Form>
											<fieldset className="box-fieldset">
												<label htmlFor="name">{t("userName")}<span>*</span>:</label>
												<Field type="text" id="user_name" name="user_name" className="form-control style-1" />
												<ErrorMessage name="user_name" component="div" className="error" />
											</fieldset>
											<fieldset className="box-fieldset">
												<label htmlFor="name">{t("emailAddress")}<span>*</span>:</label>
												<Field type="text" id="email_address" name="email_address" className="form-control style-1" />
												<ErrorMessage name="email_address" component="div" className="error" />
											</fieldset>
											<fieldset className="box-fieldset ">
												<label htmlFor="name">{t("mobilenumber")}<span>*</span>:</label>
													{/* <div className="phone-and-country-code">
														<Field as="select" name="country_code" className="nice-select country-code"
															id="country-code"
															value={selectedCode}
															onChange={(e) => {
																const selectedState = e.target.value;
																setSelectedCode(selectedState);
																setFieldValue("country_code", selectedState);
																//handleCityChange(selectedState);
															}}
														>
															<option value="">{t("selectCountry")}</option>
															{allCountries && allCountries.length > 0 ? (
																allCountries
																.sort((a, b) => a.dialCode.localeCompare(b.dialCode)) // Sort alphabetically by country name
																.map((country, index) =>(
																	<option key={index} value={`+${country.dialCode}`}>{country.name} (+{country.dialCode})
																	</option>
																))
															) : (
																<></>
															)}
														</Field>
														<Field type="text" id="mobile_number" name="mobile_number" className="form-control style-1" />
													</div> */}


													<div className="phone-and-country-code">
                                                            <select
                                                                name="country_code"
                                                                className="nice-select country-code"
                                                                id="country-code"
                                                                value={selectedCode || "+33"} // Default to +33
                                                                onChange={(e) => {
                                                                    const selectedState = e.target.value;
                                                                    setSelectedCode(selectedState);
																    setFieldValue("country_code", selectedState);
                                                                }}
                                                            >
                                                                {/* Default selected option: Show only the country code */}
                                                                <option value={selectedCode || "+33"}>
                                                                    {selectedCode || "+33"}
                                                                </option>

                                                                {/* Dropdown options: Show country name and code */}
                                                                {allCountries &&
                                                                    allCountries.length > 0 &&
                                                                    allCountries
                                                                        .filter((country) => country.name !== "Western Sahara") // Exclude Western Sahara
                                                                        .sort((a, b) => a.dialCode.localeCompare(b.dialCode)) // Sort by dial code
                                                                        .map((country, index) => (
                                                                            <option key={index} value={`+${country.dialCode}`}>
                                                                                {country.name} (+{country.dialCode})
                                                                            </option>
                                                                        ))}
                                                            </select>
                                                        <Field type="text" id="mobile_number" name="mobile_number" className="form-control style-1" />
                                                    </div>
												<ErrorMessage name="mobile_number" component="div" className="error" />
												<ErrorMessage name="country_code" component="div" className="error" />
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
													{showPassword ? <img src="/images/favicon/password-hide.png" /> : <img src="/images/favicon/password-show.png" /> }
												</span>
												<ErrorMessage name="password" component="div" className="error" />
											</fieldset>
											<fieldset className="box-fieldset">
												<label htmlFor="confirmPassword">{t("confirmPassword")}<span>*</span>:</label>
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
												{t("signUpAgree")}
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
													{t("subscribe")}
												</label>
												</fieldset>
											<div className="d-flex justify-content-between flex-wrap gap-12">
												<button type="submit" className="tf-btn primary w-100">{t("register")}</button>
											</div>
											<div className="mt-12 text-variant-1 text-center noti">{t("donhaveanaccount")}
												<a onClick={() => { handleLogin(); handleRegister() }} className="text-black fw-5">{t("loginhere")}</a>
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
