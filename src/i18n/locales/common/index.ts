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
          send: string;
        };
        messages: {
          updated: "the document updated successfully";
          added: "the document added successfully";
          deleted: "document deleted successfully";
          whatsapp: {
            sended: "messages was sent successfully";
          };
        };
      };
    }
  }
}
i18n.addLoadUrl("/common", "translation");
