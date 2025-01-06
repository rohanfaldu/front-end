"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
const enLang = require("../public/translations/en/content.json");
const frLang = require("../public/translations/fr/content.json");

const isServer = typeof window === "undefined";

i18n.use(initReactI18next).init({
	fallbackLng: "en",
	interpolation: { escapeValue: false },
	react: { useSuspense: false },
	resources: {
	  en: { translation: enLang },
	  fr: { translation: frLang },
	},
});

export default i18n;