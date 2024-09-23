import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/users/[id]/logs": {
        title: "{{name}} Logs";
        "User Logs": "User Logs";
      };
    }
  }
}
i18n.addLoadUrl("/locales/pages/users/[id]/logs", "/users/[id]/logs");
