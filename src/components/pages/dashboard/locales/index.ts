import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      dashboard: {
        "Sales OverView": "Sales OverView";
        "Yearly Breakup": "Yearly Breakup";
        "last year": "last year";
        "Monthly Earnings": "Monthly Earnings";
        "last month": "last month";
      };
    }
  }
}
i18n.addLoadUrl("/components/dashboard", "dashboard");
