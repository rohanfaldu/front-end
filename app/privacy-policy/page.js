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
										<p>Last updated: February 20, 2025</p>
                            <p>This Privacy Policy describes Our policies and procedures on the collection, use and
                                disclosure of Your information when You use the Service and tells You about Your privacy
                                rights and how the law protects You.</p>
                            <p>We use Your Personal data to provide and improve the Service. By using the Service, You
                                agree to the collection and use of information in accordance with this Privacy Policy.
                            </p>

							<h3>Interpretation and Definitions</h3>

                                    <h5>Interpretation</h5>
                                    <p>The words of which the initial letter is capitalized have meanings defined under
                                        the following conditions. The following definitions shall have the same meaning
                                        regardless of whether they appear in singular or in plural.</p>

                                    <h5>Definitions</h5>
                                    <p>For the purposes of this Privacy Policy:</p>

									<ul>
                                        <li><strong>Account</strong> means a unique account created for You to access
                                            our Service or parts of our Service.</li>
                                        <li><strong>Affiliate</strong> means an entity that controls, is controlled by
                                            or is under common control with a party, where "control" means ownership of
                                            50% or more of the shares, equity interest or other securities entitled to
                                            vote for election of directors or other managing authority.</li>
                                        <li><strong>Application</strong> refers to immofind, the software program
                                            provided by the Company.</li>
                                        <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or
                                            "Our" in this Agreement) refers to immofind.</li>
                                        <li><strong>Cookies</strong> are small files that are placed on Your computer,
                                            mobile device or any other device by a website, containing the details of
                                            Your browsing history on that website among its many uses.</li>
                                        <li><strong>Country</strong> refers to: Morocco</li>
                                        <li><strong>Device</strong> means any device that can access the Service such as
                                            a computer, a cellphone or a digital tablet.</li>
                                        <li><strong>Personal Data</strong> is any information that relates to an
                                            identified or identifiable individual.</li>
                                        <li><strong>Service</strong> refers to the Application or the Website or both.
                                        </li>
                                        <li><strong>Service Provider</strong> means any natural or legal person who
                                            processes the data on behalf of the Company. It refers to third-party
                                            companies or individuals employed by the Company to facilitate the Service,
                                            to provide the Service on behalf of the Company, to perform services related
                                            to the Service or to assist the Company in analyzing how the Service is
                                            used.</li>
                                        <li><strong>Third-party Social Media Service</strong> refers to any website or
                                            any social network website through which a User can log in or create an
                                            account to use the Service.</li>
                                        <li><strong>Usage Data</strong> refers to data collected automatically, either
                                            generated by the use of the Service or from the Service infrastructure
                                            itself (for example, the duration of a page visit).</li>
                                        <li><strong>Website</strong> refers to immofind, accessible from
                                            https://immofind.ma/</li>
                                        <li><strong>You</strong> means the individual accessing or using the Service, or
                                            the company, or other legal entity on behalf of which such individual is
                                            accessing or using the Service, as applicable.</li>
                                    </ul>

									<h3>Collecting and Using Your Personal Data</h3>

<h5>Types of Data Collected</h5>

<h6>Personal Data</h6>
<p>While using Our Service, We may ask You to provide Us with certain personally
	identifiable information that can be used to contact or identify You. Personally
	identifiable information may include, but is not limited to:</p>
<ul>
	<li>Email address</li>
	<li>First name and last name</li>
	<li>Phone number</li>
	<li>Address, State, Province, ZIP/Postal code, City</li>
	<li>Usage Data</li>
</ul>

