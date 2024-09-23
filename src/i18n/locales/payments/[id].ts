import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/payments/[id]": {
        title: "{{val}} Payment";
        "Update Payment Data": "Update Payment Data";
        "User Logs": "User Logs";
      };
    }
  }
}
i18n.addLoadUrl("/locales/pages/payments/[id]", "/payments/[id]");
