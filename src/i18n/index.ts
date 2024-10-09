import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import requester from "@src/utils/axios";
export const langs = ["en", "ar"];
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
      cookieOptions: {
        path: "/",
        sameSite: "strict",
        expires: (() => {
          const expires = new Date();
          expires.setFullYear(expires.getFullYear() + 100);
          return expires;
        })(),
      },
    },
  });
(function (proxy) {
  i18n.changeLanguageAndLoad = async (lng, ...a) => {
    await i18n.loadR(lng || i18n.language);
    return await proxy(lng, ...a);
  };
})(i18n.changeLanguage);
function mergePath(...paths: string[]): string {
  let a = paths[0];
  const [, ...r] = paths;
  a = a.endsWith("/") ? a.slice(0, -1) : a;
  a = a.startsWith("/") ? a.slice(1) : a;
  if (r.length) return `${a}/${mergePath(...r)}`;
  return a;
}
const publicPath = "./locales";
i18n.loadR = async function (lng) {
  if (typeof window == "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require("fs");
    const fileContent = fs.readFileSync(
      mergePath(publicPath, `${lng}.json`),
      "utf8"
    );
    const data = JSON.parse(fileContent);
    Object.entries(data).forEach(([key, val]) => {
      this.addResourceBundle(lng, key as string, val, true, true);
    });
  } else {
    const res = await requester.get(`locales/${lng}.json`);
    if (!res.data) return;
    Object.entries(res.data).forEach(([key, val]) => {
      this.addResourceBundle(lng, key as string, val, true, true);
    });
  }
};

i18n.updated = false;
export default i18n;
