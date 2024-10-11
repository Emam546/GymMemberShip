import { ConvertToIpCMainFunc, ConvertToIpCHandleMainFunc } from "@shared/api";
import { ObjectEntries } from "@utils/index";
import { app, BrowserWindow, dialog, ipcMain } from "electron";

import { ApiMain } from "@shared/api";
import { SaveFile } from "./saveFile";
type OnMethodsType = {
  [K in keyof ApiMain.OnMethods]: ConvertToIpCMainFunc<ApiMain.OnMethods[K]>;
};
type OnceMethodsType = {
  [K in keyof ApiMain.OnceMethods]: ConvertToIpCMainFunc<
    ApiMain.OnceMethods[K]
  >;
};
type HandelMethodsType = {
  [K in keyof ApiMain.HandleMethods]: ConvertToIpCHandleMainFunc<
    ApiMain.HandleMethods[K]
  >;
};
type HandelOnceMethodsType = {
  [K in keyof ApiMain.HandleOnceMethods]: ConvertToIpCHandleMainFunc<
    ApiMain.HandleOnceMethods[K]
  >;
};
export const OnMethods: OnMethodsType = {
  log(_, ...arg) {
    // eslint-disable-next-line no-console
    console.log(...arg);
  },
  setTitle: function (event, name: string): void {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return;
    window.setTitle(name);
  },
  closeWindow(e) {
    const window = BrowserWindow.fromWebContents(e.sender);
    if (!window) return;
    window.close();
  },

  setContentHeight: function (event, height: number): void {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return;
    window.setContentSize(window.getContentSize()[0], height);
  },
  setContentWidth: function (event, width: number): void {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return;
    window.setContentSize(width, window.getContentSize()[1]);
  },
  center: function (event): void {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return;
    window.center();
  },
  minimizeWindow: function (event): void {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return;
    window.minimize();
  },
  hideWindow: function (event): void {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return;
    window.hide();
  },
  quitApp: function (): void {
    app.quit();
  },
  alert(event, message, title) {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return;
    dialog.showMessageBoxSync(window, {
      message,
      title: title || "Process",
    });
    event.returnValue = true;
  },
  confirm(event, message, title) {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return;
    try {
      const response = dialog.showMessageBoxSync(window, {
        message,
        title: title || "Process",
        buttons: ["Ok", "Cancel"],
        defaultId: 1,
      });
      event.returnValue = response == 0;
    } catch (error) {
      event.returnValue = false;
    }
  },
};
export const OnceMethods: OnceMethodsType = {};
export const HandleMethods: HandelMethodsType = {
  async saveFile(e, data, filename) {
    const res = await SaveFile(data, filename);
    if (!res) return false;
    return true;
  },
};
export const HandleOnceMethods: HandelOnceMethodsType = {};
ObjectEntries(OnMethods).forEach(([key, val]) => {
  ipcMain.on(key, val);
});
ObjectEntries(HandleMethods).forEach(([key, val]) => {
  ipcMain.handle(key, val);
});
// ObjectEntries(OnceMethods).forEach(([key, val]) => {
//     ipcMain.once(key, val);
// });
// ObjectEntries(HandleOnceMethods).forEach(([key, val]) => {
//     ipcMain.handleOnce(key, val);
// });
