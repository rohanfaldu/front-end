'use client'
import PropertyMapMarker from "@/components/elements/PropertyMapMarker"
import LayoutAdmin from "@/components/layout/LayoutAdmin"
import Link from "next/link"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { use, useState, useEffect } from "react"
import { useRouter } from 'next/navigation';
import { insertData, insertImageData } from "../../components/api/Axios/Helper";
import { insertMultipleUploadImage } from "../../components/common/ImageUpload";
import { capitalizeFirstChar, validateYouTubeURL, checkURL } from "../../components/common/Functions";
import Preloader from "@/components/elements/Preloader";
import SuccessPopup from "../../components/success-popup/SuccessPopup";
import  "../../components/error-popup/ErrorPopup.css";
import ErrorPopup from "../../components/error-popup/ErrorPopup.js";
import { handleDropdownChange } from "../../components/common/Location";
import { InputTextFields, InputTextAreaFields, SelectOptionFields, InputPriceFields, InputNumberFields } from "@/components/common/InputFields";
export default function CreateProperty() {
    const [loading, setLoading] = useState(false); // Loader state
	const [errorMessage, setErrorMessage] = useState('');
	const [sucessMessage, setSucessMessage] = useState(false);
	const [propertyMeta, setPropertyMeta] = useState(false);
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
    const [videoPreview, setVideoPreview] = useState(null); // State for video preview
    const [isVideoUpload, setIsVideoUpload] = useState(true);
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
        title_en: Yup.string() .min(3, "Title must be at least 3 characters") .required("Title is required"),
        title_fr: Yup.string() .min(3, "Title must be at least 3 characters") .required("Title is required"),
        description_en: Yup.string().required("Description is required"),
        description_fr: Yup.string().required("Description is required"),
        price: Yup.string().required("Price is required"),
        picture_img: Yup.array().min(1, "At least one image is required").required("Image is required"),
        state_id: Yup.string().required("State is required"),
        videoLink: Yup.string().url("Enter a valid URL"),
        city_id: Yup.string().required("City is required"),
        currency_id: Yup.string().required("Currency is required"),
        transaction_type: Yup.string().required("Transaction type is required"),
        property_type: Yup.string().required("Property type is required"),
        size_sqft: Yup.string().required("Size is required"),
        direction: Yup.string().required("Direction is required"),
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch state list
                if (stateList.length === 0) {
                    const getStateInfo = await insertData('api/state', { page: 1, limit: 100 }, true);
                    if (getStateInfo) {
                        setStateList(getStateInfo.data.states);
                    }
                }
    
                // Set user type and ID
                if (userType === '') {
                    const loggedInStatus = JSON.parse(localStorage.getItem('user'));
                    if (loggedInStatus) {
                        setUserType(loggedInStatus.roles.name);
                        setLoginUserId(loggedInStatus.id);
                    }
                }
    
                // Fetch property types listing
                if (propertyofTypesListing.length === 0) {
                    const getPropertyTypeInfo = await insertData('api/property-type/', { page: 1, limit: 100 }, true);
                    if (getPropertyTypeInfo.status) {
                        setpropertyofTypesListing(getPropertyTypeInfo.data.list);
                    }
                }
    
                // Fetch projects for developers
                if (projectOfListing.length === 0 && userType === 'developer') {
                    const getProjectListInfo = await insertData('api/projects/developer', { page: 1, limit: 100 }, true);
                    if (getProjectListInfo.status) {
                        setProjectOfListing(getProjectListInfo.data.list);
                    }
                }
    
                // Fetch property meta information
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
    
                // Fetch currency list
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
        // console.log('State change triggered with ID:', stateId);
        setCityList([]);
        setDistrictList([]);
        setNeighborhoodList([]);
    
        await handleDropdownChange( 'city', stateId, stateList, setCityList, 'api/city/getbystate', { lang: 'en', state_id: stateId }, setPropertyMapCoords, 10 );
    };
    
    const handleCityChange = async (cityId) => {
        setDistrictList([]);
        await handleDropdownChange( 'district', cityId, cityList, setDistrictList, 'api/district/getbycity', { lang: 'en', city_id: cityId }, setPropertyMapCoords, 12 );
    };
    
    const handleDistrictChange = async (districtId) => {
        setNeighborhoodList([]);
        await handleDropdownChange( 'neighborhood', districtId, districtList, setNeighborhoodList, 'api/neighborhood/id', { lang: 'en', district_id: districtId }, setPropertyMapCoords, 14 );
    };
    
    const handleNeighborhoodChange = (neighborhoodId) => {
        const selectedNeighborhood = neighborhoodList.find(
            (neighborhood) => neighborhood.id === neighborhoodId
        );
        if (selectedNeighborhood) {
            updateMapCoords(selectedNeighborhood, setPropertyMapCoords, 16);
        } else {
            console.error('Neighborhood not found:', neighborhoodId);
        }
    };
  

    const handleNumberChange = (id, value) => {
        setPropertyOfMetaNumberValue((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (values, {resetForm, setErrors}) => {

        if (!isVideoUpload && values.video_link && !validateYouTubeURL(values.video_link)) {
            setErrors({ serverError: "Please upload a valid YouTube video link like https://www.youtube.com/watch?v=YOUR_VIDEO_ID." });
            setShowErrorPopup(true);
            return;
        }

        // if (!checkURL(values.vr_link)) {
        //     setErrors({ serverError: "Please Enter valid URL" });
        //     setShowErrorPopup(true);
        //     return;
        // }
        
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

        const uploadImageObj = Array.isArray(values.picture_img) ? values.picture_img.filter(item => item !== null) : [values.picture_img].filter(item => item !== null);
        
        if (values.video != null) {
            uploadImageObj.push(values.video);
        }
        //setLoading(true);
        setSucessMessage("Processing .........")
        const uploadImageUrl = await insertMultipleUploadImage("image", uploadImageObj);

     if (uploadImageUrl.files.length > 0) {
        const imageUrls  = [];
        let videoUrl = null;

        uploadImageUrl.files.forEach((file) => {
            if (file.mimeType.startsWith("image")) {
                imageUrls.push(file.url);
            } else if (file.mimeType.startsWith("video")) {
                videoUrl = file.url;
            }
        });

        const pictureUrl = imageUrls.join(", ");
        // console.log("Image URLs:", pictureUrl);
        // console.log("Video URL:", videoUrl);

            videoUrl = videoUrl || (values.video_link ? values.video_link : null);
        
            /********* create user ***********/
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
                latitude: isNaN(parseFloat(values.latitude)) ? String(propertyMapCoords.latitude) : String(values.latitude),
                longitude: isNaN(parseFloat(values.longitude)) ? String(propertyMapCoords.longitude) : String(values.longitude),
                transaction: values.transaction_type,
                type_id: values.property_type,
                size: parseInt(values.size_sqft) ?? 0,
                meta_details: selectedAmenities,
                currency_id: values.currency_id,
                project_id: values.project_id ?? null,
                address: values.address,
                direction: values.direction
            };

            // console.log("Property Data:", propertyData); 
            const createPropertyInfo = await insertData("api/property/create", propertyData, true);

            if (createPropertyInfo.status) {
                setSucessMessage(createPropertyInfo.message || "Property created successfully.");
                resetForm();
                router.push("/property-listing");
            } else {
                //setLoading(false);
                setErrors({ serverError: createPropertyInfo.message || "Failed to create property." });
                setShowErrorPopup(true);
            }
        } else {
           // setLoading(false);
            // console.log('File not uploaded');
            setErrorMessage('File not uploaded');
        }
    };

    const handleCheckboxChange = (key) => {
        setCheckedItems((prevState) => ({
            ...prevState,
            [key]: !prevState[key], // Toggle the checked state
        }));
    };
    const transactionType = [
        { id: 'sale', name: 'For Sale' },
        { id: 'rental', name: 'For Rental' },
    ];

    const directionType = [
        { id: 'north', name: 'North', },
        { id: 'south', name: 'South', },
        { id: 'east', name: 'East', },
        { id: 'west', name: 'West', },  
    ];
  
    // console.log(currencyList);
    const messageClass = (sucessMessage) ? "message success" : "message error";
	return (
		<>
            {loading?<Preloader />:

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
                    vr_link: "",
                    picture_img: [], // Set this to an empty array for multiple files
                    video: null, // Use `null` for file inputs
                    video_link: "", // Add this for YouTube video link
                    state_id: "",
                    city_id: "",
                    districts_id: "",
                    neighborhood_id: "",    
                    transaction_type: "",
                    property_type: "",
                    size_sqft: "",
                    direction:""
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
                                    <InputTextFields name="title_en" id="title_en" label="Title English:" required={true} />
                                    <InputTextFields name="title_fr" id="title_fr" label="Title French:" required={true} />
                                </div>
                                <div className="grid-1 box gap-30">
                                    <InputTextAreaFields name="description_en" id="description_en" label="Description English:" required={true} />
                                </div>
                                <div className="grid-1 box gap-30">
                                    <InputTextAreaFields name="description_fr" id="description_fr" label="Description French:" required={true} />
                                </div>
                            </div>
                            
                            <div className="widget-box-2">
                                <h6 className="title">Other Information</h6>
                                <div className="box grid-2 gap-30">
                                    <SelectOptionFields
                                        name="transaction_type"
                                        label="Transaction Type:"
                                        required={true}
                                        optionText="Select Transaction Type"
                                        onChange={(e) => {
                                            const selectedState = e.target.value;
                                            // console.log(selectedState);
                                            setFieldValue("transaction_type", selectedState);
                                        }}
                                        options={transactionType}
                                    />
               
                                    <SelectOptionFields
                                        name="property_type"
                                        label="Property Type:"
                                        required={true}
                                        optionText="Select Property Type"
                                        onChange={(e) => {
                                            const selectedState = e.target.value;
                                            // console.log(selectedState);
                                            setFieldValue("property_type", selectedState);
                                        }}
                                        options={propertyofTypesListing}
                                    />    
                                    {(userType === 'developer')?(       
                                        <SelectOptionFields
                                            name="project_id"
                                            label="Project Listing:"
                                            required={false}
                                            optionText="Select Project Listing"
                                            onChange={(e) => {
                                                const selectedState = e.target.value;
                                                // console.log(selectedState);
                                                setFieldValue("project_id", selectedState);
                                            }}
                                            options={projectOfListing}
                                        /> ):(<></>)}
                                </div>
                                <div className="box grid-3 gap-30">
                                    <InputPriceFields
                                        name="currency_id"
                                        label="Price:"
                                        required={true}
                                        value={currencyCode}
                                        optionText="Select Currency"
                                        onChange={(e) => {
                                            const selectedState = e.target.value;
                                            setCurrencyCode(selectedState);
                                            setFieldValue("currency_id", selectedState);
                                        }}
                                        options={currencyList}
                                        priceFieldName="price"
                                        priceFieldId="price"
                                    />
                                    <SelectOptionFields
                                        name="direction"
                                        label="Direction:"
                                        id="direction"
                                        required={false}
                                        optionText="Select Direction"
                                        onChange={(e) => {
                                            const selectedState = e.target.value;
                                            // console.log(selectedState);
                                            setFieldValue("direction", selectedState);
                                        }}
                                        options={directionType}
                                    />
                                    <InputNumberFields name="size_sqft" id="size_sqft" label="Size of SqMeter:" required={true} onChange={handleChange} />
                                </div>
                                <div className="box grid-3 gap-30">
                                        {projectOfNumberListing && projectOfNumberListing.length > 0 ? (
                                            projectOfNumberListing.map((project) => (
                                                <InputNumberFields 
                                                    name={project.id} 
                                                    id={project.id} 
                                                    label={project.name} 
                                                    required={false} 
                                                    onChange={(e) => 
                                                        handleNumberChange(project.id, e.target.value)
                                                    } 
                                                />
                                            ))
                                        ) : (
                                            <></>
                                        )}
                                </div>
                                <div className="box grid-2 box gap-30">
                                    <fieldset className="box-fieldset">
                                        <label htmlFor="picture_img">Picture Images:<span>*</span></label>
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
                                <div className="box grid-1 box gap-50">
                                    <fieldset className="box-fieldset">
                                        <label htmlFor="video_link">YouTube Link:</label>
                                        {/* YouTube Link Input Field */}
                                        <div>
                                        <Field
                                            type="text"
                                            name="video_link"
                                            className="form-control"
                                            placeholder="https://www.youtube.com/watch?v=QgAQcrvHsHQ"
                                        />
                                        </div>
                                    </fieldset>
                                </div>
                                <div className="box grid-1 box gap-50">
                                    <fieldset className="box-fieldset">
                                        <label htmlFor="vr_link">VR Link:</label>
                                        {/* YouTube Link Input Field */}
                                        <div>
                                        <Field
                                            type="text"
                                            name="vr_link"
                                            className="form-control"
                                            placeholder="https://www.google.com"
                                        />
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                            <div className="widget-box-2">
                                <h6 className="title">Location</h6>
                                <div className="box grid-4 gap-30">
                                    <SelectOptionFields
                                        name="state_id"
                                        label="State:"
                                        required={true}
                                        optionText="Select State"
                                        onChange={(e) => {
                                            // console.log('eeeeeeeee')
                                            const selectedState = e.target.value;
                                            setFieldValue("state_id", selectedState);
                                            handleStateChange(selectedState);
                                        }}
                                        options={stateList}
                                    />
                                    <SelectOptionFields
                                        name="city_id"
                                        label="Cities:"
                                        required={true}
                                        optionText="Select Cities"
                                        onChange={(e) => {
                                            const selectedState = e.target.value;
                                            setFieldValue("city_id", selectedState);
                                            handleCityChange(selectedState);
                                        }}
                                        options={cityList}
                                    />
                                    <SelectOptionFields
                                        name="districts_id"
                                        label="District:"
                                        required={true}
                                        optionText="Select District"
                                        onChange={(e) => {
                                            const selectedDistrict = e.target.value;
                                            setFieldValue("districts_id", selectedDistrict);
                                            handleDistrictChange(selectedDistrict);
                                        }}
                                        options={districtList}
                                    />
                                    <SelectOptionFields
                                        name="neighborhood_id"
                                        label="Neighborhood:"
                                        required={true}
                                        optionText="Select Neighborhood"
                                        onChange={(e) => {
                                            const selectedNeighborhood = e.target.value;
                                            setFieldValue("neighborhood_id", selectedNeighborhood);
                                            handleNeighborhoodChange(selectedNeighborhood);
                                        }}
                                        options={districtList}
                                    />
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
                            <button type="submit"  className="tf-btn primary"onClick={() => setShowErrorPopup(!showErrorPopup)} >Add Property</button>
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
			</LayoutAdmin ></>
            }
		</>
	)
}