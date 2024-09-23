import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      translation: {
        buttons: {
          submit: "Submit";
          update: "Update";
          print: "Print";
        };
      };
    }
  }
}
i18n.addLoadUrl("/locales/common", "translation");
