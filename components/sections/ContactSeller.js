
'use client'
import Link from "next/link"
import { useTranslation } from "react-i18next";

export default function ContactSeller(contactDetails) {
	console.log(contactDetails,"contactDetails")
	const { t } = useTranslation();
	return (
		<>
		<div className="widget-box single-property-contact bg-surface">
			<div className="h7 title fw-7">{t("contactSeller")}</div>
			<div className="box-avatar">
				{contactDetails.data.user_image ? (
					<div className="avatar avt-100 round">
						<img src={contactDetails.data.user_image} alt="avatar" />
					</div>
				) :
					null
				}
				<div className="info" style={{overflow : "hidden"}}>
					<div className="text-1 name">{contactDetails.data.user_name}</div>
					<span className="text">{contactDetails.data.email_address}</span>
					<span>{contactDetails.data.country_code} {contactDetails.data.phone_number}</span>
				</div>
			</div>
		</div>
		</>
	)
}