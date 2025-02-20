'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Breadcrumb({ breadcrumbTitle }) {
	const pathname = usePathname(); // Use usePathname from next/navigation
	console.log(pathname, 'pathname');

	const pathSegments = pathname.split('/').filter(segment => segment);  // Split URL path

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
					</ul>
				</div>
			</section>

		</>
	)
}
