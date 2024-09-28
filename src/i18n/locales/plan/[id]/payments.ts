import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/plans/[id]/payments": {
        title: "{{name}} payments";
        "Plan Payments": "Plan payments";
        "Total Count": "Total Count";
        Earnings: "Earnings";
      };
    }
  }
}
i18n.addLoadUrl("pages/plan/[id]/payments", "/plans/[id]/payments");
