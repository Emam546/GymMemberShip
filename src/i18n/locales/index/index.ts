import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      index: {
        "Recent Transactions": string;
        "Recent Users": string;
      };
    }
  }
}
i18n.addLoadUrl("/locales/pages/index", "index");
