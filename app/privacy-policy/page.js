'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useState } from "react"
export default function PrivacyPolicy() {
	const [isTab, setIsTab] = useState(1)
	const [isVisible, setIsVisible] = useState(true)
	const handleTab = (i) => {
		setIsTab(i)
		setIsVisible(false)
		setTimeout(() => {
			setIsVisible(true)
		}, 200)
	}
	return (
		<>

			<Layout headerStyle={1} footerStyle={1} breadcrumbTitle="Privacy Policy">
				<section className="flat-section">
					<div className="container">
						<div className="row">
							<div className="col-lg-5">
								<ul className="nav-tab-privacy" role="tablist">
									{/* <li className="nav-tab-item" onClick={() => handleTab(1)}>
										<a className={isTab == 1 ? "nav-link-item active" : "nav-link-item"} data-bs-toggle="tab">1. Terms of Service </a>
									</li> */}
									<li className="nav-tab-item" onClick={() => handleTab(2)}>
										<a className={isTab == 1 ? "nav-link-item active" : "nav-link-item"} data-bs-toggle="tab">1. Privacy Policy</a>
									</li>
								</ul>
							</div>
							<div className="col-lg-7">
								<h5 className="text-capitalize title">Privacy policy</h5>
								<div className="tab-content content-box-privacy">
									<div className={isTab == 1 ? "tab-pane fade show active" : "tab-pane fade"} id="terms" role="tabpanel">
										{/* <p>Welcome to GET immofind! By downloading, accessing, or using our application (“App GET immofind”), 
										you agree to comply with and be bound by these Terms of Service (“Terms”). If you do not agree 
										to these Terms, please do not use our App. </p><br/>
										<ol>
											<li>
												<h5>Acceptance of Terms</h5>
												<p>By using GET immofind, you agree to these Terms and any additional terms and conditions we may 
													provide in the future. You must be at least 18 years old to use the App.</p>
											</li>
											<li>
												<h5>Description of the Service</h5>
												<p>GET immofind is a mobile referral platform that allows users to earn rewards by referring others to partner businesses. The availability of rewards is subject to change without notice and is governed by specific referral program terms. </p>
											</li>
											<li>
												<h5>User Responsibilities</h5>
												<ul><br/>

												<li> Provide accurate, up-to-date information during registration.</li> 
												
												<li>Use the App in compliance with all applicable laws and regulations.</li> 
												<li>Not engage in fraudulent or unethical practices, including creating fake accounts, exploiting bugs, or sharing false referrals. </li> </ul>

											</li><br/>

											<li>
												<h5>Reward System</h5>
												<ul><br/>

													<li>Rewards are issued in accordance with the terms of specific referral campaigns.</li> 
													
													<li>GET immofind reserves the right to withhold or revoke rewards in cases of suspected 
														fraud or misuse.</li> 
													<li>Rewards are non-transferable and cannot be exchanged, unless explicitly 
														stated.</li>
												</ul>

											</li><br/>
											<li> <h5>Intellectual Property </h5>
												<p>All content, trademarks, and materials within the App are the property of GET immofind or its 
												licensors. You may not copy, modify, or distribute any App content without our explicit 
												permission.</p>
											</li><br/>
											<li> <h5>Termination </h5>
												<p>We may suspend or terminate your account at any time for violating these Terms or engaging in 
													fraudulent activity.</p>
											</li>
											<li> <h5>Limitation of Liability  </h5>
												<p>GET immofind is not liable for indirect, incidental, or consequential damages resulting from your use 
													of the App. </p>
											</li><br/>
									
											<li> <h5>Changes to Terms</h5>
												<p>We may update these Terms from time to time. Continued use of the App constitutes acceptance of the revised Terms. For questions, contact us at immofindmaroc@gmail.com. </p>
											</li>
										</ol> */}
										<p>
											Your privacy is important to us. This Privacy Policy explains how GET immofind (we, our, or us) 
											collects, uses, and shares your information when you use our App </p><br/>
											<ol>
											<li>  <h5>Information We Collect </h5>
												<ul>
													<li>Personal Information: Name, email address, phone number, and payment 
														details provided during registration. </li>
														<li>Usage Data: Information about how you interact with the App, including device 
															information and referral activity.</li>
															<li>Location Data (if enabled): To personalize services and offers. </li>
												</ul>
											</li><br/>
											<li> <h5>How We Use Your Information </h5>
												<ul><br/>
													<dt>We use the information we collect to: </dt><br/>
												<li>Operate, improve, and personalize the App. </li>
												<li>Process referrals and rewards.</li>
												<li>Communicate updates, promotional offers, and changes to our services. </li>
												<li>Ensure compliance with our Terms of Service. </li>
											</ul>
											</li>
											<br/>
											<li> <h5>Sharing Your Information</h5> 
												<ul><br/>
													<dt>We may share your information with: </dt><br/>
												<li>Partner Businesses: To process your referrals and rewards. </li>
												<li>Service Providers: For analytics, payment processing, and App functionality. </li>
												<li>Communicate updates, promotional offers, and changes to our services. </li>
												
											</ul>
											</li><br/>
											<li> <h5>Data Security</h5>
												<p>We take reasonable measures to protect your data. However, no method of electronic 
													transmission or storage is 100% secure.</p>
											</li>
											<br/>
											<li>  <h5>Your Rights</h5>
												<ul><br/>
													<dt>Depending on your jurisdiction, you may have the right to:</dt><br/>
												<li>Access, correct, or delete your data.  </li>
												<li>Withdraw consent for data processing.  </li>
												<li>Opt-out of marketing communications. </li>
												
											</ul>
											</li><br/>
											<li> <h5>Cookies and Tracking</h5> 
												<p>We may use cookies and similar technologies to improve your user experience. You can manage 
													cookies through your device settings. </p>
											</li><br/>
											<li>  <h5>Third-Party Links</h5>
												<p>Our App may contain links to third-party websites or services. We are not responsible for their 
													privacy practices.  </p>
											</li><br/>
											<li>  <h5>Changes to this Policy </h5>
												<p>We may update this Privacy Policy periodically. We will notify you of significant changes via the 
													App or email.   </p>
											</li><br/>
											<li> <h5>Contact Us</h5>
												<p>If you have questions or concerns about this Privacy Policy, contact us at immofindmaroc@gmail.com.   </p>
											</li><br/>
										</ol>
									</div>
									<div className={isTab == 2 ? "tab-pane fade show active" : "tab-pane fade"} id="limitations" role="tabpanel">
										<p>
											Your privacy is important to us. This Privacy Policy explains how GET immofind (“we,” “our,” or “us”) 
											collects, uses, and shares your information when you use our App </p><br/>
											<ol>
											<li>  <h5>Information We Collect </h5>
												<ul>
													<li>Personal Information: Name, email address, phone number, and payment 
														details provided during registration. </li>
														<li>Usage Data: Information about how you interact with the App, including device 
															information and referral activity.</li>
															<li>Location Data (if enabled): To personalize services and offers. </li>
												</ul>
											</li><br/>
											<li> <h5>How We Use Your Information </h5>
												<ul><br/>
													<dt>We use the information we collect to: </dt><br/>
												<li>Operate, improve, and personalize the App. </li>
												<li>Process referrals and rewards.</li>
												<li>Communicate updates, promotional offers, and changes to our services. </li>
												<li>Ensure compliance with our Terms of Service. </li>
											</ul>
											</li>
											<br/>
											<li> <h5>Sharing Your Information</h5> 
												<ul><br/>
													<dt>We may share your information with: </dt><br/>
												<li>Partner Businesses: To process your referrals and rewards. </li>
												<li>Service Providers: For analytics, payment processing, and App functionality. </li>
												<li>Communicate updates, promotional offers, and changes to our services. </li>
												
											</ul>
											</li><br/>
											<li> <h5>Data Security</h5>
												<p>We take reasonable measures to protect your data. However, no method of electronic 
													transmission or storage is 100% secure.</p>
											</li>
											<br/>
											<li>  <h5>Your Rights</h5>
												<ul><br/>
													<dt>Depending on your jurisdiction, you may have the right to:</dt><br/>
												<li>Access, correct, or delete your data.  </li>
												<li>Withdraw consent for data processing.  </li>
												<li>Opt-out of marketing communications. </li>
												
											</ul>
											</li><br/>
											<li> <h5>Cookies and Tracking</h5> 
												<p>We may use cookies and similar technologies to improve your user experience. You can manage 
													cookies through your device settings. </p>
											</li><br/>
											<li>  <h5>Third-Party Links</h5>
												<p>Our App may contain links to third-party websites or services. We are not responsible for their 
													privacy practices.  </p>
											</li><br/>
											<li>  <h5>Changes to this Policy </h5>
												<p>We may update this Privacy Policy periodically. We will notify you of significant changes via the 
													App or email.   </p>
											</li><br/>
											<li> <h5>Contact Us</h5>
												<p>If you have questions or concerns about this Privacy Policy, contact us at immofindmaroc@gmail.com.</p>
											</li><br/>
										</ol>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

			</Layout>
		</>
	)
}