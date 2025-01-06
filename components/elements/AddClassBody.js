'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function AddClassBody() {
	const pathname = usePathname()

	useEffect(() => {
		const bodyElement = document.querySelector('body')

		if (bodyElement) {

			bodyElement.classList.remove('counter-scroll', 'bg-surface')


			if (pathname === '/') {
				bodyElement.classList.add('counter-scroll')
			}
			else if (pathname === '/home-04') {
				bodyElement.classList.add('counter-scroll')
			}
			else if (pathname === '/dashboard') {
				bodyElement.classList.add('bg-surface', 'counter-scroll')
			}
			else if (pathname === '/add-property') {
				bodyElement.classList.add('bg-surface')
			}
			else if (pathname === '/my-favorites') {
				bodyElement.classList.add('bg-surface')
			}
			else if (pathname === '/my-invoices') {
				bodyElement.classList.add('bg-surface')
			}
			else if (pathname === '/my-profile') {
				bodyElement.classList.add('bg-surface')
			}
			else if (pathname === '/my-property') {
				bodyElement.classList.add('bg-surface')
			}
			else if (pathname === '/property-details-v2') {
				bodyElement.classList.add('bg-surface')
			}
			else if (pathname === '/reviews') {
				bodyElement.classList.add('bg-surface')
			}

		}
	}, [pathname])

	return null
}
