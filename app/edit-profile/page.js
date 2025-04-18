'use client'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { use, useState, useEffect } from "react"
import CountetNumber from "@/components/elements/CountetNumber"
import DashboardChart from "@/components/elements/DashboardChart"
import DeleteFile from "@/components/elements/DeleteFile"
import LayoutAdmin from "@/components/layout/LayoutAdmin"
import Link from "next/link";
import { insertData, deletedData } from "../../components/api/Axios/Helper";
import Preloader from "@/components/elements/Preloader";
import ViewIcon from "../../public/images/favicon/view.png";

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useRouter } from 'next/navigation';
import ErrorPopup from "../../components/error-popup/ErrorPopup.js";

import * as Yup from 'yup';
export default function LikedProperty() {
    const [properties, setProperties] = useState([]); // Store properties for the current page
    const [loading, setLoading] = useState(true); // Manage loading state
    const [error, setError] = useState(null); // Manage error state
    const [searchTerm, setSearchTerm] = useState(''); // Store search input
    const [statusFilter, setStatusFilter] = useState(''); // Store selected status filter
    const [showPassword, setShowPassword] = useState(false);
    const [showOldPassword, setshowOldPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const router = useRouter();
    const [pagination, setPagination] = useState({
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 5,
    }); // Track pagination info
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const fetchProperties = async (page = variablesList.currentPage, term = '', status = '') => {
        setLoading(true);
        try {
            const requestData = {
                page,
                limit: pagination.itemsPerPage,
                lang: "en",
                title: "",
                description: "",
            };

            const response = await insertData("api/property/get-liked-property", requestData, true);
            console.log(response);
            if (response.status) {

                const { list, totalCount, totalPages, currentPage } = response.data;
                setProperties(list);
                setPagination({
                    ...pagination,
                    totalCount,
                    totalPages,
                    currentPage,
                });
                setError(null);
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties(pagination.currentPage, searchTerm, statusFilter);
    }, [pagination.currentPage, searchTerm, statusFilter]);



    const validationSchema = Yup.object().shape({
        oldPassword: Yup.string()
            .required('Old Password does not match'),
        password: Yup.string().required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });
    const handleSubmit = async (values, { setSubmitting }) => {
        console.log('Form Submitted with values:', values); 
        setLoading(true);

        try {
            const response = await insertData(`auth/updatepasswordwithoutotp`, {
                password: values.password,
                old_password: values.oldPassword
            }, true);
            console.log("responseeeee", response)
            if (response.status === true) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('tokenExpiration');
                localStorage.removeItem('isLoggedIn');
                router.push('/');
            } else {
                
            }
        } catch (error) {
            console.error('Error updating password:', error);
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <>
            {loading && <Preloader />}
            <LayoutAdmin>
                <Formik
                    initialValues={{ oldPassword: '', password: '', confirmPassword: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="wrap-dashboard-content">
                            <div className="widget-box-2 wd-listing" style={{ width: "50%" }}>
                                <div className="top d-flex justify-content-between align-items-center">
                                    <h6 className="title">Change Password</h6>
                                </div>

                                {/* old_password Field */}
                                <fieldset className="box-fieldset">
                                    <label htmlFor="oldPassword">
                                        Old Password<span>*</span>:
                                    </label>
                                    <div style={{ position: 'relative', width: '100%' }}>
                                        <Field
                                            type={showOldPassword ? 'text' : 'password'}
                                            id="oldPassword"
                                            name="oldPassword"
                                            style={{ width: '100%', paddingRight: '2.5rem' }}
                                        />
                                        <span
                                            onClick={() => setshowOldPassword((prev) => !prev)}
                                            className="show-password old-password"
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-83%)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <img
                                                src={
                                                    showOldPassword
                                                        ? '/images/favicon/password-show.png'
                                                        : '/images/favicon/password-hide.png'
                                                }
                                                alt="toggle password"
                                            />
                                        </span>
                                    </div>
                                    <ErrorMessage name="oldPassword" component="div" className="error" />
                                </fieldset>

                                {/* Password Field */}
                                <fieldset className="box-fieldset">
                                    <label htmlFor="password">
                                        Password<span>*</span>:
                                    </label>
                                    <div style={{ position: 'relative', width: '100%' }}>
                                        <Field
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            style={{ width: '100%', paddingRight: '2.5rem' }}
                                        />
                                        <span
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="show-password"
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-83%)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <img
                                                src={
                                                    showPassword
                                                        ? '/images/favicon/password-show.png'
                                                        : '/images/favicon/password-hide.png'
                                                }
                                                alt="toggle password"
                                            />
                                        </span>
                                    </div>
                                    <ErrorMessage name="password" component="div" className="error" />
                                </fieldset>


                                {/* Confirm Password Field */}
                                <fieldset className="box-fieldset">
                                    <label htmlFor="confirmPassword">
                                        Confirm Password<span>*</span>:
                                    </label>
                                    <div style={{ position: 'relative', width: '100%' }}>
                                        <Field
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            style={{ width: '100%', paddingRight: '2.5rem' }}
                                        />
                                        <span
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            className="show-password confirm-password"
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-83%)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <img
                                                src={
                                                    showConfirmPassword
                                                        ? '/images/favicon/password-show.png'
                                                        : '/images/favicon/password-hide.png'
                                                }
                                                alt="toggle password"
                                            />
                                        </span>
                                    </div>
                                    <ErrorMessage name="confirmPassword" component="div" className="error" />
                                </fieldset>

                                {/* Submit Button */}
                                <div className="d-flex justify-content-between flex-wrap gap-12" style={{ marginTop: '2rem' }}>
                                    <button
                                        type="submit"
                                        className="tf-btn primary w-100"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </LayoutAdmin>
        </>
    );
}	