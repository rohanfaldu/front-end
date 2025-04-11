'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from "react-i18next";
import { useRouter } from 'next/navigation';

export default function Breadcrumb({ breadcrumbTitle }) {
	const pathname = usePathname(); // Use usePathname from next/navigation
	console.log(pathname, 'pathname');
	const isAgency = pathname.includes("/agency");
	const isDeveloper = pathname.includes("/developer");
	const pathSegments = pathname.split('/').filter(segment => segment);  // Split URL path
	const { t, i18n } = useTranslation();
	const router = useRouter();
	// const breadcrumbLinks = pathSegments.map((segment, index) => {
	// 	const linkPath = '/' + pathSegments.slice(0, index + 1).join('/');
	// 	return { label: segment.charAt(0).toUpperCase() + segment.slice(1), link: linkPath };
	// });
	const breadcrumbLinks = pathSegments
		.filter(segment => isNaN(segment) && !/^[0-9a-fA-F-]{36}$/.test(segment)) // Remove numbers or UUIDs
		.map((segment, index) => {
			const linkPath = '/' + pathSegments.slice(0, index + 1).join('/');
			return { label: segment.charAt(0).toUpperCase() + segment.slice(1), link: linkPath };
		});
	return (
		<>
			<section className="flat-title-page style-2 cover-set-image" style={{backgroundImage: `url(${breadcrumbTitle?.cover})`}}>
				<div className="link back-btn">
					<button
						className="form-wg tf-btn primary"
						type="button"
						style={{marginLeft: "50px"  }}
						onClick={() => (isAgency)? router.push("/agency") : router.push("/developer") }
					>
						<span style={{ color: "#fff" }}>&lt;</span>
					</button>
				</div>
				<div className="container">
					<ul className="breadcrumb">
						{/* <li><Link href="/">Home</Link></li>
						<li>/ Pages</li>
						<li>/ {breadcrumbTitle}</li> */}
						{/* <li><Link href="/">Home /</Link></li>
						{breadcrumbLinks.map((breadcrumb, index) => (
							<li key={index}>
								{index < breadcrumbLinks.length - 1 ?
							<Link href={breadcrumb.link}>{breadcrumb.label}</Link>
						: <>{breadcrumb.label}</>}
							{index < breadcrumbLinks.length - 1 && ' / '}
							</li>
						))} */}
					</ul>
					<h2 className="text-center">{breadcrumbTitle?.full_name}</h2>
					<ul className="breadcrumb">
					{isAgency ? (
							<span>Agency</span>
						) : isDeveloper ? (
						<span>Developer</span>
						) : (
							<>
								{breadcrumbLinks.map((breadcrumb, index) => (
									<li key={index}>
										{index < breadcrumbLinks.length - 1 ? (
											<>
												<Link href={breadcrumb.link}>{breadcrumb.label}</Link>
												{' / '}
											</>
										) : (
											<span>{breadcrumb.label}</span>
										)}
									</li>
								))}
							</>
						)
					}

						
					</ul>
				</div>
			</section>

		</>
	)
}
