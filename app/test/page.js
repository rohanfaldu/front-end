'use client'
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/layout/langSwitcher";
export default function Test() {
	const { t, i18n } = useTranslation();

	if (!i18n.isInitialized) {
		return <p>Loading...</p>;
	}

	console.log(t("welcome")); 
	return (
		<>
		<LanguageSwitcher /> 
			<h1>{t("welcome")}</h1>				
		</>
	)
}
