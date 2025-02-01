/* eslint-disable prefer-rest-params */
import "@serv/validator";
import { isElectron } from "@utils/electron";
import translation from "@src/i18n";
declare global {
  interface Window {
    Environment: "web" | "desktop";
    t: (typeof translation)["t"];
  }
}
if (typeof window != "undefined") {
  window.Environment = isElectron() ? "desktop" : "web";
  (function (proxied) {
    window.alert = function (...args) {
      if (window.Environment == "desktop")
        return window.api.sendSync("alert", args[0], "Alert");
      return proxied.apply(this, args);
    };
  })(window.alert);
  (function (proxied) {
    window.confirm = function (...args) {
      if (window.Environment == "desktop")
        return window.api.sendSync("confirm", args[0] as string, "Confirm");
      return proxied.apply(this, args);
    };
  })(window.confirm);
  window.t = translation.t;
}
