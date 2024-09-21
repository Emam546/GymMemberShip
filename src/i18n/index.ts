import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
i18n
  .use(LanguageDetector)
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    debug: true,
    fallbackLng: "en", // Fallback language if translation is not available
    resources: {
      en: {
        translation: {
          welcome: "hello",
        },
      },
      ar: {
        translation: {
          welcome: "السلام",
        },
      },
    },
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    detection: {
      caches: ["cookie"],
    },
  });

export default i18n;
