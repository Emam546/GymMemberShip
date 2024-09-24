import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "table:users": {
        td: {
          Deleted: "Deleted";
          "block.label": "block";
          delete: {
            title: "Block User";
            desc: "Once you click Block, The user will be blocked form the courses and he will have no more access on teh server";
            accept: "Block {{name}}";
            deny: "Keep";
          };
        };
        th: {
          Id: "Id";
          Name: "Name";
          "Age/Tall/Weight": "Age/Tall/Weight";
          Plan: "Plan";
          "Created At": "Created At";
          Blocked: "Blocked";
        };
        "There is no users so far": "There is no users so far";
      };
    }
  }
}
i18n.addLoadUrl("/components/users/table", "table:users");
