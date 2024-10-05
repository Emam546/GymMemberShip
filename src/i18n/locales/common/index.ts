import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      translation: {
        buttons: {
          submit: "Submit";
          update: "Update";
          print: "Print";
          activate: "Activate";
          add: string;
          attend: string;
        };
        messages: {
          updated: "the document updated successfully";
          added: "the document added successfully";
          deleted: string;
        };
      };
    }
  }
}
i18n.addLoadUrl("/common", "translation");
