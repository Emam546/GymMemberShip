import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/plan/[id]": {
        "Update Plan Data": "Update Plan Data";
        Payments: "Payments";
        "Go To Plans": "Go To Plans";
      };
    }
  }
}
i18n.addLoadUrl("/pages/plan/[id]", "/plan/[id]");
