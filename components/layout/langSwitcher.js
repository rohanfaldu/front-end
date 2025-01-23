import { useTranslation } from "react-i18next";
import { useState } from "react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const[isGetlang, setGetlang] = useState('fr');
  // Function to change the language
  const changeLanguage = (lang) => {
    setGetlang(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };
  
  console.log(isGetlang);
  return (
    <>
      <div className="lang-switcher">
        {isGetlang === "fr" ? (
          <>
            <div className="fr-lang lang-img" onClick={() => changeLanguage("en")}>
              <img src="/images/favicon/fr-lang.png" alt="fr-lang" />
            </div>
          </>
        ):(
          <>
            <div className="fr-lang lang-img" onClick={() => changeLanguage("fr")}>
              <img src="/images/favicon/en-lang.png" alt="en-lang" />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default LanguageSwitcher;
