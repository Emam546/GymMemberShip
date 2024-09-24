import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/users": {
        title: "Users";
        Users: "Users";
      };
    }
  }
}
i18n.addLoadUrl("/pages/users", "/users");
