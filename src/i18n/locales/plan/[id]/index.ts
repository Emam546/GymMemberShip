import type en from "./en.json";
import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/plan/[id]": typeof en;
    }
  }
}
i18n.addLoadResource(async (lng) => {
  const res = await import(`./${lng}.json`);
  i18n.addResourceBundle(lng, "/plan/[id]", res, true, true);
});
