import Link from "next/link";
import React, { useState, useEffect } from 'react';
import ModalLogin from "../common/ModalLogin";

export default function PropertyBlog(propertyData, slide, calsulation) {
    const propertySlide = slide ? "style-2" : "";
    console.log(propertyData, ">>>>>>>>>> property Data");
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [isLiked, setIsLiked] = useState(propertyData.data.like);
    const [percentage, setPercentage] = useState(propertyData.data.filter_result.total_percentage);
    const [isModelOpen, setIsModelOpen] = useState(false);


    useEffect(() => {
        setPercentage(propertyData.data.filter_result.total_percentage)
    }, [propertyData]);

    const handleLike = async (isLiked, id) => {
        const token = localStorage.getItem('token');

        if (!token) {
            setIsModelOpen(true);
            return;
        }

        try {
            const method = isLiked ? 'DELETE' : 'POST';
            const response = await fetch(`${API_URL}/api/property/${id}/like`, {
                method,
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
        } catch (error) {
            console.error('Error liking the property:', error);
        }
    };

    const [isLogin, setLogin] = useState(false)
    const [showLoginModal, setShowLoginModal] = useState(false)

    const handleLogin = () => {
        console.log(isLogin,"///////////////////////////")
        setLogin(!isLogin)
        !isLogin ? document.body.classList.add("modal-open") : document.body.classList.remove("modal-open")
    }

    const closeModal = () => {
        setIsModelOpen(false);
        setShowLoginModal(true);
    };

    return (
        <>
            <div className="tinder-container">
                <div className={`homeya-box ${propertySlide}`}>
                    <div className="archive-top">
                        <div className="images-group" href={`/property/${propertyData.data.slug}`}>
                            <div className="images-style">
                                <img src={(propertyData.data.picture[0]) ? propertyData.data.picture[0] : "/images/banner/no-banner.png"} alt="Property" />
                            </div>
                            <div className="top">
                                {propertyData.data.transaction && (
                                    <>
                                        <ul className="d-flex gap-8">
                                            <li className={`flag-tag style-1}`}>
                                                {propertyData.data.transaction}
                                            </li>
                                        </ul>
                                        <ul className="d-flex gap-4">
                                            <li className={`${isLiked ? "liked" : "w-40 box-icon"}`}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    handleLike(isLiked, propertyData.data.id);
                                                }}
                                            >
                                                <span className="icon icon-heart" />
                                            </li>
                                            {
                                                (propertyData.calsulation) ?
                                                    <li className="box-icon">
                                                        <span className="icon icon-vf" style={{ fontSize: "15px", padding: "10px", color: "#ffffff" }}>{percentage}%</span>
                                                    </li>
                                                    :
                                                    ""
                                            }
                                        </ul>
                                    </>
                                )}
                            </div>
                            <div className="bottom">
                                <span className="flag-tag style-2">{propertyData.data?.type_details?.title ? propertyData.data?.type_details?.title : propertyData.data.type}</span>
                            </div>
                        </div>
                        <div className="content">
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
                        </div>
                    </div>
                    <div className="archive-bottom d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-8 align-items-center">
                            <div className="avatar avt-40 round">
                                <img src={(propertyData.data.user_image) ? propertyData.data.user_image : "/images/avatar/user-image.png"} alt="Owner Avatar" />
                            </div>
                            <span>{propertyData.data.user_name}</span>
                        </div>
                        <div className="d-flex align-items-center">
                            <h6>{propertyData.data.price + " " + propertyData.data.currency}</h6>
                        </div>
                    </div>
                </div>
                <style jsx>{`
                .tinder-container {
                    position: relative;
                    width: 50%;
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
            {showLoginModal && <ModalLogin isLogin={isLogin} handleLogin={handleLogin} />}


        </>
    );
}
