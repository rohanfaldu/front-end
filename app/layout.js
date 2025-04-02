
"use client";

// Move CSS imports to a separate component
import dynamicImport from 'next/dynamic'

// Dynamically import styles
const StyleProvider = dynamicImport(() => import('../components/providers/StyleProvider'), {
    ssr: true
})

import { DM_Sans, Josefin_Sans } from 'next/font/google'
import Head from "next/head";
import { useTranslation } from 'react-i18next';
import "./i18n";

// Optimize font loading
const dm = DM_Sans({
    weight: ['400', '500', '700'], // Remove unnecessary weights
    subsets: ['latin'],
    variable: "--dm",
    display: 'swap',
})

const josefin = Josefin_Sans({
    weight: ['400', '500', '700'], // Remove unnecessary weights
    subsets: ['latin'],
    variable: "--josefin",
    display: 'swap',
})

export const dynamic = 'force-dynamic'
export const revalidate = 60

export default function RootLayout({ children }) {
    const { i18n } = useTranslation();
    
    return (
        <>
            <Head>
                <title>Immofind Real Estate Matching</title>
                <meta name="description" content="Find your dream property with Immofind" />
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="/images/logo/favicon.svg" />
            </Head>
            <html lang={i18n.language || "fr"}>
                <StyleProvider />
                <body className="body">{children}</body>
            </html>
        </>
    );
}


export function reportWebVitals(metric) {
    if (metric.label === 'web-vital') {
        console.log(metric)
    }
}
