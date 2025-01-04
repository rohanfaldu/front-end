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
import  "../../../components/errorPopup/ErrorPopup.css";
import ErrorPopup from "../../../components/errorPopup/ErrorPopup.js";

const resolveIdByName = (stateName, statesList) => {
    const state = statesList.find((state) => state.name === stateName);
    return state ? state.id : ""; // Return the state id or empty string if not found
  };
export default function EditProject({params}) {
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
    const [videoPreview, setVideoPreview] = useState(null); // State for video preview
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
        // console.log(id);
        const fetchData = async () => {

		try {
                const requestData = {
                    project_slug: slug,
                };
                const getProjectInfo = await insertData('api/projects/getbyIds', requestData, true);
                    // console.log(getProjectInfo);

                if (getProjectInfo.data) {
                    setProjectDetail(getProjectInfo.data);
                } else {
                    setErrorMessage("Project not found.");
                }

                if (getProjectInfo.data.meta_details) {
                // Create the checkedItems state based on meta_details
                const initialCheckedItems = getProjectInfo.data.meta_details.reduce((acc, meta) => {

                    if (meta.value === "true") {
                        acc[meta.key] = true; // Set the checkbox for this key as checked
                    }
                    return acc;
                }, {});
                setCheckedItems(initialCheckedItems);
            }
            if (getProjectInfo.data.picture) {
                setFilePreviews(getProjectInfo.data.picture.map((url) => url)); // Use URLs for preview
            }
            if (getProjectInfo.data.icon) {
                setIconPreview(getProjectInfo.data.icon); // Use URL for video preview
            }
           
            if (getProjectInfo.data.video) {
                const videoLink = getProjectInfo.data.video;
                if (videoLink.toLowerCase().endsWith(".mp4")) {
                    setIsVideoUpload(true); // Set to 'Upload Video' if it's an .mp4
                    setVideoPreview(videoLink); // Set video preview (for .mp4)
                } else {
                    console.log(videoLink);
                    setIsVideoUpload(false); // Set to 'YouTube Link' otherwise
                }
            }
            if(stateList.length === 0){
                const stateObj = {};
                const getStateInfo = await insertData('api/state', stateObj, true);
                // console.log(getStateInfo.data.states[0].id);
                if(getStateInfo) {
                    setStateList(getStateInfo.data.states);
                }
               
            }
           
    
            // if (getProjectInfo.data.length === 0 && getProjectInfo.data.city) {
            //     handleCityChange(getProjectInfo.data.city);
            // }
    
            // if (getProjectInfo.data.length === 0 && getProjectInfo.data.district) {
            //     handleDistrictChange(getProjectInfo.data.district);
            // }

                
            if( localStorage.getItem('isLoggedIn') ){
                const userDetail = JSON.parse(localStorage.getItem('user'));
                const capitalizedString = userDetail.id;
                setUserId(capitalizedString)
            }

        
                if(projectOfNumberListing.length === 0 && projectOfBooleanListing.length === 0){
                    const stateObj = {};
                    const getProjectListingInfo = await insertData('api/project-type-listings', stateObj, true);
                    // console.log(getProjectListingInfo);
                    if(getProjectListingInfo) {
                        const projectOfNumberType = getProjectListingInfo.data.list.filter(item => item.type === "number");
                        const projectOfBlooeanType = getProjectListingInfo.data.list.filter(item => item.type === "boolean");
                        setProjectOfNumberListing(projectOfNumberType);
                        setProjectOfBooleanListing(projectOfBlooeanType);
                    }
                }
                if(developerList.length === 0){
                    const getUsersDeveloperInfo = await insertData('auth/get/developer', {}, false);
                    const developerList = getUsersDeveloperInfo.data.user_data;
                    if(developerList.length) {
                        setDeveloperList(developerList);
                    }
                }
                
                setLoading(false); // Stop loading
                setError(null); // Clear errors
		} catch (err) {
			setLoading(false); // Stop loading
		}
		};
		fetchData(); // Fetch data on component mount
	}, []);

   
    const validationSchema = Yup.object({
            title_en: Yup.string() .min(3, "Title must be at least 3 characters") .required("Title is required"),
            title_fr: Yup.string() .min(3, "Title must be at least 3 characters") .required("Title is required"),
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
    // Handle form submission

    const handleStateChange = async (stateId) => {
        // Ensure that stateId exists in the stateList
        const selectedState = stateList.find((state) => state.id === stateId);

        if (!selectedState) {
            console.error('State not found:', stateId);
            return; // Exit the function if state is not found
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
            setDistrictList([]); // Clear cities if no state is selected
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
        // console.log('District ID:', DistrictId);
        const selectedDistricts = districtList.find((districts) => districts.id === DistrictId);
        const { latitude, longitude } = selectedDistricts;
        setPropertyMapCoords({
            latitude: latitude,
            longitude: longitude
        });

        if (!DistrictId) {
            setNeighborhoodList([]); // Clear cities if no state is selected
            return;
        }
        try {
            const districtObj = { district_id: DistrictId , lang:"en" };
            const getNeighborhoodObjInfo = await insertData('api/neighborhood', districtObj, true);
            if (getNeighborhoodObjInfo.status) {
                setNeighborhoodList(getNeighborhoodObjInfo.data.neighborhoods);
            } else {
                setNeighborhoodList([]);
            }
        } catch (error) {
            // console.error("Error fetching cities:", error);
            setNeighborhoodList([]);
        }
    };
    const handleNeighborhoodChange = async (NeighborhoodId) => {
        // console.log('NeighborhoodId ID:', NeighborhoodId);
        const selecteNeighborhood = neighborhoodList.find((neighborhoods) => neighborhoods.id === NeighborhoodId);
        if (selecteNeighborhood) {
            // console.log('selectedNeighborhood ID:', selecteNeighborhood.latitude);
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
    const handleSubmit = async (values, {resetForm, setErrors }) => {
       console.log(values);
              
                console.log(projectOfBooleanListing);
       
       
               const selectedAmenities = projectOfBooleanListing
                   .filter((project) => checkedItems[project.key])
                   .map((project) => ({ project_type_listing_id: project.id, value: "true" }));
       
               console.log("Selected Amenities:", selectedAmenities);
       
               try {
                  
                   // const uploadImageObj = [values.picture_img, values.video];
                   // const uploadImageUrl = await insertMultipleUploadImage("image", uploadImageObj);
                   // Ensure picture_img, video, and icon are arrays
                   const uploadImageObj = Array.isArray(values.picture_img) ? values.picture_img : [values.picture_img];
                   const videoObj = values.video ? [values.video] : [];
                   const iconObj = values.icon ? [values.icon] : [];
                   
                   // Combine all files (images, video, icons) for upload
                   const allUploadFiles = [...uploadImageObj, ...videoObj];
                   const allUploadFilesICon = [...iconObj];
                   console.log('uploadImageIconUrl');
                   console.log(allUploadFiles);

                   const hasFile = allUploadFiles.some((item) => item instanceof File);
                   console.log("Contains a File:", hasFile);
                   // Upload files
                   let  uploadImageUrl = values.picture_img;
                   let uploadImageIconUrl = [];
                   if(hasFile){
                        const uploadImageUrlFIles = await insertMultipleUploadImage("image", allUploadFiles);
                        uploadImageUrl = uploadImageUrlFIles.files;
                        uploadImageIconUrl = await insertMultipleUploadImage("image", allUploadFilesICon);
                   }

                   
                   if (uploadImageUrl.length > 0) {
                       const imageUrls = [];
                       let videoUrl = values.video;
                       let iconUrl = values.icon; // Initialize as null for a single URL
                   
                       // Process uploaded files to separate URLs
                        if(hasFile){
                            uploadImageUrl.forEach((file) => {
                                if (file.mimeType.startsWith("image")) {
                                    imageUrls.push(file.url); // Collect image URLs
                                } else if (file.mimeType.startsWith("video")) {
                                    videoUrl = file.url; // Assign video URL
                                }
                            });
                        } else{
                            uploadImageUrl.forEach((file) => {
                                imageUrls.push(file);
                            })
                            
                        }
                       // Assign the first icon file's URL to iconUrl
                       if (uploadImageIconUrl?.files?.length > 0) {
                           iconUrl = uploadImageIconUrl.files[0].url; // Use the first file's URL
                       }else{
                            iconUrl = values.icon;
                       }
                   
                       console.log("Project Data:", { imageUrls, videoUrl, iconUrl });
                   
                       // Default video URL if not uploaded
                       if (!videoUrl) {
                           const isValid = validateYouTubeURL(values.video_link);
                           if (!isValid) {
                               setErrors({ serverError: "Please upload a Valid YouTube video link like https://www.youtube.com/watch?v=YOUR_VIDEO_ID." });
                               setShowErrorPopup(true);
                               return false;
                           }
                           videoUrl = values.video_link ?? null; // Use values.video_link as fallback
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
                           district_id: values.districts_id, // Fixed
                           neighborhoods_id: values.neighborhood_id, // Fixed
                           latitude: isNaN(parseFloat(values.latitude)) ? 20.2323 : parseFloat(values.latitude),
                           longitude: isNaN(parseFloat(values.longitude)) ? 20.2323 : parseFloat(values.longitude),
                           currency_id: values.currency_id,
                           meta_details: selectedAmenities,
                           address: values.address,
                       };
       
                       console.log("Project Datasssssss:", projectData); 
                      const createUserInfo = await updateData("api/projects/"+values.project_id, projectData, true);
       
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
               }finally {
                  // setLoading(false); // Stop loader
               }
            

    };

	const handleCheckboxChange = (key) => {
        setCheckedItems((prevState) => ({
            ...prevState,
            [key]: !prevState[key], // Toggle the checked state
        }));
    };
    const messageClass = (sucessMessage) ? "message success" : "message error";

	return (
		<>
            {loading?
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
                                            {/* <Field type="hidden" id="project_id" name="project_id" className="form-control style-1" /> */}
                                            <fieldset className="box box-fieldset">
                                                <label htmlFor="title">Title English:<span>*</span></label>
                                                <Field type="text" id="title_en" name="title_en" className="form-control style-1" />
                                                {/* <ErrorMessage name="title_en" component="div" className="error" /> */}
                                            </fieldset>
                                            <fieldset className="box box-fieldset">
                                                <label htmlFor="title">Title French:<span>*</span></label>
                                                <Field type="text" id="title_fr" name="title_fr" className="form-control style-1" />
                                                {/* <ErrorMessage name="title_fr" component="div" className="error" /> */}
                                            </fieldset>
                                        </div>
                                        <div className="grid-1 box gap-30">
                                            <fieldset className="box-fieldset">
                                                <label htmlFor="description">Description English:<span>*</span></label>
                                                <Field type="textarea"  as="textarea"  id="description_en" name="description_en" className="textarea-tinymce" />
                                                {/* <ErrorMessage name="description_en" component="div" className="error" /> */}
                                            </fieldset>
                                        </div>
                                        <div className="grid-1 box gap-30">
                                            <fieldset className="box-fieldset">
                                                <label htmlFor="description">Description French:<span>*</span></label>
                                                <Field type="textarea"  as="textarea"  id="description_fr" name="description_fr" className="textarea-tinymce" />
                                                {/* <ErrorMessage name="description_fr" component="div" className="error" /> */}
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
                                                <Field type="text" name="vr_link" className="box-fieldset"  />
                                            </fieldset>
                                            {/* <fieldset className="box box-fieldset">
                                                <label htmlFor="desc">Link UUID:<span>*</span></label>
                                                <Field type="text"  name="link_uuid" className="box-fieldset" />
                                            </fieldset> */}
                                        </div>
                                        <div className="box grid-3 gap-30">
                                            {/* <fieldset className="box box-fieldset">
                                                <label htmlFor="desc">License number:</label>
                                                <Field type="text" id="license_number" name="license_number" className="box-fieldset" />
                                            </fieldset>
                                            <fieldset className="box box-fieldset">
                                                <label htmlFor="desc">Credit:</label>
                                                <Field type="text" name="credit" className="box-fieldset"  />
                                            </fieldset> */}
                                            {/* <fieldset className="box box-fieldset">
                                                <label htmlFor="title">User Listing:</label>
                                                <Field as="select" name="user_id" className="nice-select country-code"
                                                        onChange={(e) => {
                                                            const selectedUSer = e.target.value;
                                                            setFieldValue("user_id", selectedUSer);
                                                        }}
                                                        value={values.user_id || projectDetail.user || ""}
                                                    >
                                                    <option value="">Select User Listing</option>
                                                    {developerList && developerList.length > 0 ? (
                                                        developerList.map((user) => (
                                                            (user.full_name !== null)?<option key={user.id} value={user.id}>{capitalizeFirstChar(user.full_name)}</option>:<></>
                                                        ))
                                                    ) : (
                                                        <></>
                                                    )}
                                                </Field>
                                              
                                            </fieldset> */}
                                                {/* {projectOfNumberListing && projectOfNumberListing.length > 0 ? (
                                                    projectOfNumberListing.map((project) => (
                                                        <fieldset className="box box-fieldset">
                                                            <label htmlFor="desc">{project.name}:</label>
                                                                <Field type="number" name={project.id} className="box-fieldset" />
                                                        </fieldset>
                                                    ))
                                                ) : (
                                                    <></>
                                                )} */}
                                        </div>
                                        <div className="grid-2 box gap-30">
                                        <fieldset className="box-fieldset">
                                            <label htmlFor="picture_img">Picture Images:</label>
                                            <Field
                                                name="picture_img"
                                                component={({ field, form }) => ( 
                                                <div className="box-floor-img uploadfile">
                                                    {/* Existing Image Previews */}
                                                    {/* <div className="image-previews">
                                                    {field.value?.map((img, index) => (
                                                        <div key={index} className="image-preview">
                                                        <img
                                                            src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                                                            alt={`Preview ${index}`}
                                                            className="preview-img"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="remove-btn"
                                                            onClick={() => {
                                                            const updatedImages = [...field.value];
                                                            updatedImages.splice(index, 1); // Remove the image from the array
                                                            form.setFieldValue(field.name, updatedImages);
                                                            }}
                                                        >
                                                            Remove
                                                        </button>
                                                        </div>
                                                    ))}
                                                    </div> */}

                                                    {/* Upload Button */}
                                                    <div className="btn-upload">
                                                    <label className="tf-btn primary">
                                                        Choose Files
                                                        <input
                                                        type="file"
                                                        multiple
                                                        className="ip-file"
                                                        onChange={(event) => {
                                                            let imageList = [];
                                                            const files = Array.from(event.target.files); // Convert to an array
                                                            const validPreviews = [];
                                                            files.forEach((file) => {
                                                                // Check file size (less than 150KB)
                                                                // if (file.size < 150000) {
                                                                // alert(`Please upload files above the size of 150KB`);
                                                                // } else {
                                                                // Create an Image object to check its dimensions
                                                                const img = new Image();
                                                                const reader = new FileReader();
                                                                reader.onload = (e) => {
                                                                    img.src = e.target.result; // Set image src to the file's data URL
    
                                                                    // Once the image is loaded, check its dimensions
                                                                    img.onload = () => {
                                                                    const imageHeight = img.height;  // Get image height
                                                                    const imageWidth = img.width;    // Get image width
    
                                                                    // You can add your dimension validation here
                                                                    if (imageHeight <= 800 || imageWidth <= 1100) {
                                                                        alert('Please upload images with a maximum height of 800px and a maximum width of 1100px.');
                                                                    } else {
                                                                        // Add the file as a valid image and generate the preview
                                                                        validPreviews.push(URL.createObjectURL(file));
                                                                        imageList.push(file); // Add valid file to the list
                                                                    }   
                                                                    console.log(validPreviews);
                                                                    // Update state and Formik with valid files
                                                                    setFilePreviews(validPreviews); // Set previews for valid files
                                                                    setFieldValue(field.name, imageList);
                                                                    };
                                                                };
    
                                                                // Read the file as a Data URL to create a preview
                                                                reader.readAsDataURL(file);
                                                                //}
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
                                                                    // Perform size validation
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

                                                                        // Perform dimension validation
                                                                        if (imageHeight > 200 || imageWidth > 200) {
                                                                        alert(
                                                                            "Please upload an image with a maximum height and width of 200px."
                                                                        );
                                                                        } else {
                                                                        setFieldValue("icon", file); // Set the file in Formik state
                                                                        setIconPreview(URL.createObjectURL(file)); // Generate a preview URL
                                                                        }
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
                                                        <input
                                                            type="radio"
                                                            className="tf-radio video-upload"
                                                            value="upload"
                                                            name="videoOption"
                                                            onChange={() => {
                                                                setIsVideoUpload(true); // Update the state for 'Upload Video'
                                                                setFieldValue("video", null); // Reset the file field in Formik state
                                                            }}
                                                            checked={isVideoUpload} // Ensure this radio is checked if it's an .mp4
                                                        />
                                                        <label htmlFor="upload" className="text-radio">Upload Video</label>

                                                        <input
                                                            type="radio"
                                                            className="tf-radio video-upload"
                                                            name="videoOption"
                                                            value="link"
                                                            onChange={() => {
                                                                setIsVideoUpload(false); // Update the state for 'YouTube Link'
                                                                setFieldValue("video_link", ""); // Reset the YouTube link field in Formik state
                                                            }}
                                                            checked={!isVideoUpload} // Ensure this radio is checked if it's not an .mp4
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
                                                            {/* <ErrorMessage name="video" component="div" className="error" /> */}
                                                        </div>
                                                    ) : (
                                                        // YouTube Link Input Field
                                                        <div>
                                                            <label htmlFor="video_link">YouTube Link:</label>
                                                            <Field
                                                                type="text"
                                                                name="video_link"
                                                                className="form-control"
                                                                placeholder="https://www.youtube.com/watch?v=QgAQcrvHsHQ"
                                                            />
                                                            {/* <ErrorMessage name="video_link" component="div" className="error" /> */}
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
                                                    value={ projectDetail.state.id || values.state_id}
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
                                                    value={projectDetail.city.id || values.city_id }
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
                                                //handleAddressSelect(newAddress, newLocation);
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
                                                            <fieldset         className="amenities-item">
                                                                <Field
                                                                    type="checkbox" name={project.id}
                                                                    className="tf-checkbox style-1 primary"
                                                                    checked={!!checkedItems[project.key]} // Set checked status
                                                                    onChange={() => handleCheckboxChange(project.key)}
                                                                />
                                                                <label for="cb1" className="text-cb-amenities">{project.name}</label>
                                                                {/* <ErrorMessage name={project.key} component="div" className="error" /> */}
                                                            </fieldset>
                                                        ))
                                                    ) : (
                                                        <></>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit"  className="tf-btn primary" >Update Project</button>
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