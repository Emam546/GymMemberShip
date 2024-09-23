import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/payments": {
        title: "Payments";
        Payments: "Payments";
        Earnings: "Earnings";
        "Total Count": "Total Count";
      };
    }
  }
}
i18n.addLoadUrl("/locales/pages/payments", "/payments");
