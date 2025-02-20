'use client';

import DeleteFile from "@/components/elements/DeleteFile";
import Layout from "@/components/layout/Layout";
import Preloader from "@/components/elements/Preloader";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function NotFound() {
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    useEffect(() => {
        // Simulate a delay to mimic loading (e.g., fetching data)
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000); // Adjust delay as needed

        return () => clearTimeout(timer); // Clean up the timer
    }, []);

    return (
        <>

            <Layout headerStyle={1} footerStyle={1}>

                <div className="wrap-dashboard-content">
                    <div className="error-container">
                        <h1>{t("error404")}</h1>
                        <p>{t("Oops!Thepageyouarelookingfordoesnotexist.")}</p>
                        <Link href="/" className="back-to-home">
                            {t("GoBacktoHome")}
                        </Link>
                    </div>
                </div>
            </Layout>

        </>
    );
}
