import Link from "next/link"
import { useTranslation } from "react-i18next";

export default function ProjectBlog(projectData, slide){
    const propertySlide = (slide)? "style-2": "";
        const { t, i18n } = useTranslation();
    return (
        <>
            <div className="homeya-box">
												<div className="archive-top">
													<Link
														href={`/project/${projectData.data.slug}`}
														className="images-group"
													>

														<div className="images-style">
															<img
																src={projectData.data.picture[0] || "/images/banner/no-banner.png"}
																alt={projectData.data.name}
															/>
														</div>
														<div className="top">
															<ul className="d-flex gap-8">
																{projectData.data.isFeatured && (
																	<li className="flag-tag success">Featured</li>
																)}
															</ul>
														</div>
														<div className="bottom">
															<span className="flag-tag style-2">
															</span>
														</div>
													</Link>
													<div className="content">
														<div className="h7 text-capitalize fw-7">
															<Link
																href={`/project/${projectData.data.slug}`}
																className="link"
															>
																{projectData.data.title}
															</Link>
														</div>
														<div className="desc">
															<i className="fs-16 icon icon-mapPin" />
															<p>
																{[ projectData.data?.district, projectData.data?.city, projectData.data?.state]
																	.filter(Boolean)
																	.join(', ')} </p>

														</div>
													</div>
												</div>
												<div className="archive-bottom d-flex justify-content-between align-items-center">
													<div className="d-flex gap-8 align-items-center">
														<div className="avatar avt-40 round">
															<img
																src={projectData.data.user_image || '/images/avatar/user-image.png'}
																alt={projectData.data.agent?.name || 'Agent'}
															/>
														</div>
														<span>{projectData.data.user_name || 'Unknown Agent'}</span>
													</div>
													<div className="d-flex align-items-center">
														<h6>{t('from')} {projectData.data.price || '0.00'} {projectData.data.currency || 'USD'} </h6>
													</div>
												</div>
											</div>
        </>
    )
}