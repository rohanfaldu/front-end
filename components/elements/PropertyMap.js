'use client'
import dynamic from 'next/dynamic'
const MapCluster = dynamic(() => import('./MapCluster'), {
	ssr: false,
})

export default function PropertyMap({ topmap, singleMap, propertys, slug, lat, lng }) {
	// console.log(lat,lng,"33333333333333333333")
	return (
		<>{
			!singleMap ?
				<MapCluster topmap={topmap} propertys={propertys} slug={slug} lat={lat} lng={lng} />
				:
				<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2643.6895046810805!2d-122.52642526124438!3d38.00014098339506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085976736097a2f%3A0xbe014d20e6e22654!2sSan Rafael%2C California%2C Hoa Kỳ!5e0!3m2!1svi!2s!4v1678975266976!5m2!1svi!2s" height={570} style={{ border: 0, width: "100%" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
		}
		</>
	)
}