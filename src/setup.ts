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
    window.alert = function () {
      if (window.Environment == "desktop")
        return window.api.send("alert", arguments[0]);
      return proxied.apply(this, arguments as any);
    };
  })(window.alert);
  window.t = translation.t;
}
