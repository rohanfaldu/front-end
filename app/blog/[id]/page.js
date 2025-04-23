'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { insertData, insertImageData } from "../../../components/api/Axios/Helper";
// import moment from "moment";
import { useTranslation } from "react-i18next";
import Preloader from "@/components/elements/Preloader";

export default function BlogDetail() {
    const [loading, setLoading] = useState(true);
    // const [blogDetails, setBlogDetails] = useState([]);
    const [blogDetails, setBlogDetails] = useState({
        author: { image: '', name: '' }
    });

    const { t, i18n } = useTranslation();
    const params = useParams();
    const blogId = params.id;
    const router = useRouter();
    // Fetch data on component mount
    useEffect(() => {
        const fetchBlogDetails = async () => {
            setLoading(true); // Start loading
            try {
                const lang = i18n.language;
                const requestData = { slug: blogId, lang: lang };
                const response = await insertData(`api/blog/getbyid`, requestData, false);
                console.log('API Response:', response);

                if (response.status) {
                    setBlogDetails(response.data);
                    setLoading(false);
                } else {
                    console.log('Blog Detail Page API issue');
                    router.push("/");
                }
            } catch (err) {
                // Handle API errors
                console.log('Blog Detail Page Catch issue');
                router.push("/");
            } finally {
                setLoading(false); // Stop loading
            }
        };
        fetchBlogDetails();
    }, [i18n.language]);
    console.log(blogDetails, '>>>>>>>> Blog')
    return (
        <>
            {
                loading ?
                    <Preloader />
                    : (
                        <Layout headerStyle={1} footerStyle={1}>
                            <div>
                                <section className="flat-banner-blog">
                                    <img src={blogDetails.image} alt="banner-blog" />
                                </section>

                                <section className="flat-section-v2">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-lg-10 mx-auto">
                                                <div className="flat-blog-detail">
                                                    {/* <Link href="#" className="blog-tag primary">Architecture</Link> */}
                                                    <h3 className="text-capitalize">{blogDetails.title}</h3>
                                                    <div className="mt-12 d-flex align-items-center gap-16">
                                                        <div className="avatar avt-40 round">
                                                            <img
                                                                src={blogDetails?.author?.image}
                                                                alt={blogDetails?.author?.name}
                                                            />
                                                        </div>
                                                        <div className="post-author style-1">
                                                            <span>{blogDetails?.author?.name || 'Unknown Author'}</span>
                                                            <span>{new Date(blogDetails?.created_at).toLocaleDateString('en-US', {
                                                                month: 'long',
                                                                day: '2-digit',
                                                                year: 'numeric'
                                                            })}</span>
                                                        </div>
                                                    </div><br></br><br></br>
                                                    <div dangerouslySetInnerHTML={{ __html: blogDetails.description }} />

                                                    <div className="post-navigation">
                                                        {(blogDetails.previousBlog != null) ? (
                                                            <>
                                                                <div className="previous-post">
                                                                    <div className="subtitle">{t('previous')}</div>
                                                                    <a href={`/blog/${blogDetails.previousBlog.slug}`} className="h7 fw-7 text-black text-capitalize">{blogDetails.previousBlog.title}</a>
                                                                </div>
                                                            </>
                                                        ) : null}
                                                        {(blogDetails.nextBlog != null) ? (
                                                            <>
                                                                <div className="next-post">
                                                                    <div className="subtitle">{t('next')}</div>
                                                                    <a href={`/blog/${blogDetails.nextBlog.slug}`} className="h7 fw-7 text-black text-capitalize">{blogDetails.nextBlog.title}</a>
                                                                </div>
                                                            </>
                                                        ) : null}
                                                    </div>
                                                    {/* <div className="wrap-review">
                                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-20">
                                                <h6>03 Comments</h6>
                                                <div className="d-flex align-items-center gap-8">
                                                    <span>Sort By:</span>
                                                    <div className="box-select-1">
                                                        <select className="nice-select">

                                                            <option data-value={1} className="option selected">Newest</option>
                                                            <option data-value={2} className="option">Oldest</option>

                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul className="box-review">
                                                <li className="list-review-item">
                                                    <div className="avatar avt-60 round">
                                                        <img src="/images/avatar/avt-2.jpg" alt="avatar" />
                                                    </div>
                                                    <div className="content">
                                                        <div className="name h7 fw-7 text-black">Viola Lucas
                                                            <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M0 8C0 12.4112 3.5888 16 8 16C12.4112 16 16 12.4112 16 8C16 3.5888 12.4112 0 8 0C3.5888 0 0 3.5888 0 8ZM12.1657 6.56569C12.4781 6.25327 12.4781 5.74673 12.1657 5.43431C11.8533 5.1219 11.3467 5.1219 11.0343 5.43431L7.2 9.26863L5.36569 7.43431C5.05327 7.12189 4.54673 7.12189 4.23431 7.43431C3.9219 7.74673 3.9219 8.25327 4.23431 8.56569L6.63432 10.9657C6.94673 11.2781 7.45327 11.2781 7.76569 10.9657L12.1657 6.56569Z" fill="#198754" />
                                                            </svg>
                                                        </div>
                                                        <span className="mt-4 d-inline-block  date body-3 text-variant-2">August 13,
                                                            2023</span>
                                                        <ul className="mt-8 list-star">
                                                            <li className="icon-star" />
                                                            <li className="icon-star" />
                                                            <li className="icon-star" />
                                                            <li className="icon-star" />
                                                            <li className="icon-star" />
                                                        </ul>
                                                        <p className="mt-12 body-2 text-black">It's really easy to use and it is
                                                            exactly what I am looking for. A lot of good looking templates &amp;
                                                            it's highly customizable. Live support is helpful, solved my issue
                                                            in no time.</p>
                                                        <span className="d-inline-block mt-12 reply text-variant-1 fw-7">Reply</span>
                                                    </div>
                                                </li>
                                                <li className="list-review-item">
                                                    <div className="avatar avt-60 round">
                                                        <img src="/images/avatar/avt-3.jpg" alt="avatar" />
                                                    </div>
                                                    <div className="content">
                                                        <div className="name h7 fw-7 text-black">Viola Lucas
                                                            <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M0 8C0 12.4112 3.5888 16 8 16C12.4112 16 16 12.4112 16 8C16 3.5888 12.4112 0 8 0C3.5888 0 0 3.5888 0 8ZM12.1657 6.56569C12.4781 6.25327 12.4781 5.74673 12.1657 5.43431C11.8533 5.1219 11.3467 5.1219 11.0343 5.43431L7.2 9.26863L5.36569 7.43431C5.05327 7.12189 4.54673 7.12189 4.23431 7.43431C3.9219 7.74673 3.9219 8.25327 4.23431 8.56569L6.63432 10.9657C6.94673 11.2781 7.45327 11.2781 7.76569 10.9657L12.1657 6.56569Z" fill="#198754" />
                                                            </svg>
                                                        </div>
                                                        <span className="mt-4 d-inline-block  date body-3 text-variant-2">August 13,
                                                            2023</span>
                                                        <ul className="mt-8 list-star">
                                                            <li className="icon-star" />
                                                            <li className="icon-star" />
                                                            <li className="icon-star" />
                                                            <li className="icon-star" />
                                                            <li className="icon-star" />
                                                        </ul>
                                                        <p className="mt-12 body-2 text-black">It's really easy to use and it is
                                                            exactly what I am looking for. A lot of good looking templates &amp;
                                                            it's highly customizable. Live support is helpful, solved my issue
                                                            in no time.</p>
                                                        <span className="d-inline-block mt-12 reply text-variant-1 fw-7">Reply</span>
                                                    </div>
                                                </li>
                                                <li className="list-review-item">
                                                    <div className="avatar avt-60 round">
                                                        <img src="/images/avatar/avt-4.jpg" alt="avatar" />
                                                    </div>
                                                    <div className="content">
                                                        <div className="name h7 fw-7 text-black">Darlene Robertson
                                                            <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M0 8C0 12.4112 3.5888 16 8 16C12.4112 16 16 12.4112 16 8C16 3.5888 12.4112 0 8 0C3.5888 0 0 3.5888 0 8ZM12.1657 6.56569C12.4781 6.25327 12.4781 5.74673 12.1657 5.43431C11.8533 5.1219 11.3467 5.1219 11.0343 5.43431L7.2 9.26863L5.36569 7.43431C5.05327 7.12189 4.54673 7.12189 4.23431 7.43431C3.9219 7.74673 3.9219 8.25327 4.23431 8.56569L6.63432 10.9657C6.94673 11.2781 7.45327 11.2781 7.76569 10.9657L12.1657 6.56569Z" fill="#198754" />
                                                            </svg>
                                                        </div>
                                                        <span className="mt-4 d-inline-block  date body-3 text-variant-2">August 13, 2023</span>
                                                        <ul className="mt-8 list-star">
                                                            <li className="icon-star" />
                                                            <li className="icon-star" />
                                                            <li className="icon-star" />
                                                            <li className="icon-star" />
                                                            <li className="icon-star" />
                                                        </ul>
                                                        <p className="mt-12 body-2 text-black">It's really easy to use and it is
                                                            exactly what I am looking for. A lot of good looking templates &amp;
                                                            it's highly customizable. Live support is helpful, solved my issue
                                                            in no time.</p>
                                                        <span className="d-inline-block mt-12 reply text-variant-1 fw-7">Reply</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="wrap-form-comment">
                                            <h6>Leave A comment</h6>
                                            <div id="comments" className="comments">
                                                <div className="respond-comment">
                                                    <form method="post" id="contactform" className="comment-form form-submit" action="./contact/contact-process.php" acceptCharset="utf-8" noValidate="novalidate">
                                                        <div className="form-wg group-ip">
                                                            <fieldset>
                                                                <label className="sub-ip">Name</label>
                                                                <input type="text" className="form-control" name="text" placeholder="Your name" required />
                                                            </fieldset>
                                                            <fieldset>
                                                                <label className="sub-ip">Email</label>
                                                                <input type="email" className="form-control" name="email" placeholder="Your email" required />
                                                            </fieldset>
                                                        </div>
                                                        <fieldset className="form-wg d-flex align-items-center gap-8">
                                                            <input type="checkbox" className="tf-checkbox" id="cb-ip" />
                                                            <label htmlFor="cb-ip" className="text-black text-checkbox">Save your name, email for the next time review </label>
                                                        </fieldset>
                                                        <fieldset className="form-wg">
                                                            <label className="sub-ip">Review</label>
                                                            <textarea id="comment-message" name="message" rows={4} tabIndex={4} placeholder="Write comment " aria-required="true" defaultValue={""} />
                                                        </fieldset>
                                                        <button className="form-wg tf-btn primary" name="submit" type="submit">
                                                            <span>Post Comment</span>
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                {/*End Section Blog Detail */}
                                {/* Section Latest Post */}
                                {/* <section className="flat-section flat-latest-post">
                                        <div className="container">
                                            <div className="box-title-relatest text-center">
                                                <div className="text-subheading text-primary">Relatest Post</div>
                                                <h5 className="mt-4">News insight</h5>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-4 col-md-6">
                                                    <Link href="/blog-detail" className="flat-blog-item hover-img">
                                                        <div className="img-style">
                                                            <img src="/images/blog/blog-1.jpg" alt="img-blog" />
                                                            <span className="date-post">January 28, 2024</span>
                                                        </div>
                                                        <div className="content-box">
                                                            <div className="post-author">
                                                                <span className="fw-7">Esther</span>
                                                                <span>Furniture</span>
                                                            </div>
                                                            <h6 className="title">Building gains into housing stocks and how to trade the sector</h6>
                                                            <p className="description">The average contract interest rate for 30-year fixed-rate mortgages with conforming loan balances...</p>
                                                        </div>
                                                    </Link>
                                                </div>
                                                <div className="col-lg-4 col-md-6">
                                                    <Link href="/blog-detail" className="flat-blog-item hover-img">
                                                        <div className="img-style">
                                                            <img src="/images/blog/blog-2.jpg" alt="img-blog" />
                                                            <span className="date-post">January 31, 2024</span>
                                                        </div>
                                                        <div className="content-box">
                                                            <div className="post-author">
                                                                <span className="fw-7">Angel</span>
                                                                <span>Interior</span>
                                                            </div>
                                                            <h6 className="title">92% of millennial homebuyers say inflation has impacted their plans</h6>
                                                            <p className="description">Mortgage applications to purchase a home, however, dropped 4% last week compared...</p>
                                                        </div>
                                                    </Link>
                                                </div>
                                                <div className="col-lg-4 col-md-6">
                                                    <Link href="/blog-detail" className="flat-blog-item hover-img">
                                                        <div className="img-style">
                                                            <img src="/images/blog/blog-3.jpg" alt="img-blog" />
                                                            <span className="date-post">January 28, 2024</span>
                                                        </div>
                                                        <div className="content-box">
                                                            <div className="post-author">
                                                                <span className="fw-7">Colleen</span>
                                                                <span>Architecture</span>
                                                            </div>
                                                            <h6 className="title">We are hiring ‘moderately,’ says Compass CEO</h6>
                                                            <p className="description">New listings were down 20% year over year in March, according to Realtor.com, and total inventory...</p>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </section> */}
                            </div>
                        </Layout >
                    )}
        </>
    )
}