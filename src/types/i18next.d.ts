import i18n from "@src/i18n";

declare global {
  namespace I18ResourcesType {
    type AvailableLang = "en" | "ar";
    interface Resources {}
  }
}
declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: I18ResourcesType.Resources;
  }
  interface i18n {
    curPromises: ((lng: string) => any)[];
    addLoadResource(f: (lng: string) => any): this;
    loadR(lng: string): Promise<void>;
    changeLanguageAndLoad: (typeof i18n)["changeLanguage"];
  }
}
export {};
