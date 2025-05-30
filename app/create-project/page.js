'use client'
import PropertyMap from "@/components/elements/PropertyMap"
import LayoutAdmin from "@/components/layout/LayoutAdmin"
import Link from "next/link"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { userType } from "../../components/common/Functions";
import { use, useState, useEffect } from "react"
import { useRouter } from 'next/navigation';
import passwordShow from "../../public/images/favicon/password-show.png";
import passwordHide from "../../public/images/favicon/password-hide.png";
import { insertData, insertImageData } from "../../components/api/Axios/Helper";
import { insertMultipleUploadImage } from "../../components/common/ImageUpload";
import { capitalizeFirstChar, validateYouTubeURL } from "../../components/common/Functions";
import PropertyMapMarker from "@/components/elements/PropertyMapMarker";
import ErrorPopup from "../../components/error-popup/ErrorPopup.js";
import Preloader from "@/components/elements/Preloader";
import SuccessPopup from "@/components/success-popup/SuccessPopup";
export default function CreateProject() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [sucessMessage, setSucessMessage] = useState(false);
    const [filePreview, setFilePreview] = useState(null);
    const [filePictureImg, setFilePictureImg] = useState(null);
    const [fileCoverImg, setFileCoverImg] = useState(null);
    const [uploadImage, setUploadImage] = useState(null);
    const [userId, setUserId] = useState("");
    const [neighborhoodList, setNeighborhoodList] = useState([]);
    const [uploadFile, setUploadFile] = useState(null);
    const [filePreviews, setFilePreviews] = useState([]);
    const [isVideoUpload, setIsVideoUpload] = useState(true);
    const [stateList, setStateList] = useState([]);
    const [developerList, setDeveloperList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [projectOfNumberListing, setProjectOfNumberListing] = useState([]);
    const [projectOfBooleanListing, setProjectOfBooleanListing] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});
    const [videoPreview, setVideoPreview] = useState(null); // State for video preview
    const [iconPreview, setIconPreview] = useState([]);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [currencyList, setCurrencyList] = useState([]);
    const [currencyCode, setCurrencyCode] = useState([]);
    const [propertyOfMetaNumberValue, setPropertyOfMetaNumberValue] = useState([]);
    const router = useRouter();
    const [propertyMapCoords, setPropertyMapCoords] = useState({
        latitude: 33.5945144,
        longitude: -7.6200284,
        zoom: 6
    });
    const validationSchema = Yup.object({
        title_en: Yup.string().min(3, "Title must be at least 3 characters").required("Title is required"),
        title_fr: Yup.string().min(3, "Title must be at least 3 characters").required("Title is required"),
        description_en: Yup.string().required("Description is required"),
        description_fr: Yup.string().required("Description is required"),
        price: Yup.string().required("Price is required"),
        currency_id: Yup.string().required("Currency is required"),
        vr_link: Yup.string().url("Invalid VR URL").nullable(),
        picture_img: Yup.array().min(1, "At one three image is required").required("Image is required"),
        state_id: Yup.string().required("State is required"),
        city_id: Yup.string().required("City is required"),
        icon: Yup.string().required("Icon is required"),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (stateList.length === 0) {
                    const stateObj = {};
                    const getStateInfo = await insertData('api/state', { page: 1, limit: 1000 }, true);
                    if (getStateInfo) {
                        setStateList(getStateInfo.data.states);
                    }
                }
                if (projectOfNumberListing.length === 0 && projectOfBooleanListing.length === 0) {
                    const stateObj = {};
                    const getProjectListingInfo = await insertData('api/project-type-listings', stateObj, true);
                    // console.log(getProjectListingInfo);
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
                if (localStorage.getItem('isLoggedIn')) {
                    const userDetail = JSON.parse(localStorage.getItem('user'));
                    const capitalizedString = userDetail.id;
                    setUserId(capitalizedString)
                }
                if (currencyList.length === 0) {
                    const currencyObj = {};
                    const getCurrencyInfo = await insertData('api/currency/get', currencyObj, true);

                    if (getCurrencyInfo.status) {
                        setCurrencyList(getCurrencyInfo.data);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);
    const handleStateChange = async (stateId) => {

        setCityList([]);
        setDistrictList([]);
        setNeighborhoodList([]);
        const selectedState = stateList.find((state) => state.id === stateId);
        if (selectedState) {
            const { latitude, longitude } = selectedState;
            setPropertyMapCoords({
                latitude: latitude,
                longitude: longitude,
                zoom: 10
            });
            const cityObj = { state_id: stateId, lang: "en" };
            const getCityInfo = await insertData('api/city/getbystate', cityObj, true);
            if (getCityInfo.status) {
                setCityList(getCityInfo.data.cities);
            }
        }

    };
    const handleCityChange = async (cityId) => {
        const selectedCites = cityList.find((cities) => cities.id === cityId);
        const { latitude, longitude } = selectedCites;
        setPropertyMapCoords({
            latitude: latitude,
            longitude: longitude,
            zoom: 12
        });

        if (!cityId) {
            setDistrictList([]); // Clear cities if no state is selected
            return;
        }
        try {
            const districtObj = { city_id: cityId, lang: "en" };
            const getDistrictInfo = await insertData('api/district/getbycity', districtObj, true);
            if (getDistrictInfo.status) {
                setDistrictList(getDistrictInfo.data);
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
            longitude: longitude,
            zoom: 12
        });

        if (!DistrictId) {
            setNeighborhoodList([]); // Clear cities if no state is selected
            return;
        }
        try {
            const districtObj = { district_id: DistrictId, lang: "en" };
            const getNeighborhoodObjInfo = await insertData('api/neighborhood/id', districtObj, true);
            if (getNeighborhoodObjInfo.status) {
                setNeighborhoodList(getNeighborhoodObjInfo.data);
            } else {
                setNeighborhoodList([]);
            }
        } catch (error) {
            console.error("Error fetching cities:", error);
            setNeighborhoodList([]);
        }
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (file.type === "video/mp4" && file.size <= 20 * 1024 * 1024) { // Check for file type and size (20 MB)
            const videoUrl = URL.createObjectURL(file);
            setFieldValue("video", file);
            setVideoPreview(videoUrl);
        } else if (file.size > 20 * 1024 * 1024) {
            alert("File size exceeds the 20 MB limit. Please upload a smaller video.");
        } else {
            alert("Please upload a valid MP4 video.");
        }
    };

    const handleNeighborhoodChange = async (NeighborhoodId) => {
        const selecteNeighborhood = neighborhoodList.find((neighborhoods) => neighborhoods.id === NeighborhoodId);
        if (selecteNeighborhood) {
            const { latitude, longitude } = selecteNeighborhood;
            setPropertyMapCoords({
                latitude: latitude,
                longitude: longitude,
                zoom: 14
            });
        } else {
            console.error('Neighborhood not found');
        }
    };

    const handleNumberChange = (id, value) => {
        setPropertyOfMetaNumberValue((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Prevent default behavior to enable drop
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type === "video/mp4") {
            const videoUrl = URL.createObjectURL(file);
            setVideoPreview(videoUrl);
        } else {
            alert("Please upload a valid MP4 video.");
        }
    };
    // Handle form submission
    const handleSubmit = async (values, { resetForm, setErrors }) => {
        const selectedAmenities = projectOfBooleanListing
            .filter((project) => checkedItems[project.key])
            .map((project) => ({ project_type_listing_id: project.id, value: "true" }));
        if (propertyOfMetaNumberValue && Object.keys(propertyOfMetaNumberValue).length > 0) {
            // Update selected amenities based on propertyOfMetaNumberValue
            Object.entries(propertyOfMetaNumberValue).forEach(([key, value]) => {
                const index = selectedAmenities.findIndex(item => item.property_type_id === key);
                if (index !== -1) {
                    selectedAmenities[index].value = value;
                } else {
                    selectedAmenities.push({ project_type_listing_id: key, value });
                }
            });
        }

        try {

            setSucessMessage("Processing .........")

            /********* upload image ***********/
            const uploadImageObj = Array.isArray(values.picture_img) ? values.picture_img : [values.picture_img];
            const videoObj = values.video ? [values.video] : [];
            const iconObj = values.icon ? [values.icon] : [];

            // Combine all files (images, video, icons) for upload
            const allUploadFiles = [...uploadImageObj, ...videoObj];
            const allUploadFilesICon = [...iconObj];

            // Upload files
            const uploadImageUrl = await insertMultipleUploadImage("image", allUploadFiles);
            const uploadImageIconUrl = await insertMultipleUploadImage("image", allUploadFilesICon);

            if (uploadImageUrl.files.length > 0) {
                const imageUrls = [];
                let videoUrl = null;
                let iconUrl = null; // Initialize as null for a single URL

                // Process uploaded files to separate URLs
                uploadImageUrl.files.forEach((file) => {
                    if (file.mimeType.startsWith("image")) {
                        imageUrls.push(file.url); // Collect image URLs
                    } else if (file.mimeType.startsWith("video")) {
                        videoUrl = file.url; // Assign video URL
                    }
                });

                // Assign the first icon file's URL to iconUrl
                if (uploadImageIconUrl?.files?.length > 0) {
                    iconUrl = uploadImageIconUrl.files[0].url; // Use the first file's URL
                }

                // Validate YouTube URL if a link is provided
                if (values.video_link && !validateYouTubeURL(values.video_link)) {
                    setErrors({ serverError: "Please upload a valid YouTube video link like https://www.youtube.com/watch?v=YOUR_VIDEO_ID." });
                    setShowErrorPopup(true);
                    return false;
                }

                // Use the provided video link if no video was uploaded
                videoUrl = videoUrl || values.video_link;

                /********* create user ***********/
                const projectData = {

                    title_en: values.title_en,
                    title_fr: values.title_fr,
                    description_en: values.description_en,
                    description_fr: values.description_fr,
                    price: parseInt(values.price) ?? 0,
                    vr_link: values.vr_link ?? null,
                    picture: imageUrls,
                    icon: iconUrl,
                    video: videoUrl,
                    user_id: userId,
                    state_id: values.state_id,
                    city_id: values.city_id,
                    district_id: values.districts_id, // Fixed
                    neighborhoods_id: values.neighborhood_id, // Fixed
                    latitude: isNaN(parseFloat(values.latitude)) ? parseFloat(propertyMapCoords.latitude) : parseFloat(values.latitude),
                    longitude: isNaN(parseFloat(values.longitude)) ? parseFloat(propertyMapCoords.longitude) : parseFloat(values.longitude),
                    currency_id: values.currency_id,
                    meta_details: selectedAmenities,
                    address: values.address,
                }
                // console.log("Project Data:", projectData);
                const createUserInfo = await insertData("api/projects/create", projectData, true);

                if (createUserInfo.status) {
                    setSucessMessage(createUserInfo.message || "Project created successfully.");
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
            setLoading(false); // Stop loader
        }
    };

    const handleCheckboxChange = (key) => {
        setCheckedItems((prevState) => ({
            ...prevState,
            [key]: !prevState[key], // Toggle the checked state
        }));
    };

    const [selectedRadio, setSelectedRadio] = useState('radio1')

    const handleRadioChange = (event) => {
        const isUpload = event.target.value === "upload";
        setIsVideoUpload(isUpload);

        if (!isUpload) {
            setVideoPreview(null); // Clear video preview
            setFieldValue("video", null); // Clear Formik video field
        } else if (isUpload) {
            setFieldValue("video_link", null);
            setVideoLink(null); // Update YouTube link manually

        }
        const selectedRadioId = event.target.id
        setSelectedRadio(selectedRadioId)
    }
    const messageClass = (sucessMessage) ? "message success" : "message error";
    return (
        <>
            {loading ? (
                <Preloader />
            ) : (
                <>
                    <LayoutAdmin>
                        {errorMessage && <div className={messageClass}>{errorMessage}</div>}
                        <Formik
                            initialValues={{
                                title_en: "",
                                title_fr: "",
                                description_en: "",
                                description_fr: "",
                                price: "",
                                currency_id: "",
                                vr_link: "",
                                picture_img: [], // Set this to an empty array for multiple files
                                icon: null, // Set this to an empty array for multiple files
                                video: null, // Use `null` for file inputs
                                state_id: "",
                                city_id: "",
                                districts_id: "",
                                neighborhood_id: ""
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
                                                <fieldset className="box-fieldset ">
                                                    <label htmlFor="name">Price<span>*</span>:</label>
                                                    <div className="phone-and-country-code">
                                                        <Field as="select" name="currency_id" className="nice-select country-code"
                                                            id="country-code"
                                                            value={currencyCode}
                                                            onChange={(e) => {
                                                                const selectedState = e.target.value;
                                                                setCurrencyCode(selectedState);
                                                                setFieldValue("currency_id", selectedState);
                                                            }}
                                                        >
                                                            <option value="">Select Currency</option>
                                                            {currencyList && currencyList.length > 0 ? (
                                                                currencyList.map((currency, index) => (
                                                                    <option key={index} value={currency.id}>{currency.name}
                                                                    </option>
                                                                ))
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </Field>
                                                        <Field type="text" id="price" name="price" className="form-control style-1" />
                                                    </div>
                                                </fieldset>
                                                <fieldset className="box box-fieldset">
                                                    <label htmlFor="desc">VR Link:</label>
                                                    <Field type="text" name="vr_link" className="box-fieldset" />
                                                </fieldset>
                                            </div>
                                            <div className="box grid-3 gap-30">
                                                {projectOfNumberListing && projectOfNumberListing.length > 0 ? (
                                                    projectOfNumberListing.map((project) => (
                                                        <fieldset className="box box-fieldset">
                                                            <label htmlFor="desc">{project.name}:</label>
                                                            <Field
                                                                type="number"
                                                                name={project.id}
                                                                min="0"
                                                                className="box-fieldset"
                                                                onChange={(e) => handleNumberChange(project.id, e.target.value)}
                                                            />
                                                        </fieldset>
                                                    ))
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                            <div className="grid-2 box gap-30">
                                                <fieldset className="box-fieldset">
                                                    <label htmlFor="picture_img">Picture Images:</label>
                                                    <Field
                                                        name="picture_img"
                                                        component={({ field, form }) => (
                                                            <div className="box-floor-img uploadfile">
                                                                {/* Upload Button */}
                                                                <div className="btn-upload">
                                                                    <label className="tf-btn primary">
                                                                        Choose Files
                                                                        <input
                                                                            type="file"
                                                                            multiple
                                                                            className="ip-file"
                                                                            onChange={(event) => {
                                                                                let newImageList = [...field.value]; // Retain previously selected files
                                                                                let newPreviews = [...filePreviews]; // Retain previous previews

                                                                                const files = Array.from(event.target.files); // Convert to an array

                                                                                files.forEach((file) => {
                                                                                    if (file.size < 150000) {
                                                                                        alert(`Please upload files above the size of 150KB`);
                                                                                    } else {
                                                                                        const img = new Image();
                                                                                        const reader = new FileReader();

                                                                                        reader.onload = (e) => {
                                                                                            img.src = e.target.result;

                                                                                            img.onload = () => {
                                                                                                if (img.height <= 800 || img.width <= 1100) {
                                                                                                    alert('Please upload images with a maximum height of 800px and a maximum width of 1100px.');
                                                                                                } else {
                                                                                                    newPreviews.push(URL.createObjectURL(file)); // Add preview
                                                                                                    newImageList.push(file); // Add valid file
                                                                                                }

                                                                                                setFilePreviews(newPreviews);
                                                                                                form.setFieldValue(field.name, newImageList);
                                                                                            };
                                                                                        };

                                                                                        reader.readAsDataURL(file);
                                                                                    }
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
                                                    {/* Image Previews */}
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
                                                                {/* Upload Button */}
                                                                <div className="btn-upload">
                                                                    <label className="tf-btn primary">
                                                                        Choose Files
                                                                        <input
                                                                            type="file"
                                                                            accept="image/*"
                                                                            className="ip-file"
                                                                            onChange={(event) => {
                                                                                const file = event.target.files[0]; // Get the first file
                                                                                if (file) {

                                                                                    const img = new Image();
                                                                                    const reader = new FileReader();

                                                                                    reader.onload = (e) => {
                                                                                        img.src = e.target.result;

                                                                                        img.onload = () => {
                                                                                            const imageHeight = img.height;
                                                                                            const imageWidth = img.width;

                                                                                            setFieldValue("icon", file); // Set the file in Formik state
                                                                                            setIconPreview(URL.createObjectURL(file)); // Generate a preview URL

                                                                                        };
                                                                                    };

                                                                                    reader.readAsDataURL(file); // Read file as Data URL
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
                                                    {/* Image Previews */}
                                                    <div className="image-preview-container image-gallery">
                                                        {iconPreview.length > 0 && iconPreview && (
                                                            <div className="preview-item">
                                                                <img
                                                                    src={iconPreview}
                                                                    alt="Icon Preview"
                                                                    className="uploadFileImage"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setIconPreview(null); // Clear the preview
                                                                        setFieldValue("icon", null); // Clear the file in Formik state
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
                                                    {/* Video Option Radio Buttons */}
                                                    <div>
                                                        <fieldset className="fieldset-radio">
                                                            <input type="radio" className="tf-radio video-upload" value="upload" name="videoOption" onChange={() => {
                                                                setIsVideoUpload(true); // Update the state for conditional rendering
                                                                setFieldValue("video", null); // Reset the file field in Formik state
                                                            }} defaultChecked />
                                                            <label htmlFor="upload" className="text-radio">Upload Video</label>

                                                            <input
                                                                type="radio"
                                                                className="tf-radio video-upload"
                                                                name="videoOption"
                                                                value="link"
                                                                onChange={() => {
                                                                    setIsVideoUpload(false); // Update the state for conditional rendering
                                                                    setFieldValue("video_link", ""); // Reset the YouTube link field in Formik state
                                                                }}
                                                            />
                                                            <label htmlFor="videoOption" className="text-radio"> YouTube Link</label>
                                                        </fieldset>
                                                    </div>

                                                    {/* Conditional Fields */}
                                                    {isVideoUpload ? (
                                                        // Video Upload Field
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
                                                                                setFieldValue("video", file); // Set the video file in Formik state
                                                                                setVideoPreview(URL.createObjectURL(file)); // Generate a preview URL
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
                                                    <Field as="select" name="state_id" className="nice-select country-code"
                                                        onChange={(e) => {
                                                            const selectedState = e.target.value;
                                                            setFieldValue("state_id", selectedState);
                                                            handleStateChange(selectedState);
                                                        }}>
                                                        <option value="">Select State</option>
                                                        {stateList && stateList.length > 0 ? (
                                                            stateList.map((state) => (
                                                                <option value={state.id}>{state.name}</option>
                                                            ))
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </Field>
                                                </fieldset>
                                                <fieldset className="box box-fieldset">
                                                    <label htmlFor="desc">Cities:</label>
                                                    <Field as="select" name="city_id" className="nice-select country-code"
                                                        onChange={(e) => {
                                                            const selectedState = e.target.value;
                                                            setFieldValue("city_id", selectedState);
                                                            handleCityChange(selectedState);
                                                        }}
                                                    >
                                                        <option value="">Select Cities</option>
                                                        {cityList && cityList.length > 0 ? (
                                                            cityList.map((cities) => (
                                                                <option key={cities.id} value={cities.id}>
                                                                    {cities.name}
                                                                </option>
                                                            ))
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </Field>
                                                </fieldset>
                                                <fieldset className="box box-fieldset">
                                                    <label htmlFor="desc">District:</label>
                                                    <Field as="select" name="districts_id" className="nice-select country-code" onChange={(e) => {
                                                        const selectedDistrict = e.target.value;
                                                        setFieldValue("districts_id", selectedDistrict);
                                                        handleDistrictChange(selectedDistrict);
                                                    }}>
                                                        <option value="">Select District</option>
                                                        {districtList && districtList.length > 0 ? (
                                                            districtList.map((districts) => (
                                                                <option key={districts.id} value={districts.id}>
                                                                    {districts.name}
                                                                </option>
                                                            ))
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </Field>
                                                </fieldset>
                                                <fieldset className="box box-fieldset">
                                                    <label htmlFor="desc">Neighborhood:</label>
                                                    <Field as="select" name="neighborhood_id" className="nice-select country-code" onChange={(e) => {
                                                        const selectedNeighborhood = e.target.value;
                                                        setFieldValue("neighborhood_id", selectedNeighborhood);
                                                        handleNeighborhoodChange(selectedNeighborhood);
                                                    }}>
                                                        <option value="">Select Neighborhood</option>
                                                        {neighborhoodList && neighborhoodList.length > 0 ? (
                                                            neighborhoodList.map((neighborhoods) => (
                                                                <option key={neighborhoods.id} value={neighborhoods.id}>
                                                                    {neighborhoods.name}
                                                                </option>
                                                            ))
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </Field>
                                                </fieldset>
                                            </div>
                                            <div className="box box-fieldset">
                                                <PropertyMapMarker
                                                    latitude={propertyMapCoords.latitude}
                                                    longitude={propertyMapCoords.longitude}
                                                    zoom={propertyMapCoords.zoom}
                                                    onPlaceSelected={(newAddress, newLocation) => {
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
                                                                    checked={!!checkedItems[project.key]} // Set checked status
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
                                        <button type="submit" className="tf-btn primary" onClick={() => setShowErrorPopup(!showErrorPopup)}>Add Project</button>
                                    </div >
                                    {/* Error Popup */}
                                    {showErrorPopup && Object.keys(errors).length > 0 && (
                                        <ErrorPopup
                                            errors={errors}
                                            validationSchema={validationSchema}
                                            onClose={() => setShowErrorPopup(false)}
                                        />
                                    )}
                                    {sucessMessage && (
                                        <SuccessPopup
                                            message={sucessMessage}
                                            onClose={() => setSucessMessage(false)}
                                        />
                                    )}
                                </Form>
                            )}
                        </Formik>


                    </LayoutAdmin >
                </>)}
        </>
    )
}