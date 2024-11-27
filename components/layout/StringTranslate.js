import { useTranslation } from "react-i18next";

const StringTranslate = {
    text: async (text) => {
        const { t } = useTranslation();
        return await( t(text) );
    }
};

module.exports = StringTranslate;