
import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/plan/add": {
        title: "Add Plans";
        "Add Plan": "Add Plan";
        "Go To Plans": "Go To Plans";
      };
    }
  }
}
i18n.addLoadUrl("/locales/pages/plan/add", "/plan/add");
