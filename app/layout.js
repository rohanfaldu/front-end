
"use client";

import "/public/css/bootstrap.min.css"
import "/public/fonts/font-icons.css"
import "/public/fonts/fonts.css"
// import "/public/css/nouislider.min.css"
import "/public/css/swiper-bundle.min.css"
import "/public/css/animate.css"
import "/public/css/styles.css"
import Head from "next/head";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { useTranslation } from 'react-i18next';
import { DM_Sans, Josefin_Sans } from 'next/font/google'
import "./i18n";

// const { i18n } = useTranslation();
// console.log(i18n.language, "i18n.language");	
const dm = DM_Sans({
	weight: ['300', '400', '500', '600', '700'],
	subsets: ['latin'],
	variable: "--dm",
	display: 'swap',
})
const josefin = Josefin_Sans({
	weight: ['300', '400', '500', '600', '700'],
	subsets: ['latin'],
	variable: "--josefin",
	display: 'swap',
})

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
        <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCwhqQx0uqNX7VYhsgByiF9TzXwy81CFag&libraries=places,marker"></script>
      </Head>
      <html lang={i18n.language || "en"}>
        <body className="body">{children}</body>
      </html>
    </>
  );
}
