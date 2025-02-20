import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isGetlang, setGetlang] = useState(i18n.language || "fr");

  // Sync with saved language in localStorage or fallback to default
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "fr";
    i18n.changeLanguage(savedLang); // Ensure i18n initializes with the saved language
    setGetlang(savedLang);
  }, [i18n]);

  // Function to change the language
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setGetlang(lang); // Update local state
    localStorage.setItem("lang", lang); // Persist language in localStorage
  };

  return (
    <div className="lang-switcher">
      {isGetlang === "fr" ? (
        <div className="lang-img" onClick={() => changeLanguage("en")}>
          <img src="/images/favicon/fr-lang.png" alt="French language icon" />
        </div>
      ) : (
        <div className="lang-img" onClick={() => changeLanguage("fr")}>
          <img src="/images/favicon/en-lang.png" alt="English language icon" />
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
