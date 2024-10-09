import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "form:add:plan": {
        "Plan Name": "Plan Name";
        "Day Price": "Day Price";
        "Month Price": "Month Price";
        "Year Price": "Year Price";
        "Plan description": "Plan description";
        errors: {
          currency: "Please select a currency";
          price: "Please set the price or set it to 0";
        };
      };
    }
  }
}

