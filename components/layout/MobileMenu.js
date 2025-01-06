'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";

export default function MobileMenu() {
	const pathname = usePathname()
	const [currentMenuItem, setCurrentMenuItem] = useState("")
	const { t } = useTranslation();
	useEffect(() => {
		setCurrentMenuItem(pathname)
	}, [pathname])

	const checkCurrentMenuItem = (path) => currentMenuItem === path ? "current" : ""
	const checkParentActive = (paths) => paths.some(path => currentMenuItem.startsWith(path)) ? "current" : ""
	
	const [isAccordion, setIsAccordion] = useState(1)

	const handleAccordion = (key) => {
		setIsAccordion(prevState => prevState === key ? null : key)
	}
	return (
		<>
			<div className="menu-outer">
				<div className="navbar-collapse collapse clearfix" id="navbarSupportedContent">
				<ul className="navigation clearfix">
					<li><Link href="/">{t("home")}</Link></li>
					<li><Link href="/about-us">{t("aboutus")}</Link></li>
					<li><Link href="/properties">{t("property")}</Link></li>
					<li><Link href="/project">{t("project")}</Link></li>
					<li><Link href="/blog">{t("blog")}</Link></li>
				</ul>
				
				</div>
			</div>
		</>
	)
}
