'use client'
import PropertyMap from "@/components/elements/PropertyMap"
import LayoutAdmin from "@/components/layout/LayoutAdmin"
import Link from "next/link"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { userType } from "../../components/common/functions.js";
import { use, useState, useEffect } from "react"
import { useRouter } from 'next/navigation';
import passwordShow from "../../public/images/favicon/password-show.png"; 
import passwordHide from "../../public/images/favicon/password-hide.png"; 
import { insertData, insertImageData } from "../../components/api/Axios/Helper";
import { insertMultipleUploadImage } from "../../components/common/imageUpload";
import { capitalizeFirstChar } from "../../components/common/functions.js";
export default function CreateAgency() {
    const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [sucessMessage, setSucessMessage] = useState(false);
    const [filePreview, setFilePreview] = useState(null);
    const [filePictureImg, setFilePictureImg] = useState(null);
    const [fileCoverImg, setFileCoverImg] = useState(null);
    const [uploadImage, setUploadImage] = useState(null);
    const [userId, setUserId] = useState("");
    const [stateList, setStateList] = useState([]);
    const [developerList, setDeveloperList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [projectOfNumberListing, setProjectOfNumberListing] = useState([]);
    const [projectOfBooleanListing, setProjectOfBooleanListing] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});
    const [videoPreview, setVideoPreview] = useState(null); // State for video preview
    const router = useRouter();
    const validationSchema = Yup.object({
        title_en: Yup.string() .min(3, "Title must be at least 3 characters") .required("Title is required"),
        title_fr: Yup.string() .min(3, "Title must be at least 3 characters") .required("Title is required"),
        description_en: Yup.string().required("Description is required"),
        description_fr: Yup.string().required("Description is required"),
        price: Yup.string().required("Price is required"),
        vr_link: Yup.string().url("Invalid URL").nullable(),
        picture_img: Yup.mixed().required("Image is required"),
        credit: Yup.string().required("Credit is required"),
        state_id: Yup.string().required("State is required"),
        video: Yup.mixed().required("Video is required"),
        city_id: Yup.string().required("City is required"),
        districts_id: Yup.string().required("District is required"),
        link_uuid: Yup.string().required("Link uuid is required"),
    });
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                if(stateList.length === 0){
                    const stateObj = {};
                    const getStateInfo = await insertData('api/state', stateObj, true);
                    console.log(getStateInfo);
                    if(getStateInfo) {
                        setStateList(getStateInfo.data);
                    }
                }

                if(cityList.length === 0){
                    const stateObj = {};
                    const getCityInfo = await insertData('api/city', stateObj, true);
                    if(getCityInfo) {
                        setCityList(getCityInfo.data);
                    }
                }
                if(projectOfNumberListing.length === 0){
                    const stateObj = {};
                    const getProjectListingInfo = await insertData('api/project-type-listings', stateObj, true);
                    console.log(getProjectListingInfo);
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
                if( localStorage.getItem('isLoggedIn') ){
                    const userDetail = JSON.parse(localStorage.getItem('user'));
                    const capitalizedString = userDetail.id;
                    setUserId(capitalizedString)
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
        console.log(stateList);
    });
    const handleStateChange = async (stateId) => {
        console.log('State ID:', stateId);

        if (!stateId) {
            setCityList([]); // Clear cities if no state is selected
            return;
        }
        try {
            const cityObj = { state_id: stateId };
            const getCityInfo = await insertData('api/city', cityObj, true);
            if (getCityInfo.status) {
                setCityList(getCityInfo.data);
            } else {
                setCityList([]);
            }
        } catch (error) {
            console.error("Error fetching cities:", error);
            setCityList([]);
        }
    };
    const handleCityChange = async (cityId) => {
        console.log('City ID:', cityId);

        if (!cityId) {
            setDistrictList([]); // Clear cities if no state is selected
            return;
        }
        try {
            const districtObj = { city_id: cityId };
            const getDistrictInfo = await insertData('api/district', districtObj, true);
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
    const handleSubmit = async (values, {resetForm}) => {
        console.log(values);

        const selectedAmenities = projectOfBooleanListing
        .filter((project) => checkedItems[project.key])
        .map((project) => ({ project_type_listing_id: project.id, value: "true" }));
  
        console.log('Selected Amenities:', selectedAmenities);

       
        setErrorMessage('');
        console.log(values);
        // const checkData = { email_address: values.email, phone_number: parseInt(values.phone,10) }
        // const getUserInfo = await insertData('auth/check/user', checkData, false);
        // if(getUserInfo.status === false) {
            /********* upload image ***********/
            const uploadImageObj = [values.picture_img, values.video];
            const uploadImageUrl = await insertMultipleUploadImage('image', uploadImageObj);
            if(uploadImageUrl.files.length > 0) {
                const fileUrls = uploadImageUrl.files.map(file => file.url);
                let pictureUrl = null;
                let videoUrl = null;
                if(uploadImageUrl.files.length > 0) {
                    pictureUrl = fileUrls[0];
                    videoUrl = fileUrls[1];
                }
                /********* create user ***********/
                try {
                    const projectData = {
                        title_en: values.title_en,
                        title_fr: values.title_fr,
                        description_en: values.description_en??null,
                        description_fr: values.description_fr??null,
                        price: parseInt(values.price)??0,
                        vr_link: values.vr_link??null,
                        picture: pictureUrl,
                        video: videoUrl,
                        user_id: userId,
                        link_uuid: values.link_uuid??null,
                        state_id: values.state_id,
                        city_id: values.city_id,
                        district_id: values.districts_id,
                        latitude: values.latitude,
                        longitude: values.longitude,
                        meta_details:selectedAmenities,
                        latitude: "34.092809",
                        longitude: "-118.328661"
                    }
                    console.log('projectData');
                    console.log(projectData);
                    const createUserInfo = await insertData('api/projects/create', projectData, true);
                    console.log('status');
                    console.log(createUserInfo);
                    if(createUserInfo.status) {
                        setSucessMessage(true);
                        setErrorMessage("Project created successfully");
                        router.push('/project-listing');  
                    }else{
                        setErrorMessage(createUserInfo.message);   
                    } 
                } catch (error) {
                    setErrorMessage(error.message);
                } 
            } else {
               setErrorMessage('File not uploaded');
            }
        // }else{
        //     setErrorMessage(getUserInfo.message);
        // }
    };

    const handleCheckboxChange = (key) => {
        setCheckedItems((prevState) => ({
            ...prevState,
            [key]: !prevState[key], // Toggle the checked state
        }));
    };

	const [selectedRadio, setSelectedRadio] = useState('radio1')

	const handleRadioChange = (event) => {
		const selectedRadioId = event.target.id
		setSelectedRadio(selectedRadioId)
	}
    console.log(checkedItems);
    const messageClass = (sucessMessage) ? "message success" : "message error";
	return (
		<>

			{/* <DeleteFile /> */}

			<LayoutAdmin>
            {errorMessage && <div className={messageClass}>{errorMessage}</div>}
            <Formik
                initialValues={{ 
                    title_en: "",
                    title_fr: "",
                    description_en: "",
                    description_fr: "",
                    price: "",
                    vr_link: "",
                    picture_img: null, // Use `null` for file inputs
                    video: null, // Use `null` for file inputs
                    credit: "",
                    state_id: "",
                    city_id: "",
                    districts_id: "",
                    link_uuid: "",
                 }}  
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                >
                {({ errors, touched, handleChange, handleBlur, setFieldValue }) => (
                    <Form>
                        <div>
                            {/* <div className="widget-box-2">
                                <h6 className="title">Upload Agency User Image</h6>
                                <div className="box-uploadfile text-center">
                                    <label className="uploadfile">
                                    <span className="icon icon-img-2" />
                                    <div className="btn-upload">
                                        <span className="tf-btn primary">Choose Image</span>
                                        <input
                                            type="file"
                                            className="ip-file"
                                            onChange={(event) => {
                                                const file = event.currentTarget.files[0];
                                                setFieldValue("image", file);
                                                setFilePreview(URL.createObjectURL(file));
                                            }}
                                        />
                                    </div>
                                    {filePreview && ( <img src={filePreview} alt="Preview" style={{ width: "100px", marginTop: "10px" }} /> )}
                                    <p className="file-name fw-5"> Or drop image here to upload </p>
                                    </label>
                                    {errors.image && touched.image && (
                                    <div className="error">{errors.image}</div>
                                    )}
                                </div>
                            </div> */}
                            <div className="widget-box-2">
                                <h6 className="title">Project Information</h6>
                                <div className="box grid-2 gap-30">
                                    <fieldset className="box box-fieldset">
                                        <label htmlFor="title">Title English:<span>*</span></label>
                                        <Field type="text" id="title_en" name="title_en" className="form-control style-1" />
                                        <ErrorMessage name="title_en" component="div" className="error" />
                                    </fieldset>
                                    <fieldset className="box box-fieldset">
                                        <label htmlFor="title">Title French:<span>*</span></label>
                                        <Field type="text" id="title_fr" name="title_fr" className="form-control style-1" />
                                        <ErrorMessage name="title_fr" component="div" className="error" />
                                    </fieldset>
                                </div>
                                <div className="grid-1 box gap-30">
                                    <fieldset className="box-fieldset">
                                        <label htmlFor="description">Description English:<span>*</span></label>
                                        <Field type="textarea"  as="textarea"  id="description_en" name="description_en" className="textarea-tinymce" />
                                        <ErrorMessage name="description_en" component="div" className="error" />
                                    </fieldset>
                                </div>
                                <div className="grid-1 box gap-30">
                                    <fieldset className="box-fieldset">
                                        <label htmlFor="description">Description French:<span>*</span></label>
                                        <Field type="textarea"  as="textarea"  id="description_fr" name="description_fr" className="textarea-tinymce" />
                                        <ErrorMessage name="description_fr" component="div" className="error" />
                                    </fieldset>
                                </div>
                            </div>
                            <div className="widget-box-2">
                                <h6 className="title">Other Information</h6>
                                <div className="box grid-3 gap-30">
                                    <fieldset className="box box-fieldset">
                                        <label htmlFor="desc">Price:<span>*</span></label>
                                        <Field type="text" id="price" name="price" className="box-fieldset" />
                                        <ErrorMessage name="price" component="div" className="error" />
                                    </fieldset>
                                    <fieldset className="box box-fieldset">
                                        <label htmlFor="desc">VR Link:</label>
                                        <Field type="text" name="vr_link" className="box-fieldset"  />
                                        <ErrorMessage name="vr_link" component="div" className="error" />
                                    </fieldset>
                                    <fieldset className="box box-fieldset">
                                        <label htmlFor="desc">Link UUID:<span>*</span></label>
                                        <Field type="text"  name="link_uuid" className="box-fieldset" />
                                        <ErrorMessage name="link_uuid" component="div" className="error" />
                                    </fieldset>
                                </div>
                                <div className="box grid-3 gap-30">
                                    <fieldset className="box box-fieldset">
                                        <label htmlFor="desc">License number:</label>
                                        <Field type="text" id="license_number" name="license_number" className="box-fieldset" />
                                        <ErrorMessage name="license_number" component="div" className="error" />
                                    </fieldset>
                                    <fieldset className="box box-fieldset">
                                        <label htmlFor="desc">Credit:</label>
                                        <Field type="text" name="credit" className="box-fieldset"  />
                                        <ErrorMessage name="credit" component="div" className="error" />
                                    </fieldset>
                                    {/* <fieldset className="box box-fieldset">
                                        <label htmlFor="title">User Listing:</label>
                                        <Field as="select" name="user_id" className="nice-select country-code"
                                                onChange={(e) => {
                                                    const selectedState = e.target.value;
                                                    setFieldValue("user_id", selectedState);
                                                }}
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
                                        <ErrorMessage name="user_id" component="div" className="error" />
                                    </fieldset> */}
                                        {projectOfNumberListing && projectOfNumberListing.length > 0 ? (
                                            projectOfNumberListing.map((project) => (
                                                <fieldset className="box box-fieldset">
                                                    <label htmlFor="desc">{project.name}:</label>
                                                        <Field type="number" name={project.id} className="box-fieldset" />
                                                    <ErrorMessage name={project.key} component="div" className="error" />
                                                </fieldset>
                                            ))
                                        ) : (
                                            <></>
                                        )}
                                </div>
                                <div className="grid-2 box gap-30">
                                    <fieldset className="box-fieldset">
                                        <label htmlFor="bedrooms">Picture Image:</label>
                                        <div className="box-floor-img uploadfile">
                                            <div className="btn-upload">
                                                <Link href="#" className="tf-btn primary">Choose File</Link>
                                                <input
                                                    type="file"
                                                    className="ip-file"
                                                    onChange={(event) => {
                                                        const file = event.currentTarget.files[0];
                                                        setFieldValue("picture_img", file);
                                                        setFilePictureImg(URL.createObjectURL(file));
                                                    }}
                                                />
                                                {filePictureImg && ( <img src={filePictureImg} alt="Preview" className="uploadFileImage" /> )}
                                            </div>
                                            <p className="file-name fw-5"> Or drop image here to upload </p>
                                            {errors.picture_img && touched.picture_img && ( <div className="error">{errors.picture_img}</div> )}
                                        </div>
                                    </fieldset>
                                    <fieldset className="box-fieldset">
                                        <label htmlFor="videoUpload">Video Upload:</label>
                                        <div
                                            className="box-floor-img uploadfile"
                                            onDragOver={handleDragOver}
                                            onDrop={handleDrop}
                                        >
                                            <div className="btn-upload">
                                                <label className="tf-btn primary">
                                                    Choose File
                                                    <input
                                                        type="file"
                                                        className="ip-file"
                                                        accept="video/mp4"
                                                        onChange={(event) => {
                                                            const file = event.currentTarget.files[0];
                                                            if (file.type === "video/mp4" && file.size <= 20 * 1024 * 1024) { // Check for file type and size (20 MB)
                                                                setFieldValue("video", file);
                                                                setVideoPreview(URL.createObjectURL(file));
                                                            } else if (file.size > 20 * 1024 * 1024) {
                                                                alert("File size exceeds the 20 MB limit. Please upload a smaller video.");
                                                            } else {
                                                                alert("Please upload a valid MP4 video.");
                                                            }
                                                        }}
                                                        style={{ display: 'none' }}
                                                    />
                                                </label>
                                                {videoPreview ? (
                                                <video controls className="uploadFileImage">
                                                    <source src={videoPreview} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                ) : (<></>)}
                                            </div>  
                                                <p className="file-name fw-5">Or drop video here to upload</p>
                                                {errors.video && touched.video && ( <div className="error">{errors.video}</div> )}
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                            <div className="widget-box-2">
                                <h6 className="title">Location</h6>
                                <div className="box grid-3 gap-30">
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
                                        <ErrorMessage name="state_id" component="div" className="error" />
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
                                        <ErrorMessage name="city_id" component="div" className="error" />
                                    </fieldset>
                                    <fieldset className="box box-fieldset">
                                        <label htmlFor="desc">District:</label>
                                            <Field as="select" name="districts_id" className="nice-select country-code">
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
                                        <ErrorMessage name="districts_id" component="div" className="error" />
                                    </fieldset>
                                </div>
                                <div className="box box-fieldset">
                                    <label htmlFor="location">Address:<span>*</span></label>
                                    <div className="box-ip">
                                        <input type="text" className="form-control style-1" name="address" />
                                        <Link href="#" className="btn-location"><i className="icon icon-location" /></Link>
                                    </div>
                                    <PropertyMap singleMap />
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
                                                    <ErrorMessage name={project.key} component="div" className="error" />
                                                </fieldset>
                                            ))
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button type="submit"  className="tf-btn primary" >Add Project</button>
                        </div >
                    </Form>
                )}
                </Formik>
				

			</LayoutAdmin >
		</>
	)
}