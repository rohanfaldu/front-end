'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { insertData, insertImageData } from "../../../components/api/Axios/Helper";
import { useTranslation } from "react-i18next";
import Preloader from "@/components/elements/Preloader";

export default function BlogDetail() {
    const [loading, setLoading] = useState(true);
    const [blogDetails, setBlogDetails] = useState({
        author: { image: '', name: '' }
    });

    const { t, i18n } = useTranslation();
    const params = useParams();
    const blogId = params.id;
    const router = useRouter();
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
                                    <div className="banner-container">
                                        <img src={blogDetails.image} alt="banner-blog" />
                                        <div className="link back-btn">
                                            <button
                                                className="form-wg tf-btn primary"
                                                type="button"
                                                onClick={() => router.back()}
                                                style={{ margin: "30px" }}
                                            >
                                                <span style={{ color: "#fff" }}>&lt; {t('back')}</span>
                                            </button>
                                        </div>
                                    </div>
                                </section>


                                <section className="flat-section-v2">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-lg-10 mx-auto">
                                                <div className="flat-blog-detail">
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
                                                  
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                {/*End Section Blog Detail */}
                               
                            </div>
                        </Layout >
                    )}
        </>
    )
}