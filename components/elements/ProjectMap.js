'use client'
import dynamic from 'next/dynamic'

// Dynamically import MapClusterProject with no SSR
const MapClusterProject = dynamic(() => import('./MapclusturProject'), {
    ssr: false,
    loading: () => <div>Loading map...</div>
})

export default function ProjectMap({ topmap, singleMap, propertys, slug }) {
    if (singleMap) {
        return (
           <></>
        )
    }

    return <MapClusterProject topmap={topmap} propertys={propertys} slug={slug} />
}
