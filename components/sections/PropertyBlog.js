import Link from "next/link"
export default function PropertyBlog(propertyData, slide){
    const propertySlide = (slide)? "style-2": "";
    console.log(propertyData,">>>>>>>>> property Data");
    return (
        <>
            <div className={`homeya-box  ${propertySlide}`} >
                <div className="archive-top">
                    <Link href={`/property/${propertyData.data.slug}`} className="images-group">
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
                                </>
                            ) : (<></>)}
                        </div>
                        <div className="bottom">
                            <span className="flag-tag style-2">{(propertyData.data?.type_details?.title)?propertyData.data?.type_details?.title:propertyData.data.type}</span>
                        </div>
                    </Link>
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