<h6>Usage Data</h6>
                                    <p>Usage Data is collected automatically when using the Service.</p>
                                    <p>Usage Data may include information such as Your Device's Internet Protocol
                                        address (e.g. IP address), browser type, browser version, the pages of our
                                        Service that You visit, the time and date of Your visit, the time spent on those
                                        pages, unique device identifiers and other diagnostic data.</p>
                                    <p>When You access the Service by or through a mobile device, We may collect certain
                                        information automatically, including, but not limited to, the type of mobile
                                        device You use, Your mobile device unique ID, the IP address of Your mobile
                                        device, Your mobile operating system, the type of mobile Internet browser You
                                        use, unique device identifiers and other diagnostic data.</p>
                                    <p>We may also collect information that Your browser sends whenever You visit our
                                        Service or when You access the Service by or through a mobile device.</p>

                                    <h6>Information from Third-Party Social Media Services</h6>
                                    <p>The Company allows You to create an account and log in to use the Service through
                                        the following Third-party Social Media Services:</p>
                                    <ul>
                                        <li>Google</li>
                                        <li>Facebook</li>
                                        <li>Instagram</li>
                                        <li>Twitter</li>
                                        <li>LinkedIn</li>
                                    </ul>
                                    <p>If You decide to register through or otherwise grant us access to a Third-Party
                                        Social Media Service, We may collect Personal data that is already associated
                                        with Your Third-Party Social Media Service's account, such as Your name, Your
                                        email address, Your activities or Your contact list associated with that
                                        account.</p>
                                    <p>You may also have the option of sharing additional information with the Company
                                        through Your Third-Party Social Media Service's account. If You choose to
                                        provide such information and Personal Data, during registration or otherwise,
                                        You are giving the Company permission to use, share, and store it in a manner
                                        consistent with this Privacy Policy.</p>

                                    <h6>Information Collected while Using the Application</h6>
                                    <p>While using Our Application, in order to provide features of Our Application, We
                                        may collect, with Your prior permission:</p>
                                    <ul>
                                        <li>Information regarding your location</li>
                                        <li>Pictures and other information from your Device's camera and photo library
                                        </li>
                                    </ul>
                                    <p>We use this information to provide features of Our Service, to improve and
                                        customize Our Service. The information may be uploaded to the Company's servers
                                        and/or a Service Provider's server or it may be simply stored on Your device.
                                    </p>
                                    <p>You can enable or disable access to this information at any time, through Your
                                        Device settings.</p>

										<h6>Tracking Technologies and Cookies</h6>
                                    <p>We use Cookies and similar tracking technologies to track the activity on Our
                                        Service and store certain information. Tracking technologies used are beacons,
                                        tags, and scripts to collect and track information and to improve and analyze
                                        Our Service. The technologies We use may include:</p>
                                    <ul>
                                        <li><strong>Cookies or Browser Cookies.</strong> A cookie is a small file placed
                                            on Your Device. You can instruct Your browser to refuse all Cookies or to
                                            indicate when a Cookie is being sent. However, if You do not accept Cookies,
                                            You may not be able to use some parts of our Service. Unless you have
                                            adjusted Your browser setting so that it will refuse Cookies, our Service
                                            may use Cookies.</li>
                                        <li><strong>Web Beacons.</strong> Certain sections of our Service and our emails
                                            may contain small electronic files known as web beacons (also referred to as
                                            clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for
                                            example, to count users who have visited those pages or opened an email and
                                            for other related website statistics (for example, recording the popularity
                                            of a certain section and verifying system and server integrity).</li>
                                    </ul>
                                    <p>Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies remain on
                                        Your personal computer or mobile device when You go offline, while Session
                                        Cookies are deleted as soon as You close Your web browser. Learn more about
                                        cookies on the <a
                                            href="https://www.freeprivacypolicy.com/blog/sample-privacy-policy-template/#Use_Of_Cookies_And_Tracking">Free
                                            Privacy Policy website</a> article.</p>
                                    <p>We use both Session and Persistent Cookies for the purposes set out below:</p>
                                    <ul>
                                        <li><strong>Necessary / Essential Cookies</strong>
                                            <ul>
                                                <li>Type: Session Cookies</li>
                                                <li>Administered by: Us</li>
                                                <li>Purpose: These Cookies are essential to provide You with services
                                                    available through the Website and to enable You to use some of its
                                                    features. They help to authenticate users and prevent fraudulent use
                                                    of user accounts. Without these Cookies, the services that You have
                                                    asked for cannot be provided, and We only use these Cookies to
                                                    provide You with those services.</li>
                                            </ul>
                                        </li>
                                        <li><strong>Cookies Policy / Notice Acceptance Cookies</strong>
                                            <ul>
                                                <li>Type: Persistent Cookies</li>
                                                <li>Administered by: Us</li>
                                                <li>Purpose: These Cookies identify if users have accepted the use of
                                                    cookies on the Website.</li>
                                            </ul>
                                        </li>
                                        <li><strong>Functionality Cookies</strong>
                                            <ul>
                                                <li>Type: Persistent Cookies</li>
                                                <li>Administered by: Us</li>
                                                <li>Purpose: These Cookies allow us to remember choices You make when
                                                    You use the Website, such as remembering your login details or
                                                    language preference. The purpose of these Cookies is to provide You
                                                    with a more personal experience and to avoid You having to re-enter
                                                    your preferences every time You use the Website.</li>
                                            </ul>
                                        </li>
                                    </ul>
                                    <p>For more information about the cookies we use and your choices regarding cookies,
                                        please visit our Cookies Policy or the Cookies section of our Privacy Policy.
                                    </p>


									<h5>Use of Your Personal Data</h5>
                                    <p>The Company may use Personal Data for the following purposes:</p>
                                    <ul>
                                        <li>To provide and maintain our Service, including to monitor the usage of our
                                            Service.</li>
                                        <li>To manage Your Account: to manage Your registration as a user of the
                                            Service. The Personal Data You provide can give You access to different
                                            functionalities of the Service that are available to You as a registered
                                            user.</li>
                                        <li>For the performance of a contract: the development, compliance and
                                            undertaking of the purchase contract for the products, items or services You
                                            have purchased or of any other contract with Us through the Service.</li>
                                        <li>To contact You: To contact You by email, telephone calls, SMS, or other
                                            equivalent forms of electronic communication, such as a mobile application's
                                            push notifications regarding updates or informative communications related
                                            to the functionalities, products or contracted services, including the
                                            security updates, when necessary or reasonable for their implementation.
                                        </li>
                                        <li>To provide You with news, special offers and general information about other
                                            goods, services and events which we offer that are similar to those that you
                                            have already purchased or enquired about unless You have opted not to
                                            receive such information.</li>
                                        <li>To manage Your requests: To attend and manage Your requests to Us.</li>
                                        <li>For business transfers: We may use Your information to evaluate or conduct a
                                            merger, divestiture, restructuring, reorganization, dissolution, or other
                                            sale or transfer of some or all of Our assets, whether as a going concern or
                                            as part of bankruptcy, liquidation, or similar proceeding, in which Personal
                                            Data held by Us about our Service users is among the assets transferred.
                                        </li>
                                        <li>For other purposes: We may use Your information for other purposes, such as
                                            data analysis, identifying usage trends, determining the effectiveness of
                                            our promotional campaigns and to evaluate and improve our Service, products,
                                            services, marketing and your experience.</li>
                                    </ul>

									<p>We may share Your personal information in the following situations:</p>
                                    <ul>
                                        <li>With Service Providers: We may share Your personal information with Service
                                            Providers to monitor and analyze the use of our Service, to contact You.
                                        </li>
                                        <li>For business transfers: We may share or transfer Your personal information
                                            in connection with, or during negotiations of, any merger, sale of Company
                                            assets, financing, or acquisition of all or a portion of Our business to
                                            another company.</li>
                                        <li>With Affiliates: We may share Your information with Our affiliates, in which
                                            case we will require those affiliates to honor this Privacy Policy.
                                            Affiliates include Our parent company and any other subsidiaries, joint
                                            venture partners or other companies that We control or that are under common
                                            control with Us.</li>
                                        <li>With business partners: We may share Your information with Our business
                                            partners to offer You certain products, services or promotions.</li>
                                        <li>With other users: when You share personal information or otherwise interact
                                            in the public areas with other users, such information may be viewed by all
                                            users and may be publicly distributed outside. If You interact with other
                                            users or register through a Third-Party Social Media Service, Your contacts
                                            on the Third-Party Social Media Service may see Your name, profile, pictures
                                            and description of Your activity. Similarly, other users will be able to
                                            view descriptions of Your activity, communicate with You and view Your
                                            profile.</li>
                                        <li>With Your consent: We may disclose Your personal information for any other
                                            purpose with Your consent.</li>
                                    </ul>
                                
                                

                                    <h5>Retention of Your Personal Data</h5>
                                    <p>The Company will retain Your Personal Data only for as long as is necessary for
                                        the purposes set out in this Privacy Policy. We will retain and use Your
                                        Personal Data to the extent necessary to comply with our legal obligations (for
                                        example, if we are required to retain your data to comply with applicable laws),
                                        resolve disputes, and enforce our legal agreements and policies.</p>
                                    <p>The Company will also retain Usage Data for internal analysis purposes. Usage
                                        Data is generally retained for a shorter period of time, except when this data
                                        is used to strengthen the security or to improve the functionality of Our
                                        Service, or We are legally obligated to retain this data for longer time
                                        periods.</p>

										<h5>Transfer of Your Personal Data</h5>
                                    <p>Your information, including Personal Data, is processed at the Company's
                                        operating offices and in any other places where the parties involved in the
                                        processing are located. It means that this information may be transferred to —
                                        and maintained on — computers located outside of Your state, province, country
                                        or other governmental jurisdiction where the data protection laws may differ
                                        than those from Your jurisdiction.</p>
                                    <p>Your consent to this Privacy Policy followed by Your submission of such
                                        information represents Your agreement to that transfer.</p>
                                    <p>The Company will take all steps reasonably necessary to ensure that Your data is
                                        treated securely and in accordance with this Privacy Policy and no transfer of
                                        Your Personal Data will take place to an organization or a country unless there
                                        are adequate controls in place including the security of Your data and other
                                        personal information.</p>
                                
                               

                                    <h5>Delete Your Personal Data</h5>
                                    <p>You have the right to delete or request that We assist in deleting the Personal
                                        Data that We have collected about You.</p>
                                    <p>Our Service may give You the ability to delete certain information about You from
                                        within the Service.</p>
                                    <p>You may update, amend, or delete Your information at any time by signing in to
                                        Your Account, if you have one, and visiting the account settings section that
                                        allows you to manage Your personal information. You may also contact Us to
                                        request access to, correct, or delete any personal information that You have
                                        provided to Us.</p>
                                    <p>Please note, however, that We may need to retain certain information when we have
                                        a legal obligation or lawful basis to do so.</p>
                                
                                

                                    <h5>Disclosure of Your Personal Data</h5>

                                    <h6>Business Transactions</h6>
                                    <p>If the Company is involved in a merger, acquisition or asset sale, Your Personal
                                        Data may be transferred. We will provide notice before Your Personal Data is
                                        transferred and becomes subject to a different Privacy Policy.</p>

                                    <h6>Law enforcement</h6>
                                    <p>Under certain circumstances, the Company may be required to disclose Your
                                        Personal Data if required to do so by law or in response to valid requests by
                                        public authorities (e.g. a court or a government agency).</p>

                                    <h6>Other legal requirements</h6>
                                    <p>The Company may disclose Your Personal Data in the good faith belief that such
                                        action is necessary to:</p>
                                    <ul>
                                        <li>Comply with a legal obligation</li>
                                        <li>Protect and defend the rights or property of the Company</li>
                                        <li>Prevent or investigate possible wrongdoing in connection with the Service
                                        </li>
                                        <li>Protect the personal safety of Users of the Service or the public</li>
                                        <li>Protect against legal liability</li>
                                    </ul>

									<h5>Security of Your Personal Data</h5>
                                    <p>The security of Your Personal Data is important to Us, but remember that no
                                        method of transmission over the Internet, or method of electronic storage is
                                        100% secure. While We strive to use commercially acceptable means to protect
                                        Your Personal Data, We cannot guarantee its absolute security.</p>
                                

                                <h3>Children's Privacy</h3>
                                <p>Our Service does not address anyone under the age of 13. We do not knowingly collect
                                    personally identifiable information from anyone under the age of 13. If You are a
                                    parent or guardian and You are aware that Your child has provided Us with Personal
                                    Data, please contact Us. If We become aware that We have collected Personal Data
                                    from anyone under the age of 13 without verification of parental consent, We take
                                    steps to remove that information from Our servers.</p>
                                <p>If We need to rely on consent as a legal basis for processing Your information and
                                    Your country requires consent from a parent, We may require Your parent's consent
                                    before We collect and use that information.</p>

                                <h3>Links to Other Websites</h3>
                                <p>Our Service may contain links to other websites that are not operated by Us. If You
                                    click on a third party link, You will be directed to that third party's site. We
                                    strongly advise You to review the Privacy Policy of every site You visit.</p>
                                <p>We have no control over and assume no responsibility for the content, privacy
                                    policies or practices of any third party sites or services.</p>

                                <h3>Changes to this Privacy Policy</h3>
                                <p>We may update Our Privacy Policy from time to time. We will notify You of any changes
                                    by posting the new Privacy Policy on this page.</p>
                                <p>We will let You know via email and/or a prominent notice on Our Service, prior to the
                                    change becoming effective and update the "Last updated" date at the top of this
                                    Privacy Policy.</p>
                                <p>You are advised to review this Privacy Policy periodically for any changes. Changes
                                    to this Privacy Policy are effective when they are posted on this page.</p>

                                <h3>Contact Us</h3>
                                <p>If you have any questions about this Privacy Policy, You can contact us:</p>
                                <ul>
                                    <li>By email: immofindmaroc@gmail.com</li>

                                </ul>
									</div>
									{/* <div className={isTab == 2 ? "tab-pane fade show active" : "tab-pane fade"} id="limitations" role="tabpanel">
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
									</div> */}
								</div>
							</div>
						</div>
					</div>
				</section>

			</Layout>
		</>
	)
}