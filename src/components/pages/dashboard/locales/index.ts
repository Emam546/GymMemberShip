import i18n from "@src/i18n";

i18n.addLoadResource(async (lng) => {
  const res = await import(`./${lng}.json`);
  i18n.addResourceBundle(lng, "dashboard", res, true, true);
});
