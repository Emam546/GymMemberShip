import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import axios from "axios";
i18n
  .use(LanguageDetector)
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    debug: false,
    fallbackLng: "en", // Fallback language if translation is not available
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    detection: {
      caches: ["cookie"],
      order: ["cookie"],
    },
  });
i18n.curPromises = [];
i18n.addLoadResource = (f) => {
  i18n.curPromises.push(f);
  return i18n;
};
(function (proxy) {
  i18n.changeLanguageAndLoad = async (lng, ...a) => {
    await i18n.loadR(lng || i18n.language);
    return await proxy(lng, ...a);
  };
})(i18n.changeLanguage);

i18n.loadR = async (lng) => {
  await Promise.all(i18n.curPromises.map((f) => f(lng)));
};
i18n.addLoadUrl = function (path, ns) {
  this.addLoadResource(async (lng) => {
    try {
      const res = await axios.get(`/locals${path}/${lng}.json`);
      this.addResourceBundle(lng, ns as string, res.data, true, true);
    } catch (error) {
      console.error(error);
    }
  });
  return this;
};

i18n.updated = false;
export default i18n;
