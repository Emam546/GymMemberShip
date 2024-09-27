import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/plans/[id]/logs": {
        title: "{{name}} Logs";
        "Plan Logs": "Plan Logs";
        "Total Count": "Total Count";
      };
    }
  }
}
i18n.addLoadUrl("pages/plan/[id]/logs", "/plans/[id]/logs");
