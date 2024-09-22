import type en from "./en.json";
import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/users": typeof en;
    }
  }
}
i18n.addLoadResource(async (lng) => {
  const res = await import(`./${lng}.json`);
  i18n.addResourceBundle(lng, "/users", res, true, true);
});
