import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "form:user": {
        "User Name": "User Name";
        Phone: "Phone";
        Age: "Age";
        "Tall in centimeter": "Tall in centimeter";
        "Weight in Kg": "Weight in Kg";
        "Why did you come": "Why did you come";
      };
    }
  }
}
i18n.addLoadUrl("/locales/components/users/form", "form:user");
