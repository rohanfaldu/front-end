"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector) // Automatically detect user's language
  .use(initReactI18next) // Bind i18next to React
  .init({
    resources: {
        en: {
          translation: {
            welcome: "Welcome",
            description: "Find your dream property.",
          },
        },
        es: {
          translation: {
            welcome: "Bienvenido",
            description: "Encuentra la propiedad de tus sueños.",
          },
        },
      },
    fallbackLng: "en", // Default language
    interpolation: {
      escapeValue: false, // React already escapes output
    },
  });

export default i18n;
