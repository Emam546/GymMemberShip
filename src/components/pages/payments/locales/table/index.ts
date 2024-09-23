import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "table:payments": {
        Deleted: "Deleted";
        Link: "Link";
        head: {
          Id: "Id";
          User: "User";
          Plan: "Plan";
          Link: "Link";
          Paid: "Paid";
          "Created At": "Created At";
          "End At": "End At";
          "A/R/T": "A/R/T";
          Separated: "Separated";
          Attend: "Attend";
          Delete: "Delete";
        };
        "There is no payments": "There is no payments";
      };
    }
  }
}
i18n.addLoadUrl("/locales/components/payments/table", "table:payments");
