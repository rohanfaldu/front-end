import Link from "next/link"
import React, { useState } from 'react';
export default function PropertyBlog(propertyData, slide){
    const propertySlide = (slide)? "style-2": "";
    console.log(propertyData,">>>>>>>>> property Data");

    const [isLiked, setIsLiked] = useState(propertyData.data.like);
    const handleLike = async (isLiked, id) => {
        if (isLiked) {
            try {
                const token = localStorage.getItem('token');
    
                const response = await fetch(`http://localhost:7000/api/property/${id}/like`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
    
                if (!response.status) {
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
        } else {
            try {
                const token = localStorage.getItem('token');
    
                const response = await fetch(`http://localhost:7000/api/property/${id}/like`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
    
                if (!response.status) {
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
        }
    };

    

    return (
        <>
            <div className={`homeya-box  ${propertySlide}`} >
                <div className="archive-top">
                    <div className="images-group">
                        <div className="images-style">
                            <img src={(propertyData.data.picture[0])?propertyData.data.picture[0]:"/images/banner/no-banner.png"} alt="Property" /> 
                        </div>
                        <div className="top">
                            {propertyData.data.transaction ? (
                                <>
                                    <ul className="d-flex gap-8">
                                        <li className={`flag-tag style-1}`}>
                                            {propertyData.data.transaction}
                                        </li>
                                    </ul>
                                    <ul className="d-flex gap-4">
										<li className="box-icon w-40">
											<span className="icon icon-heart" />
										</li>
                                        <li
                                            className={`${isLiked ? "liked" : "w-40 box-icon"}`}
                                            onClick={() => handleLike(isLiked, propertyData.data.id)}
                                        >
                                            <img
                                                src={'/images/logo/thumbs-up.svg'}
                                                className="icon"
                                                style={{ height: "24px" }}
                                            />
                                        </li>

									</ul>
                                </>
                            ) : (<></>)}
                        </div>
                        <div className="bottom">
                            <span className="flag-tag style-2">{(propertyData.data?.type_details?.title)?propertyData.data?.type_details?.title:propertyData.data.type}</span>
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
                            <img src={(propertyData.data.user_image)?propertyData.data.user_image:"/images/avatar/user-image.png"} alt="Owner Avatar" /> 
                        </div>
                        <span>{propertyData.data.user_name}</span>
                    </div>
                    <div className="d-flex align-items-center">
                        <h6>{propertyData.data.price + " " + propertyData.data.currency}</h6>
                    </div>
                </div>
            </div>
        </>
    )
}