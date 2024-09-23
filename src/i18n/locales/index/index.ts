import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      index: {
        "Recent Transactions": string;
        "Recent Users": string;
        transactions: {
          receivePayment: "Payment received from {{name}} of {{price}}`}";
        };
      };
    }
  }
}
i18n.addLoadUrl("/locales/pages/index", "index");
