import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/users/add": {
        title: "Create User";
        "Create User": "Create User";
        "Go To Users": "Go To Users";
      };
    }
  }
}
i18n.addLoadUrl("/pages/users/add", "/users/add");
