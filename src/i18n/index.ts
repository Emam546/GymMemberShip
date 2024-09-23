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
function mergePath(...paths: string[]): string {
  let [a, ...r] = paths;
  a = a.endsWith("/") ? a.slice(0, -1) : a;
  a = a.startsWith("/") ? a.slice(1) : a;
  if (r.length) return `${a}/${mergePath(...r)}`;
  return a;
}
i18n.addLoadUrl = function (path, ns) {
  this.addLoadResource(async (lng) => {
    if (typeof this.getResourceBundle(lng, ns) != "undefined") return;
  
    const filepath = mergePath(path, `${lng}.json`);
    if (typeof window == "undefined") {
      try {
        const fs = require("fs");
        const fileContent = fs.readFileSync(
          mergePath("public", filepath),
          "utf8"
        );
        const data = JSON.parse(fileContent);
        this.addResourceBundle(lng, ns as string, data, true, true);
      } catch (err) {
        console.log(filepath);
        console.log("Error", err);
      }
    } else {
      try {
        const res = await axios.get(`/${filepath}`);
        if (!res.data) return;
        this.addResourceBundle(lng, ns as string, res.data, true, true);
      } catch (error) {
        console.log(filepath);
        console.log("error 2", error);
      }
    }
  });
  return this;
};

i18n.updated = false;
export default i18n;
