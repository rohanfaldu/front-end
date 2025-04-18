
"use client";

import { DM_Sans, Josefin_Sans } from 'next/font/google'
import { useTranslation } from 'react-i18next';
import "./i18n";

const dm = DM_Sans({
    weight: ['400', '500', '700'],
    subsets: ['latin'],
    variable: "--dm",
    display: 'swap',
})

const josefin = Josefin_Sans({
    weight: ['400', '500', '700'],
    subsets: ['latin'],
    variable: "--josefin",
    display: 'swap',
})

export const dynamic = 'force-dynamic'
export const revalidate = 60

export default function RootLayout({ children }) {
    const { i18n } = useTranslation();
    
    return (
        <html lang={i18n.language || "fr"}>
            <head>
                <title>Immofind Real Estate Matching</title>
                <meta name="description" content="Find your dream property with Immofind" />
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="/images/logo/favicon.svg" />
                <link rel="stylesheet" href="/css/bootstrap.min.css" />
                <link rel="stylesheet" href="/fonts/font-icons.css" />
                <link rel="stylesheet" href="/fonts/fonts.css" />
                <link rel="stylesheet" href="/css/swiper-bundle.min.css" />
                <link rel="stylesheet" href="/css/animate.css" />
                <link rel="stylesheet" href="/css/styles.css" />
            </head>
            <body className={`body ${dm.variable} ${josefin.variable}`}>
                {children}
            </body>
        </html>
    );
}

export function reportWebVitals(metric) {
    if (metric.label === 'web-vital') {
        // console.log(metric)
    }
}
