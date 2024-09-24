import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "filter:users": {
        "name.placeholder": "Search By Name";
      };
    }
  }
}
i18n.addLoadUrl("/components/users/filter", "filter:users");
