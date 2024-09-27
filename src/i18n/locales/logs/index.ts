import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/logs": {
        title: "Logs";
        Logs: "Logs";
        "Total Count": "Total Count";
      };
    }
  }
}
i18n.addLoadUrl("/pages/logs", "/logs");
