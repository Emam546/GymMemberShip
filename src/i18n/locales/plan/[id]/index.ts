import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/plan/[id]": {
        "Update Plan Data": "Update Plan Data";
        Payments: "Payments";
        "Go To Plans": "Go To Plans";
        "Go To Users Logs": "Go To User Logs";
        "Go To Plan Payments": "Go To Plan Payments";
      };
    }
  }
}
i18n.addLoadUrl("/pages/plan/[id]", "/plan/[id]");
