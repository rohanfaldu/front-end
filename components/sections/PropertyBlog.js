import Link from "next/link";
import React, { useState, useEffect } from 'react';
import ModalLoginLike from "../common/ModelLoginLike";
import PercentageHeart from "../elements/PercentageHeart";
import { useTranslation } from "react-i18next";

export default function PropertyBlog(propertyData, slide, calsulation) {
    const propertySlide = slide ? "style-2" : "";
    console.log(propertyData, ">>>>>>>>>> property Data");
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [isLiked, setIsLiked] = useState(propertyData.data.like);
    const [percentage, setPercentage] = useState(propertyData.data.filter_result.total_percentage);
    const [isModelOpen, setIsModelOpen] = useState(false);
    const { t, i18n } = useTranslation();


    useEffect(() => {
        setPercentage(propertyData.data.filter_result.total_percentage)
    }, [propertyData]);

    const handleLike = async (isLiked, id, propertyPublisherId) => {
        const token = localStorage.getItem('token');

        if (!token) {
            setIsModelOpen(true);
            return;
        }

        try {
            if(!isLiked){
                const response = await fetch(`${API_URL}/api/property/like`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        propertyId: id,  // The property ID you are liking
                        propertyPublisherId: propertyPublisherId // The publisher ID
                    })
                });
            
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error:', errorData.message);
                    return;
                }
            
                const data = await response.json();
                console.log(data.message);
                setIsLiked(!isLiked);
            }else{
                const response = await fetch(`${API_URL}/api/property/${id}/like`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error:', errorData.message);
                    return;
                }
    
                const data = await response.json();
                console.log(data.message);
                setIsLiked(!isLiked);
            }
        } catch (error) {
            console.error('Error liking the property:', error);
        }
    };

    const [isLogin, setLogin] = useState(false)
    const [showLoginModal, setShowLoginModal] = useState(false)

    const handleLogin = () => {
        setLogin(!isLogin)
        !isLogin ? document.body.classList.add("modal-open") : document.body.classList.remove("modal-open")
    }

    const closeModal = () => {
        setIsModelOpen(false);
        setShowLoginModal(true);
    };

    const clickTwitter = () => {
        console.log('twitterUrl: ', propertyData.data);

        if (propertyData?.data?.user_twitter) {
            let twitterUrl = propertyData.data.user_twitter;
            console.log('twitterUrl: ', twitterUrl);
    
            // Ensure URL starts with "https://"
            if (!twitterUrl.startsWith("http")) {
                twitterUrl = `${twitterUrl}`;
            }
    
            console.log("Opening URL:", twitterUrl);
            window.open(twitterUrl, '_blank');
        } else {
            console.log("No Twitter URL available");
        }
    };

    const clickInstagram = () => {
        console.log('instagramUrl: ', propertyData.data);

        if (propertyData?.data?.user_instagram) {
            let instagramUrl = propertyData.data.user_instagram;
            console.log('instagramUrl: ', instagramUrl);
    
            // Ensure URL starts with "https://"
            if (!instagramUrl.startsWith("http")) {
                instagramUrl = `${instagramUrl}`;
            }
    
            console.log("Opening URL:", instagramUrl);
            window.open(instagramUrl, '_blank');
        } else {
            console.log("No Instagram URL available");
        }
        };

        const clickFacebook = () => {
            console.log('facebookUrl: ', propertyData.data);

            if (propertyData?.data?.user_facebook) {
                let facebookUrl = propertyData.data.user_facebook;
                console.log('facebookUrl: ', facebookUrl);
        
                // Ensure URL starts with "https://"
                if (!facebookUrl.startsWith("http")) {
                    facebookUrl = `${facebookUrl}`;
                }
        
                console.log("Opening URL:", facebookUrl);
                window.open(facebookUrl, '_blank');
            } else {
                console.log("No Facebook URL available");
            }
            };

    return (
        <>
            <div className="tinder-container">
                <div className={`homeya-box ${propertySlide}`} style={{marginBottom : "0px"}}>
                    <div className="archive-top">
                        <Link className="images-group" rel="noopener noreferrer" target="_blank" href={`/property/${propertyData.data.slug}-${percentage}`}>
                            <div className="images-style">
                                <img style={{height:"500px"}} src={(propertyData.data.picture[0]) ? propertyData.data.picture[0] : "/images/banner/no-banner.png"} alt="Property" />
                            </div>
                            <div className="top">
                                {propertyData.data.transaction && (
                                    <>
                                        <ul className="d-flex gap-8">
                                            {propertyData.data.transaction_type == 'rental' && (
                                                <li className={`flag-tag style-1}`}>
                                                    {t("rental")}
                                                </li>
                                            )}
                                            {propertyData.data.transaction_type == 'sale' && (
                                                <li className={`flag-tag style-1}`}>
                                                    {t("sale")}
                                                </li>
                                            )}
                                            
                                        </ul>
                                        {/* <ul className="d-flex gap-4">
                                            <li className={`${isLiked ? "liked" : "w-40 box-icon"}`}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    handleLike(isLiked, propertyData.data.id, propertyData.data.user_id);
                                                }}
                                            >
                                                <span className="icon icon-heart" />
                                            </li>
                                        </ul> */}
                                    </>
                                )}
                            </div>


                                <div className="middle">
                                    <div className="flag-tag style-2" style={{fontSize:"15px", textAlign:"left"}}>
                                        <Link href={`/property/${propertyData.data.slug}-${percentage}`} rel="noopener noreferrer" target="_blank" className="link" style={{color:"#fff"}}>
                                            {propertyData.data.title}
                                        </Link>
                                    </div>
                                    <div className="desc" style={{display:"flex",color:"#fff",paddingTop:"3%"}}>
                                        <i className="fs-16 icon icon-mapPin" />
                                        <p style={{fontSize:"16px"}}>{[propertyData.data?.district, propertyData.data?.city, propertyData.data?.state]
                                            .filter(Boolean)
                                            .join(', ')} </p>
                                    </div>
                                    <ul className="meta-list" style={{display:"flex",color:"#fff",paddingTop:"3%"}}>
                                        <li className="item" style={{fontSize:"24px",paddingRight:"25px"}}>
                                            <i className="icon icon-bed" />
                                            <span>{propertyData.data.bedRooms === "0" ? '0' : `${propertyData.data.bedRooms}`}</span>
                                        </li>
                                        <li className="item" style={{fontSize:"24px",paddingRight:"25px"}}>
                                            <i className="icon icon-bathtub" />
                                            <span>{propertyData.data.bathRooms === "0" ? '0' : `${propertyData.data.bathRooms}`}</span>
                                        </li>
                                        <li className="item" style={{fontSize:"24px",paddingRight:"25px"}}>
                                            <i className="icon icon-ruler" />
                                            <span>{propertyData.data.size === null ? '0' : `${propertyData.data.size}`}</span>
                                        </li>
                                    </ul>
                                    <div className="d-flex align-items-center" style={{paddingTop:"3%",paddingBottom:"3%"}}>
                                        <h6 style={{color:"#fff"}}>{propertyData.data.price + " " + propertyData.data.currency}</h6>
                                    </div>
                                    <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                                        <div style={{paddingTop:"3%", border:"1px solid #fff",borderRadius:"10px",padding:"3%", color:"#fff", display:"flex", alignItems:"center", width:"fit-content"}}>
                                            <div className="avatar avt-40 round">
                                                <img src={(propertyData.data.user_image) ? propertyData.data.user_image : "/images/avatar/user-image.png"} alt="Owner Avatar" />
                                            </div>
                                            <div style={{marginLeft:"5%", width:"200px"}}>
                                                <Link rel="noopener noreferrer" target="_blank" href={`/${propertyData.data.user_role}/${propertyData.data.user_id}`} style={{color:"#fff"}}>
                                                    {propertyData.data.user_name}
                                                </Link>
                                                {/* <span style={{cursor:"pointer"}} href={`/${propertyData.data.user_role}/${propertyData.data.user_id}`}>{propertyData.data.user_name}</span> */}
                                                <div className="owner-social">
                                                {propertyData.data.user_twitter != null&& 
                                                    <a className="social-link" style={{color:"#fff"}} onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    clickTwitter();
                                                    }}><i className="icon-twitter"></i></a>
                                                }

                                                {propertyData.data.user_instagram != null&& 
                                                    <a className="social-link" style={{color:"#fff"}} onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    clickInstagram();
                                                    }}><i className="icon-instagram"></i></a>
                                                }

                                                {propertyData.data.user_facebook != null&& 
                                                    <a href="#" className="social-link" style={{color:"#fff"}} onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    clickFacebook();
                                                    }}><i className="icon-facebook"></i></a>
                                                }
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ border:"1px solid #fff",borderRadius:"10px",padding:"3%", color:"#fff", display:"flex", alignItems:"center", width:"fit-content", padding:"5%"}}>
                                            <ul className="d-flex gap-4">
                                                <li style={{height:"40px", width:"40px", display:"flex", alignItems:"center", justifyContent:"center"}}
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                        handleLike(isLiked, propertyData.data.id, propertyData.data.user_id);
                                                    }}
                                                >
                                                    <PercentageHeart percentage={percentage} />
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            {/* <div className="content">
                                <div className="h7 text-capitalize fw-7">
                                    <Link href={`/property/${propertyData.data.slug}`} className="link">
                                        {propertyData.data.title}
                                    </Link>
                                </div>
                                <div className="desc">
                                    <i className="fs-16 icon icon-mapPin" />
                                    <p>{[propertyData.data?.district, propertyData.data?.city, propertyData.data?.state]
                                        .filter(Boolean)
                                        .join(', ')} </p>
                                </div>
                                <ul className="meta-list">
                                    <li className="item">
                                        <i className="icon icon-bed" />
                                        <span>{propertyData.data.bedRooms === "0" ? '-' : `${propertyData.data.bedRooms}`}</span>
                                    </li>
                                    <li className="item">
                                        <i className="icon icon-bathtub" />
                                        <span>{propertyData.data.bathRooms === "0" ? '-' : `${propertyData.data.bathRooms}`}</span>
                                    </li>
                                    <li className="item">
                                        <i className="icon icon-ruler" />
                                        <span>{propertyData.data.size === null ? '-' : `${propertyData.data.size}`}</span>
                                    </li>
                                </ul>
                            </div> */}


                            {/* <div className="bottom" style={{display:"flex", justifyContent:"space-between", width:"93%"}}>
                                <div>
                                    <span className="flag-tag style-2">{propertyData.data?.type_details?.title ? propertyData.data?.type_details?.title : propertyData.data.type}</span>
                                </div>
                                <div>
                                    <Link href={`/property/${propertyData.data.slug}-${percentage}`} className="link">
                                        <span className="flag-tag style-2" style={{fontSize:"25px"}}>&gt;&gt;&gt;</span>
                                    </Link>
                                </div>
                            </div> */}
                        </Link>



                        {/* <div className="content">
                            <div className="h7 text-capitalize fw-7">
                                <Link href={`/property/${propertyData.data.slug}`} className="link">
                                    {propertyData.data.title}
                                </Link>
                            </div>
                            <div className="desc">
                                <i className="fs-16 icon icon-mapPin" />
                                <p>{[propertyData.data?.district, propertyData.data?.city, propertyData.data?.state]
                                    .filter(Boolean)
                                    .join(', ')} </p>
                            </div>
                            <ul className="meta-list">
                                <li className="item">
                                    <i className="icon icon-bed" />
                                    <span>{propertyData.data.bedRooms === "0" ? '-' : `${propertyData.data.bedRooms}`}</span>
                                </li>
                                <li className="item">
                                    <i className="icon icon-bathtub" />
                                    <span>{propertyData.data.bathRooms === "0" ? '-' : `${propertyData.data.bathRooms}`}</span>
                                </li>
                                <li className="item">
                                    <i className="icon icon-ruler" />
                                    <span>{propertyData.data.size === null ? '-' : `${propertyData.data.size}`}</span>
                                </li>
                            </ul>
                        </div> */}



                    </div>
                    {/* <div className="archive-bottom d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-8 align-items-center">
                            <div className="avatar avt-40 round">
                                <img src={(propertyData.data.user_image) ? propertyData.data.user_image : "/images/avatar/user-image.png"} alt="Owner Avatar" />
                            </div>
                            <span>{propertyData.data.user_name}</span>
                        </div>
                        <div className="d-flex align-items-center">
                            <h6>{propertyData.data.price + " " + propertyData.data.currency}</h6>
                        </div>
                    </div> */}
                </div>
                <style jsx>{`
                .tinder-container {
                    position: relative;
                    width: 65%;
                    max-width: 600px;
                    margin: 0 auto;
                }
                .tinder-card {
                    position: absolute;
                    width: 100%;
                    cursor: pointer;
                    transform-origin: center;
                }
                .swipe-info {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 14px;
                    color: #888;
                }
                .homeya-box {
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    transition: transform 0.3s ease;
                }
                @media (max-width: 650px) {
                    .tinder-container {
                        width: 85%;
                    }
                }
                
            `}</style>

            </div>
            {isModelOpen && (
                <div className="modal" style={{ display: 'block', position: 'fixed', zIndex: 1000, top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-content" style={{ position: 'relative', margin: 'auto', padding: '20px', background: '#fff', borderRadius: '8px', maxWidth: '400px', top: '50%', transform: 'translateY(-50%)' }}>
                        <>
                            <h4>Login Alert</h4>
                            <p>Please login first!!!</p>
                            <div style={{ textAlign: 'end' }}>
                                <button className="tf-btn primary" onClick={() => {
                                    closeModal();
                                    setLogin(true)
                                }}>Login</button>
                                <button className="tf-btn primary" onClick={() => setIsModelOpen(false)} style={{ marginLeft: '15px' }}>Cancel</button>
                            </div>
                        </>
                    </div>
                </div>
            )}
            {showLoginModal && <ModalLoginLike isLogin={isLogin} handleLogin={handleLogin} />}


        </>
    );
}
