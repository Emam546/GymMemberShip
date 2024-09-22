import type en from "./en.json";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      dashboard: typeof en;
    }
  }
}
