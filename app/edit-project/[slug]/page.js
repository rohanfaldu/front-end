'use client'
import PropertyMap from "@/components/elements/PropertyMap"
import LayoutAdmin from "@/components/layout/LayoutAdmin"
import Link from "next/link"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { userType } from "../../../components/common/functions";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import passwordShow from "../../../public/images/favicon/password-show.png";
import passwordHide from "../../../public/images/favicon/password-hide.png";
import { insertData, updateData } from "../../../components/api/Axios/Helper";
import Preloader from '@/components/elements/Preloader';
import PropertyMapMarker from "@/components/elements/PropertyMapMarker";
import { capitalizeFirstChar, validateYouTubeURL } from "../../../components/common/functions";
import { insertMultipleUploadImage } from "../../../components/common/imageUpload";
import "../../../components/errorPopup/ErrorPopup.css";
import ErrorPopup from "../../../components/errorPopup/ErrorPopup.js";

const resolveIdByName = (stateName, statesList) => {
    const state = statesList.find((state) => state.name === stateName);
    return state ? state.id : "";
};
export default function EditProject({ params }) {
    const { slug } = params;
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [sucessMessage, setSucessMessage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filePreview, setFilePreview] = useState(null);
    const [userDetail, setUserDetail] = useState(null);
    const [projectDetail, setProjectDetail] = useState(null);
    const [developerList, setDeveloperList] = useState([]);
    const [projectOfNumberListing, setProjectOfNumberListing] = useState([]);
    const [projectOfBooleanListing, setProjectOfBooleanListing] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});
    const [videoPreview, setVideoPreview] = useState(null);
    const [filePreviews, setFilePreviews] = useState([]);
    const [userId, setUserId] = useState("");
    const [propertyMapCoords, setPropertyMapCoords] = useState({
        latitude: 33.5945144,
        longitude: -7.6200284,
        zoom: 6
    });
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [isVideoUpload, setIsVideoUpload] = useState(true);
    const [neighborhoodList, setNeighborhoodList] = useState([]);
    const [iconPreview, setIconPreview] = useState([]);




    useEffect(() => {

        const fetchData = async () => {

            try {
                const requestData = {
                    project_slug: slug,
                };
                const getProjectInfo = await insertData('api/projects/getbyIds', requestData, true);


                if (getProjectInfo.data) {
                    setProjectDetail(getProjectInfo.data);
                } else {
                    setErrorMessage("Project not found.");
                }

                if (getProjectInfo.data.meta_details) {
                    const initialCheckedItems = getProjectInfo.data.meta_details.reduce((acc, meta) => {

                        if (meta.value === "true") {
                            acc[meta.key] = true;
                        }
                        return acc;
                    }, {});
                    setCheckedItems(initialCheckedItems);
                }
                if (getProjectInfo.data.picture) {
                    setFilePreviews(getProjectInfo.data.picture.map((url) => url));
                }
                if (getProjectInfo.data.icon) {
                    setIconPreview(getProjectInfo.data.icon);
                }

                if (getProjectInfo.data.video) {
                    const videoLink = getProjectInfo.data.video;
                    if (videoLink.toLowerCase().endsWith(".mp4")) {
                        setIsVideoUpload(true);
                        setVideoPreview(videoLink);
                    } else {
                        console.log(videoLink);
                        setIsVideoUpload(false);
                    }
                }
                if (stateList.length === 0) {
                    const stateObj = {};
                    const getStateInfo = await insertData('api/state', stateObj, true);

                    if (getStateInfo) {
                        setStateList(getStateInfo.data.states);
                    }

                }


                if (localStorage.getItem('isLoggedIn')) {
                    const userDetail = JSON.parse(localStorage.getItem('user'));
                    const capitalizedString = userDetail.id;
                    setUserId(capitalizedString)
                }


                if (projectOfNumberListing.length === 0 && projectOfBooleanListing.length === 0) {
                    const stateObj = {};
                    const getProjectListingInfo = await insertData('api/project-type-listings', stateObj, true);

                    if (getProjectListingInfo) {
                        const projectOfNumberType = getProjectListingInfo.data.list.filter(item => item.type === "number");
                        const projectOfBlooeanType = getProjectListingInfo.data.list.filter(item => item.type === "boolean");
                        setProjectOfNumberListing(projectOfNumberType);
                        setProjectOfBooleanListing(projectOfBlooeanType);
                    }
                }
                if (developerList.length === 0) {
                    const getUsersDeveloperInfo = await insertData('auth/get/developer', {}, false);
                    const developerList = getUsersDeveloperInfo.data.user_data;
                    if (developerList.length) {
                        setDeveloperList(developerList);
                    }
                }

                setLoading(false);
                setError(null);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const validationSchema = Yup.object({
        title_en: Yup.string().min(3, "Title must be at least 3 characters").required("Title is required"),
        title_fr: Yup.string().min(3, "Title must be at least 3 characters").required("Title is required"),
        description_en: Yup.string().required("Description is required"),
        description_fr: Yup.string().required("Description is required"),
        price: Yup.string().required("Price is required"),
        vr_link: Yup.string().url("Invalid VR URL").nullable(),
        picture_img: Yup.array().min(3, "At least three image is required").required("Image is required"),
        state_id: Yup.string().required("State is required"),
        city_id: Yup.string().required("City is required"),
        districts_id: Yup.string().required("District is required"),
        neighborhood_id: Yup.string().required("Neighborhood is required"),
    });
    const router = useRouter();

    const handleStateChange = async (stateId) => {
        const selectedState = stateList.find((state) => state.id === stateId);

        if (!selectedState) {
            console.error('State not found:', stateId);
            return;
        }

        const { latitude, longitude } = selectedState;
        setPropertyMapCoords({
            latitude: latitude,
            longitude: longitude
        });

        if (cityList.length === 0) {
            const cityObj = { state_id: stateId, lang: "en" };
            const getCityInfo = await insertData('api/city', cityObj, true);
            if (getCityInfo.status) {
                setCityList(getCityInfo.data.cities);
            } else {
                console.error('Failed to fetch cities');
            }
        }
    };


    const handleCityChange = async (cityId) => {
        const selectedCites = cityList.find((cities) => cities.id === cityId);
        const { latitude, longitude } = selectedCites;
        setPropertyMapCoords({
            latitude: latitude,
            longitude: longitude
        });

        if (!cityId) {
            setDistrictList([]);
            return;
        }
        try {
            const districtObj = { city_id: cityId, lang: "en" };
            const getDistrictInfo = await insertData('api/district', districtObj, true);
            if (getDistrictInfo.status) {
                setDistrictList(getDistrictInfo.data.districts);
            } else {
                setDistrictList([]);
            }
        } catch (error) {
            console.error("Error fetching cities:", error);
            setDistrictList([]);
        }
    };

    const handleDistrictChange = async (DistrictId) => {
        const selectedDistricts = districtList.find((districts) => districts.id === DistrictId);
        const { latitude, longitude } = selectedDistricts;
        setPropertyMapCoords({
            latitude: latitude,
            longitude: longitude
        });

        if (!DistrictId) {
            setNeighborhoodList([]);
            return;
        }
        try {
            const districtObj = { district_id: DistrictId, lang: "en" };
            const getNeighborhoodObjInfo = await insertData('api/neighborhood', districtObj, true);
            if (getNeighborhoodObjInfo.status) {
                setNeighborhoodList(getNeighborhoodObjInfo.data.neighborhoods);
            } else {
                setNeighborhoodList([]);
            }
        } catch (error) {

            setNeighborhoodList([]);
        }
    };
    const handleNeighborhoodChange = async (NeighborhoodId) => {

        const selecteNeighborhood = neighborhoodList.find((neighborhoods) => neighborhoods.id === NeighborhoodId);
        if (selecteNeighborhood) {
            const { latitude, longitude } = selecteNeighborhood;
            setPropertyMapCoords({
                latitude: latitude,
                longitude: longitude,
            });
        } else {
            console.error('Neighborhood not found');
        }
    };
    console.log(projectDetail);
    const handleSubmit = async (values, { resetForm, setErrors }) => {
        console.log(values);

        console.log(projectOfBooleanListing);


        const selectedAmenities = projectOfBooleanListing
            .filter((project) => checkedItems[project.key])
            .map((project) => ({ project_type_listing_id: project.id, value: "true" }));

        console.log("Selected Amenities:", selectedAmenities);

        try {


            const uploadImageObj = Array.isArray(values.picture_img) ? values.picture_img : [values.picture_img];
            const videoObj = values.video ? [values.video] : [];
            const iconObj = values.icon ? [values.icon] : [];


            const allUploadFiles = [...uploadImageObj, ...videoObj];
            const allUploadFilesICon = [...iconObj];
            console.log('uploadImageIconUrl');
            console.log(allUploadFiles);

            const hasFile = allUploadFiles.some((item) => item instanceof File);
            console.log("Contains a File:", hasFile);

            let uploadImageUrl = values.picture_img;
            let uploadImageIconUrl = [];
            if (hasFile) {
                const uploadImageUrlFIles = await insertMultipleUploadImage("image", allUploadFiles);
                uploadImageUrl = uploadImageUrlFIles.files;
                uploadImageIconUrl = await insertMultipleUploadImage("image", allUploadFilesICon);
            }


            if (uploadImageUrl.length > 0) {
                const imageUrls = [];
                let videoUrl = values.video;
                let iconUrl = values.icon;


                if (hasFile) {
                    uploadImageUrl.forEach((file) => {
                        if (file.mimeType.startsWith("image")) {
                            imageUrls.push(file.url);
                        } else if (file.mimeType.startsWith("video")) {
                            videoUrl = file.url;
                        }
                    });
                } else {
                    uploadImageUrl.forEach((file) => {
                        imageUrls.push(file);
                    })

                }

                if (uploadImageIconUrl?.files?.length > 0) {
                    iconUrl = uploadImageIconUrl.files[0].url;
                } else {
                    iconUrl = values.icon;
                }

                console.log("Project Data:", { imageUrls, videoUrl, iconUrl });

                if (!videoUrl) {
                    const isValid = validateYouTubeURL(values.video_link);
                    if (!isValid) {
                        setErrors({ serverError: "Please upload a Valid YouTube video link like https://www.youtube.com/watch?v=YOUR_VIDEO_ID." });
                        setShowErrorPopup(true);
                        return false;
                    }
                    videoUrl = values.video_link ?? null;
                }
                console.log('values');
                console.log(values);

                const projectData = {
                    project_id: values.project_id,
                    title_en: values.title_en,
                    title_fr: values.title_fr,
                    description_en: values.description_en,
                    description_fr: values.description_fr,
                    price: parseInt(values.price) ?? 0,
                    vr_link: values.vr_link,
                    picture: imageUrls,
                    icon: iconUrl,
                    video: videoUrl,
                    user_id: userId,
                    state_id: values.state_id,
                    city_id: values.city_id,
                    district_id: values.districts_id,
                    neighborhoods_id: values.neighborhood_id,
                    latitude: isNaN(parseFloat(values.latitude)) ? 20.2323 : parseFloat(values.latitude),
                    longitude: isNaN(parseFloat(values.longitude)) ? 20.2323 : parseFloat(values.longitude),
                    currency_id: values.currency_id,
                    meta_details: selectedAmenities,
                    address: values.address,
                };

                console.log("Project Datasssssss:", projectData);
                const createUserInfo = await updateData("api/projects/" + values.project_id, projectData, true);

                if (createUserInfo.status) {
                    setSucessMessage(true);
                    setErrors({ serverError: "Project created successfully." });
                    setShowErrorPopup(true);
                    resetForm();
                    router.push("/project-listing");
                } else {
                    setErrors({ serverError: createUserInfo.message || "Failed to create project." });
                    setShowErrorPopup(true);
                }
            } else {
                setErrors({ serverError: "File upload failed." });
                setShowErrorPopup(true);
            }
        } catch (error) {
            setErrors({ serverError: error.message || "An unexpected error occurred." });
            setShowErrorPopup(true);
        } finally {

        }


    };

    const handleCheckboxChange = (key) => {
        setCheckedItems((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };
    const messageClass = (sucessMessage) ? "message success" : "message error";

    return (
        <>
            {loading ?
                <><Preloader /></>
                :
                <LayoutAdmin>
                    {errorMessage && <div className={messageClass}>{errorMessage}</div>}
                    <Formik
                        initialValues={{
                            project_id: projectDetail.id,
                            title_en: projectDetail.title_en || "",
                            title_fr: projectDetail.title_fr || "",
                            description_en: projectDetail.description_en || "",
                            description_fr: projectDetail.description_fr || "",
                            price: projectDetail.price || 0,
                            vr_link: projectDetail.vr_link || "",
                            picture_img: projectDetail.picture || [],
                            icon: projectDetail.icon || null,
                            video: projectDetail.video || null,
                            video_link: projectDetail.video || null,
                            state_id: projectDetail.state || "",
                            city_id: projectDetail.city || "",
                            districts_id: projectDetail.district || "",
                            neighborhood_id: projectDetail.neighborhood || ""
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, handleChange, handleBlur, setFieldValue, values }) => (
                            <Form>
                                <div>
                                    <div className="widget-box-2">
                                        <h6 className="title">Project Information</h6>
                                        <div className="box grid-2 gap-30">

                                            <fieldset className="box box-fieldset">
                                                <label htmlFor="title">Title English:<span>*</span></label>
                                                <Field type="text" id="title_en" name="title_en" className="form-control style-1" />

                                            </fieldset>
                                            <fieldset className="box box-fieldset">
                                                <label htmlFor="title">Title French:<span>*</span></label>
                                                <Field type="text" id="title_fr" name="title_fr" className="form-control style-1" />

                                            </fieldset>
                                        </div>
                                        <div className="grid-1 box gap-30">
                                            <fieldset className="box-fieldset">
                                                <label htmlFor="description">Description English:<span>*</span></label>
                                                <Field type="textarea" as="textarea" id="description_en" name="description_en" className="textarea-tinymce" />

                                            </fieldset>
                                        </div>
                                        <div className="grid-1 box gap-30">
                                            <fieldset className="box-fieldset">
                                                <label htmlFor="description">Description French:<span>*</span></label>
                                                <Field type="textarea" as="textarea" id="description_fr" name="description_fr" className="textarea-tinymce" />

                                            </fieldset>
                                        </div>
                                    </div>
                                    <div className="widget-box-2">
                                        <h6 className="title">Other Information</h6>
                                        <div className="box grid-3 gap-30">
                                            <fieldset className="box box-fieldset">
                                                <label htmlFor="desc">Price:<span>*</span></label>
                                                <Field type="number" id="price" name="price" className="box-fieldset" />
                                                <ErrorMessage name="price" component="div" className="error" />
                                            </fieldset>
                                            <fieldset className="box box-fieldset">
                                                <label htmlFor="desc">VR Link:</label>
                                                <Field type="text" name="vr_link" className="box-fieldset" />
                                            </fieldset>

                                        </div>
                                        <div className="box grid-3 gap-30">

                                        </div>
                                        <div className="grid-2 box gap-30">
                                            <fieldset className="box-fieldset">
                                                <label htmlFor="picture_img">Picture Images:</label>
                                                <Field
                                                    name="picture_img"
                                                    component={({ field, form }) => (
                                                        <div className="box-floor-img uploadfile">

                                                            <div className="btn-upload">
                                                                <label className="tf-btn primary">
                                                                    Choose Files
                                                                    <input
                                                                        type="file"
                                                                        multiple
                                                                        className="ip-file"
                                                                        onChange={(event) => {
                                                                            let imageList = [];
                                                                            const files = Array.from(event.target.files);
                                                                            const validPreviews = [];
                                                                            files.forEach((file) => {

                                                                                const img = new Image();
                                                                                const reader = new FileReader();
                                                                                reader.onload = (e) => {
                                                                                    img.src = e.target.result;


                                                                                    img.onload = () => {
                                                                                        const imageHeight = img.height;
                                                                                        const imageWidth = img.width;

                                                                                        if (imageHeight <= 800 || imageWidth <= 1100) {
                                                                                            alert('Please upload images with a maximum height of 800px and a maximum width of 1100px.');
                                                                                        } else {

                                                                                            validPreviews.push(URL.createObjectURL(file));
                                                                                            imageList.push(file);
                                                                                        }
                                                                                        console.log(validPreviews);

                                                                                        setFilePreviews(validPreviews);
                                                                                        setFieldValue(field.name, imageList);
                                                                                    };
                                                                                };


                                                                                reader.readAsDataURL(file);

                                                                            });
                                                                        }}
                                                                        style={{ display: "none" }}
                                                                    />
                                                                </label>
                                                            </div>

                                                            <p className="file-name fw-5">Or drop images here to upload</p>
                                                        </div>
                                                    )}
                                                />
                                            </fieldset>



                                            <fieldset className="box-fieldset">

                                                <div className="image-preview-container image-gallery">
                                                    {filePreviews.length > 0 && (<p className="fw-5">Image Preview:</p>)}
                                                    {filePreviews.map((preview, index) => (
                                                        <div key={index} className="preview-item">
                                                            <img
                                                                src={preview}
                                                                alt={`Preview ${index + 1}`}
                                                                className="uploadFileImage"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newFilePreviews = filePreviews.filter((_, i) => i !== index);
                                                                    const newImageList = values.picture_img.filter((_, i) => i !== index);
                                                                    setFilePreviews(newFilePreviews);
                                                                    setFieldValue("picture_img", newImageList);
                                                                }}
                                                                className="remove-image-btn"
                                                            >
                                                                &times;
                                                            </button>

                                                        </div>
                                                    ))}
                                                </div>
                                            </fieldset>
                                        </div>
                                        <div className="grid-2 box gap-30">
                                            <fieldset className="box-fieldset">
                                                <label htmlFor="picture_img">Icon Images:</label>
                                                <Field
                                                    name="icon"
                                                    component={({ field, form }) => (
                                                        <div className="box-floor-img uploadfile">

                                                            <div className="btn-upload">
                                                                <label className="tf-btn primary">
                                                                    Choose Files
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        className="ip-file"
                                                                        onChange={(event) => {
                                                                            const file = event.target.files[0];
                                                                            if (file) {

                                                                                if (file.size < 1000) {
                                                                                    alert(`Please upload a file above the size of 1KB`);
                                                                                    return;
                                                                                }

                                                                                const img = new Image();
                                                                                const reader = new FileReader();

                                                                                reader.onload = (e) => {
                                                                                    img.src = e.target.result;

                                                                                    img.onload = () => {
                                                                                        const imageHeight = img.height;
                                                                                        const imageWidth = img.width;


                                                                                        if (imageHeight > 200 || imageWidth > 200) {
                                                                                            alert(
                                                                                                "Please upload an image with a maximum height and width of 200px."
                                                                                            );
                                                                                        } else {
                                                                                            setFieldValue("icon", file);
                                                                                            setIconPreview(URL.createObjectURL(file));
                                                                                        }
                                                                                    };
                                                                                };

                                                                                reader.readAsDataURL(file);
                                                                            }
                                                                        }}
                                                                        style={{ display: "none" }}
                                                                    />
                                                                </label>
                                                            </div>
                                                            <p className="file-name fw-5">Or drop images here to upload</p>
                                                        </div>
                                                    )}
                                                />
                                            </fieldset>
                                            <fieldset className="box-fieldset">

                                                <div className="image-preview-container image-gallery">
                                                    {iconPreview && (
                                                        <div className="preview-item">
                                                            <img
                                                                src={iconPreview}
                                                                alt="Icon Preview"
                                                                className="uploadFileImage"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setIconPreview(null);
                                                                    setFieldValue("icon", null);
                                                                }}
                                                                className="remove-image-btn"
                                                            >
                                                                &times;
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </fieldset>

                                        </div>
                                        <div className="box grid-1 box gap-50">
                                            <fieldset className="box-fieldset">
                                                <label htmlFor="picture_img">Video Option:</label>

                                                <div>
                                                    <fieldset className="fieldset-radio">
                                                        <input
                                                            type="radio"
                                                            className="tf-radio video-upload"
                                                            value="upload"
                                                            name="videoOption"
                                                            onChange={() => {
                                                                setIsVideoUpload(true);
                                                                setFieldValue("video", null);
                                                            }}
                                                            checked={isVideoUpload}
                                                        />
                                                        <label htmlFor="upload" className="text-radio">Upload Video</label>

                                                        <input
                                                            type="radio"
                                                            className="tf-radio video-upload"
                                                            name="videoOption"
                                                            value="link"
                                                            onChange={() => {
                                                                setIsVideoUpload(false);
                                                                setFieldValue("video_link", "");
                                                            }}
                                                            checked={!isVideoUpload}
                                                        />
                                                        <label htmlFor="videoOption" className="text-radio"> YouTube Link</label>
                                                    </fieldset>
                                                </div>


                                                {isVideoUpload ? (

                                                    <div className="box-floor-img uploadfile">
                                                        <div className="btn-upload">
                                                            <label className="tf-btn primary">
                                                                Choose File
                                                                <input
                                                                    type="file"
                                                                    accept="video/mp4"
                                                                    className="ip-file"
                                                                    onChange={(event) => {
                                                                        const file = event.target.files[0];
                                                                        if (file) {
                                                                            setFieldValue("video", file);
                                                                            setVideoPreview(URL.createObjectURL(file));
                                                                        }
                                                                    }}
                                                                    style={{ display: "none" }}
                                                                />
                                                            </label>
                                                        </div>
                                                        {videoPreview && (
                                                            <video controls className="uploadFileImage">
                                                                <source src={videoPreview} type="video/mp4" />
                                                                Your browser does not support the video tag.
                                                            </video>
                                                        )}
                                                        <p className="file-name fw-5">Or drop video here to upload</p>

                                                    </div>
                                                ) : (

                                                    <div>
                                                        <label htmlFor="video_link">YouTube Link:</label>
                                                        <Field
                                                            type="text"
                                                            name="video_link"
                                                            className="form-control"
                                                            placeholder="https://www.youtube.com/watch?v=QgAQcrvHsHQ"
                                                        />

                                                    </div>
                                                )}
                                            </fieldset>

                                        </div>
                                    </div>
                                    <div className="widget-box-2">
                                        <h6 className="title">Location</h6>
                                        <div className="box grid-4 gap-30">
                                            <fieldset className="box box-fieldset">
                                                <label htmlFor="desc">State:</label>
                                                <Field
                                                    as="select"
                                                    name="state_id"
                                                    className="nice-select country-code"
                                                    value={projectDetail.state.id || values.state_id}
                                                    onChange={(e) => {
                                                        const selectedStateId = e.target.value;
                                                        setFieldValue("state_id", selectedStateId);
                                                        handleStateChange(selectedStateId);
                                                    }}
                                                >
                                                    <option value="">Select State</option>
                                                    {stateList.length > 0 ? (
                                                        stateList.map((state) => (
                                                            <option key={state.id} value={state.id}>
                                                                {state.name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <></>
                                                    )}
                                                </Field>
                                            </fieldset>
                                            <fieldset className="box box-fieldset">
                                                <label htmlFor="desc">Cities:</label>
                                                <Field
                                                    as="select"
                                                    name="city_id"
                                                    className="nice-select country-code"
                                                    onChange={(e) => {
                                                        const selectedCity = e.target.value;
                                                        setFieldValue("city_id", selectedCity);
                                                        handleCityChange(selectedCity);
                                                    }}
                                                    value={projectDetail.city.id || values.city_id}
                                                >
                                                    <option value="">Select Cities</option>
                                                    {cityList && cityList.length > 0 ? (
                                                        cityList.map((cities) => (
                                                            <option key={cities.id} value={cities.id}>
                                                                {cities.city_name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        projectDetail?.city?.id && (
                                                            <option value={projectDetail.city.id}>
                                                                {projectDetail.city.name}
                                                            </option>
                                                        )
                                                    )}
                                                </Field>
                                            </fieldset>

                                            <fieldset className="box box-fieldset">
                                                <label htmlFor="desc">District:</label>
                                                <Field
                                                    as="select"
                                                    name="districts_id"
                                                    className="nice-select country-code"
                                                    onChange={(e) => {
                                                        const selectedDistrict = e.target.value;
                                                        setFieldValue("districts_id", selectedDistrict);
                                                        handleDistrictChange(selectedDistrict);
                                                    }}
                                                    value={projectDetail.district.id || values.districts_id || ""}
                                                >
                                                    <option value="">Select District</option>
                                                    {districtList && districtList.length > 0 ? (
                                                        districtList.map((districts) => (
                                                            <option key={districts.id} value={districts.id}>
                                                                {districts.district_name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        projectDetail?.district?.id && (
                                                            <option value={projectDetail.district.id}>
                                                                {projectDetail.district.name}
                                                            </option>
                                                        )
                                                    )}
                                                </Field>
                                            </fieldset>

                                            <fieldset className="box box-fieldset">
                                                <label htmlFor="desc">Neighborhood:</label>
                                                <Field
                                                    as="select"
                                                    name="neighborhood_id"
                                                    className="nice-select country-code"
                                                    onChange={(e) => {
                                                        const selectedNeighborhood = e.target.value;
                                                        setFieldValue("neighborhood_id", selectedNeighborhood);
                                                        handleNeighborhoodChange(selectedNeighborhood);
                                                    }}
                                                    value={projectDetail.neighborhood.id || values.neighborhood_id || ""}
                                                >
                                                    <option value="">Select Neighborhood</option>
                                                    {neighborhoodList && neighborhoodList.length > 0 ? (
                                                        neighborhoodList.map((neighborhoods) => (
                                                            <option key={neighborhoods.id} value={neighborhoods.id}>
                                                                {neighborhoods.neighborhood_name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        projectDetail?.neighborhood?.id && (
                                                            <option value={projectDetail.neighborhood.id}>
                                                                {projectDetail.neighborhood.name}
                                                            </option>
                                                        )
                                                    )}
                                                </Field>
                                            </fieldset>

                                        </div>
                                        <div className="box box-fieldset">
                                            <PropertyMapMarker
                                                latitude={propertyMapCoords.latitude}
                                                longitude={propertyMapCoords.longitude}
                                                zoom={propertyMapCoords.zoom}
                                                address={projectDetail?.address}
                                                onPlaceSelected={(newAddress, newLocation) => {
                                                    console.log('newAddress', newAddress);
                                                    setFieldValue('address', newAddress);
                                                    setFieldValue('latitude', newLocation.lat);
                                                    setFieldValue('longitude', newLocation.lng);

                                                }
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="widget-box-2">
                                        <h6 className="title">Amenities </h6>
                                        <div className="box-amenities-property">
                                            <div className="box-amenities">
                                                {projectOfBooleanListing && projectOfBooleanListing.length > 0 ? (
                                                    projectOfBooleanListing.map((project) => (
                                                        <fieldset className="amenities-item">
                                                            <Field
                                                                type="checkbox" name={project.id}
                                                                className="tf-checkbox style-1 primary"
                                                                checked={!!checkedItems[project.key]}
                                                                onChange={() => handleCheckboxChange(project.key)}
                                                            />
                                                            <label for="cb1" className="text-cb-amenities">{project.name}</label>

                                                        </fieldset>
                                                    ))
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" className="tf-btn primary" >Update Project</button>
                                </div >
                                {showErrorPopup && Object.keys(errors).length > 0 && (
                                    <ErrorPopup
                                        errors={errors}
                                        validationSchema={validationSchema}
                                        onClose={() => setShowErrorPopup(false)}
                                    />
                                )}
                            </Form>
                        )}
                    </Formik>


                </LayoutAdmin >
            }
        </>
    )
}