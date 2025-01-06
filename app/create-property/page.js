'use client'
import PropertyMap from "@/components/elements/PropertyMap"
import PropertyMapMarker from "@/components/elements/PropertyMapMarker"
import LayoutAdmin from "@/components/layout/LayoutAdmin"
import Link from "next/link"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { use, useState, useEffect } from "react"
import { useRouter } from 'next/navigation';
import { insertData, insertImageData } from "../../components/api/Axios/Helper";
import { insertMultipleUploadImage } from "../../components/common/imageUpload";
import { capitalizeFirstChar, validateYouTubeURL } from "../../components/common/functions";
import GooglePlacesAutocomplete from "@/components/elements/GooglePlacesAutocomplete";
import Preloader from "@/components/elements/Preloader";

import SuccessPopup from "@/components/SuccessPopup/SuccessPopup";

import "../../components/errorPopup/ErrorPopup.css";
import ErrorPopup from "../../components/errorPopup/ErrorPopup.js";

export default function CreateProperty() {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [sucessMessage, setSucessMessage] = useState(false);
    const [propertyMeta, setPropertyMeta] = useState(false);
    const [filePictureImg, setFilePictureImg] = useState(null);
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [userType, setUserType] = useState('')
    const [districtList, setDistrictList] = useState([]);
    const [neighborhoodList, setNeighborhoodList] = useState([]);
    const [projectOfListing, setProjectOfListing] = useState([]);
    const [projectOfNumberListing, setProjectOfNumberListing] = useState([]);
    const [propertyofTypesListing, setpropertyofTypesListing] = useState([]);
    const [projectOfBooleanListing, setProjectOfBooleanListing] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});
    const [propertyOfMetaNumberValue, setPropertyOfMetaNumberValue] = useState([]);
    const [videoPreview, setVideoPreview] = useState(null);
    const [isVideoUpload, setIsVideoUpload] = useState(true);
    const [video, setVideo] = useState(null);
    const [videoLink, setVideoLink] = useState("");
    const [filePreviews, setFilePreviews] = useState([]);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [currencyList, setCurrencyList] = useState([]);
    const [currencyCode, setCurrencyCode] = useState([]);
    const [loginUserId, setLoginUserId] = useState("");
    const [propertyMapCoords, setPropertyMapCoords] = useState({
        latitude: 33.5945144,
        longitude: -7.6200284,
        zoom: 6
    });
    const [address, setAddress] = useState('');


    const router = useRouter();
    const validationSchema = Yup.object({
        title_en: Yup.string()
            .min(3, "Title must be at least 3 characters")
            .required("Title is required"),
        title_fr: Yup.string()
            .min(3, "Title must be at least 3 characters")
            .required("Title is required"),
        description_en: Yup.string().required("Description is required"),
        description_fr: Yup.string().required("Description is required"),
        price: Yup.string().required("Price is required"),

        picture_img: Yup.array().min(3, "At least three image is required").required("Image is required"),
        state_id: Yup.string().required("State is required"),
        videoLink: Yup.string().url("Enter a valid URL"),
        city_id: Yup.string().required("City is required"),
        currency_id: Yup.string().required("Currency is required"),
        districts_id: Yup.string().required("District is required"),
        neighborhood_id: Yup.string().required("Neighborhood is required"),
        transaction_type: Yup.string().required("Transaction type is required"),
        property_type: Yup.string().required("Property type is required"),
        size_sqft: Yup.string().required("Size is required"),
    });


    useEffect(() => {
        const fetchData = async () => {
            try {

                if (stateList.length === 0) {
                    const getStateInfo = await insertData('api/state', {}, true);
                    if (getStateInfo) {
                        setStateList(getStateInfo.data.states);
                    }
                }


                if (userType === '') {
                    const loggedInStatus = JSON.parse(localStorage.getItem('user'));
                    if (loggedInStatus) {
                        setUserType(loggedInStatus.roles.name);
                        setLoginUserId(loggedInStatus.id);
                    }
                }


                if (propertyofTypesListing.length === 0) {
                    const getPropertyTypeInfo = await insertData('api/property-type/', { page: 1, limit: 100 }, true);
                    if (getPropertyTypeInfo.status) {
                        setpropertyofTypesListing(getPropertyTypeInfo.data.list);
                    }
                }


                if (projectOfListing.length === 0 && userType === 'developer') {
                    const getProjectListInfo = await insertData('api/projects/developer', { page: 1, limit: 100 }, true);
                    if (getProjectListInfo.status) {
                        setProjectOfListing(getProjectListInfo.data.list);
                    }
                }


                if (!propertyMeta) {
                    const getPropertyInfo = await insertData('api/property-type-listings', { page: 1, limit: 100 }, true);
                    if (getPropertyInfo) {
                        const projectOfNumberType = getPropertyInfo.data.list.filter(item => item.type === 'number');
                        const projectOfBooleanType = getPropertyInfo.data.list.filter(item => item.type === 'boolean');
                        setProjectOfNumberListing(projectOfNumberType);
                        setProjectOfBooleanListing(projectOfBooleanType);
                    }
                    setPropertyMeta(true);
                }


                if (currencyList.length === 0) {
                    const getCurrencyInfo = await insertData('api/currency/get', {}, true);
                    if (getCurrencyInfo.status) {
                        setCurrencyList(getCurrencyInfo.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [
        stateList.length,
        userList.length,
        propertyofTypesListing.length,
        projectOfListing.length,
        propertyMeta,
        currencyList.length,
        userType,
    ]);


    const handleStateChange = async (stateId) => {
        console.log('State ID:', stateId);
        const selectedState = stateList.find((state) => state.id === stateId);
        console.log('selectedState ID:', selectedState.latitude);
        const { latitude, longitude } = selectedState;
        setPropertyMapCoords({
            latitude: latitude,
            longitude: longitude,
            zoom: 10
        });
        if (cityList.length === 0) {
            console.log(1);
            const cityObj = { state_id: stateId, lang: "en" };
            const getCityInfo = await insertData('api/city', cityObj, true);
            if (getCityInfo.status) {
                console.log(getCityInfo.data.cities);
                setCityList(getCityInfo.data.cities);
            }
        }
    };

    const handleAddressSelect = (newAddress, newLocation) => {

    };
    const handleDistrictChange = async (DistrictId) => {
        console.log('District ID:', DistrictId);
        const selectedDistricts = districtList.find((districts) => districts.id === DistrictId);
        console.log('selectedState ID:', selectedDistricts.latitude);
        const { latitude, longitude } = selectedDistricts;
        setPropertyMapCoords({
            latitude: latitude,
            longitude: longitude,
            zoom: 12
        });

        if (!DistrictId) {
            setNeighborhoodList([]);
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
    const handleNeighborhoodChange = async (NeighborhoodId) => {
        console.log('NeighborhoodId ID:', NeighborhoodId);
        const selecteNeighborhood = neighborhoodList.find((neighborhoods) => neighborhoods.id === NeighborhoodId);
        if (selecteNeighborhood) {
            console.log('selectedNeighborhood ID:', selecteNeighborhood.latitude);
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




    const handleCityChange = async (cityId) => {
        console.log('City ID:', cityId);
        const selectedCites = cityList.find((cities) => cities.id === cityId);
        console.log('selectedState ID:', selectedCites.latitude);
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


    const handleNumberChange = (id, value) => {
        setPropertyOfMetaNumberValue((prev) => ({
            ...prev,
            [id]: value,
        }));
    };





    const handleFileChangeVideo = (event, setFieldValue) => {
        console.log('video');
        console.log(event);
        const files = Array.from(event.currentTarget.files);
        const videoFile = files.find(file => file.type === "video/mp4");

        console.log(videoFile);

        if (videoFile) {
            setFieldValue("video", videoFile);
            setVideoPreview(URL.createObjectURL(videoFile));
        }


    };

    const handleFileChange = (event, setFieldValue) => {
        console.log('image');
        console.log(event);
        const files = Array.from(event.currentTarget.files);
        const imageFiles = files.filter(file => file.type.startsWith("image/"));
        console.log(imageFiles);

        if (imageFiles.length > 0) {
            console.log(imageFiles);
            setFieldValue("picture_img", imageFiles);
            setFilePreviews(imageFiles.map(file => URL.createObjectURL(file)));
        }
    };

    const handlePlaceSelect = (place) => {

        console.log(place);

        setAddress(place.description);
    };
    console.log('loginUserId');
    console.log(loginUserId);

    const handleSubmit = async (values, { resetForm, setErrors }) => {

        console.log(values);
        console.log(isVideoUpload);
        // if (isVideoUpload && !values.video) {
        //     setErrors({ serverError: "Please upload a video file." });
        //     setShowErrorPopup(true);
        //     return;
        // }


        if (!isVideoUpload && !values.video_link) {
            setErrors({ serverError: "Please enter a YouTube video link." });
            setShowErrorPopup(true);
            return;
        }

        const selectedAmenities = projectOfBooleanListing
            .filter((project) => checkedItems[project.key])
            .map((project) => ({ property_type_id: project.id, value: "true" }));


        if (propertyOfMetaNumberValue && Object.keys(propertyOfMetaNumberValue).length > 0) {

            Object.entries(propertyOfMetaNumberValue).forEach(([key, value]) => {

                const index = selectedAmenities.findIndex(item => item.property_type_id === key);
                if (index !== -1) {

                    selectedAmenities[index].value = value;
                } else {

                    selectedAmenities.push({ property_type_id: key, value });
                }
            });
        }
        console.log('Selected Amenities:', selectedAmenities);


        const uploadImageObj = Array.isArray(values.picture_img)
            ? values.picture_img.filter(item => item !== null)
            : [values.picture_img].filter(item => item !== null);

        if (values.video != null) {
            uploadImageObj.push(values.video);
        }

        setErrors({ serverError: "Processing ........." });
        setShowErrorPopup(true);
        const uploadImageUrl = await insertMultipleUploadImage("image", uploadImageObj);

        if (uploadImageUrl.files.length > 0) {
            const imageUrls = [];
            let videoUrl = null;

            uploadImageUrl.files.forEach((file) => {
                if (file.mimeType.startsWith("image")) {
                    imageUrls.push(file.url);
                } else if (file.mimeType.startsWith("video")) {
                    videoUrl = file.url;
                }
            });

            const pictureUrl = imageUrls.join(", ");
            console.log("Image URLs:", pictureUrl);
            console.log("Video URL:", videoUrl);

            // if (!videoUrl) {
            //     const isValid = validateYouTubeURL(values.video_link);
            //     if (!isValid) {
            //         setErrors({ serverError: "Please upload a Valid YouTube video link like https://www.youtube.com/watch?v=YOUR_VIDEO_ID." });
            //         setShowErrorPopup(true);
            //         return false;
            //     }
            //     videoUrl = values.video_link ?? null;
            // }

            const propertyData = {
                title_en: values.title_en,
                title_fr: values.title_fr,
                description_en: values.description_en ?? null,
                description_fr: values.description_fr ?? null,
                price: parseInt(values.price) ?? 0,
                vr_link: values.vr_link ?? null,
                picture: imageUrls,
                video: videoUrl,
                user_id: loginUserId,
                link_uuid: values.link_uuid ?? null,
                state_id: values.state_id,
                city_id: values.city_id,
                district_id: values.districts_id,
                neighborhood_id: values.neighborhood_id,
                latitude: isNaN(parseFloat(values.latitude)) ? "20.2323" : String(values.latitude),
                longitude: isNaN(parseFloat(values.longitude)) ? "20.2323" : String(values.longitude),
                transaction: values.transaction_type,
                type_id: values.property_type,
                size: parseInt(values.size_sqft) ?? 0,
                meta_details: selectedAmenities,
                currency_id: values.currency_id,
                project_id: values.project_id ?? null,
                address: values.address,
            };

            console.log("Property Data:", propertyData);
            const createPropertyInfo = await insertData("api/property/create", propertyData, true);

            if (createPropertyInfo.status) {
                setSucessMessage(createPropertyInfo.message || "Property created successfully.");

                resetForm();
                router.push("/property-listing");
            } else {

                setErrors({ serverError: createPropertyInfo.message || "Failed to create property." });
                setShowErrorPopup(true);
            }
        } else {

            console.log('File not uploaded');
            setErrorMessage('File not uploaded');
        }
    };

    const handleCheckboxChange = (key) => {
        setCheckedItems((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    const [selectedRadio, setSelectedRadio] = useState('radio1')


    const handleRadioChange = (event, setFieldValue) => {
        const isUpload = event.target.value === "upload";
        setIsVideoUpload(isUpload);

        if (!isUpload) {

            setVideoPreview(null);
            setFieldValue("video", null);
        } else if (isUpload) {

            setFieldValue("video_link", null);
            setVideoLink(null);

        }
    };

    const handleVideoLinkChange = (event, setFieldValue) => {
        setVideoLink(event.target.value);
        setFieldValue("video_link", event.target.value);

    };
    console.log(userType);
    const messageClass = (sucessMessage) ? "message success" : "message error";
    return (
        <>
            {loading ? <Preloader /> :

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
                                picture_img: [],
                                video: null,
                                video_link: "",
                                state_id: "",
                                city_id: "",
                                districts_id: "",
                                neighborhood_id: "",
                                transaction_type: "",
                                property_type: "",
                                size_sqft: "",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ errors, touched, handleChange, handleBlur, setFieldValue, values }) => (
                                <Form>
                                    <div>

                                        <div className="widget-box-2">
                                            <h6 className="title">Property Information</h6>
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
                                            <div className="box grid-2 gap-30">
                                                <fieldset className="box box-fieldset">
                                                    <label htmlFor="title">Transaction Type:<span>*</span></label>
                                                    <Field as="select" name="transaction_type" className="nice-select country-code"
                                                        onChange={(e) => {
                                                            const selectedState = e.target.value;
                                                            setFieldValue("transaction_type", selectedState);
                                                        }}
                                                    >
                                                        <option value="">Select Transaction Type</option>
                                                        <option value="sale">Fore Sale</option>
                                                        <option value="rental">For Rental</option>
                                                    </Field>

                                                </fieldset>
                                                <fieldset className="box box-fieldset">
                                                    <label htmlFor="title">Property Type:<span>*</span></label>
                                                    <Field as="select" name="property_type" className="nice-select country-code"
                                                        onChange={(e) => {
                                                            const selectedState = e.target.value;
                                                            setFieldValue("property_type", selectedState);
                                                        }}
                                                    >
                                                        <option value="">Select Property Type</option>
                                                        {propertyofTypesListing && propertyofTypesListing.length > 0 ? (
                                                            propertyofTypesListing.map((property) => (
                                                                <option key={property.id} value={property.id}>{capitalizeFirstChar(property.title)}</option>
                                                            ))
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </Field>

                                                </fieldset>
                                                {(userType === 'developer') ? (
                                                    <fieldset className="box box-fieldset">
                                                        <label htmlFor="title">Project Listing:<span>*</span></label>
                                                        <Field as="select" name="project_id" className="nice-select country-code"
                                                            onChange={(e) => {
                                                                const selectedState = e.target.value;
                                                                setFieldValue("project_id", selectedState);
                                                            }}
                                                        >
                                                            <option value="">Select Project Listing</option>
                                                            {projectOfListing && projectOfListing.length > 0 ? (
                                                                projectOfListing.map((propertyList) => (
                                                                    <option key={propertyList.id} value={propertyList.id}>{capitalizeFirstChar(propertyList.title)}</option>
                                                                ))
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </Field>

                                                    </fieldset>) : (<></>)}



                                            </div>
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
                                                    <label htmlFor="title">Direction:<span>*</span></label>
                                                    <Field as="select" name="direction" className="nice-select country-code">
                                                        <option value="">Select Direction</option>
                                                        <option value="north">North</option>
                                                        <option value="south">South</option>
                                                        <option value="east">East</option>
                                                        <option value="west">West</option>
                                                    </Field>

                                                </fieldset>
                                                <fieldset className="box-fieldset">
                                                    <label htmlFor="description">Size of SqMeter:<span>*</span></label>
                                                    <Field type="number" id="size_sqft" name="size_sqft" className="form-control style-1" min="0" />

                                                </fieldset>

                                            </div>
                                            <div className="box grid-3 gap-30">


                                            </div>
                                            <div className="box grid-3 gap-30">
                                                {projectOfNumberListing && projectOfNumberListing.length > 0 ? (
                                                    projectOfNumberListing.map((project) => (
                                                        <fieldset className="box box-fieldset">
                                                            <label htmlFor="desc">{project.name}:</label>
                                                            <Field
                                                                type="number"
                                                                min="0"
                                                                name={project.id}
                                                                className="box-fieldset"
                                                                onChange={(e) => handleNumberChange(project.id, e.target.value)}
                                                            />
                                                            <ErrorMessage name={project.key} component="div" className="error" />
                                                        </fieldset>
                                                    ))
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                            <div className="box grid-2 box gap-30">
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

                                                                                    if (file.size < 150000) {
                                                                                        alert(`Please upload files above the size of 150KB`);
                                                                                    } else {

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


                                                                                                setFilePreviews(validPreviews);
                                                                                                form.setFieldValue(field.name, imageList);
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
                                            <div className="box grid-1 box gap-50">
                                                <fieldset className="box-fieldset">
                                                    <label htmlFor="picture_img">Video Option:</label>

                                                    <div>
                                                        <fieldset className="fieldset-radio">
                                                            <input type="radio" className="tf-radio video-upload" value="upload" name="videoOption" onChange={() => {
                                                                setIsVideoUpload(true);
                                                                setFieldValue("video", null);
                                                            }} defaultChecked />
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
                                                                    {cities.city_name}
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
                                                                    {districts.district_name}
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

                                                <div className="box-ip">

                                                    <Link href="#" className="btn-location"><i className="icon icon-location" /></Link>
                                                </div>
                                                <PropertyMapMarker
                                                    latitude={propertyMapCoords.latitude}
                                                    longitude={propertyMapCoords.longitude}
                                                    zoom={propertyMapCoords.zoom}
                                                    onPlaceSelected={(newAddress, newLocation) => {
                                                        setFieldValue('address', newAddress);
                                                        setFieldValue('latitude', newLocation.lat);
                                                        setFieldValue('longitude', newLocation.lng);
                                                        handleAddressSelect(newAddress, newLocation);
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
                                                                <ErrorMessage name={project.key} component="div" className="error" />
                                                            </fieldset>
                                                        ))
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" className="tf-btn primary" onClick={() => setShowErrorPopup(!showErrorPopup)} >Add Property</button>
                                    </div >

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


                    </LayoutAdmin ></>
            }
        </>
    )
}