'use client';
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function TabNav({ transaction }) {
    const [isTab, setIsTab] = useState(1);
    const { t } = useTranslation();

    const handleTab = (i) => {
        setIsTab(i);
        transaction(i === 1 ? "rental" : "sale"); // Set transaction type based on the selected tab
        localStorage.setItem("transaction", i === 1 ? "rental" : "sale");

    };

    useEffect(() => {
        setIsTab(localStorage.getItem("transaction") === "rental" ? 1 : 2);
    })
    return (
        <>
            <li className="nav-tab-item" onClick={() => handleTab(1)}>
                <a className={isTab === 1 ? "nav-link-item active" : "nav-link-item"}>{t("forrent")}</a>
            </li>
            <li className="nav-tab-item" onClick={() => handleTab(2)}>
                <a className={isTab === 2 ? "nav-link-item active" : "nav-link-item"}>{t("forsale")}</a>
            </li>
        </>
    );
}
