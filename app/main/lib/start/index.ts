import "./ipc"
import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  shell,
} from "electron";
import path from "path";
import { Context } from "@shared/renderer/start";
import { convertFunc } from "@app/main/utils/convert";
import { isDev } from "@app/main/utils";
export interface Props {
  preloadData: Context;
}
export const createStartWindow = async (
  vars: Props,
  options?: BrowserWindowConstructorOptions
): Promise<BrowserWindow> => {
  const preloadData: Omit<Context, "logoImage"> = {
    ...vars.preloadData,
  };
  const win = new BrowserWindow({
    icon: "build/icon.ico",
    useContentSize: true,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    resizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    transparent: true, // Makes the window background transparent
    alwaysOnTop: true, // Optional, keeps the window on top
    center: true,
    height: 270,
    width: 450,
    ...options,
    webPreferences: {
      ...options?.webPreferences,
      sandbox: false,
      preload: path.join(__dirname, "../preload/index.js"),
      additionalArguments: [
        convertFunc(encodeURIComponent(JSON.stringify(preloadData)), "data"),
      ],
    },
  });
  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (isDev) {
    await win.loadURL(
      `${process.env["ELECTRON_RENDERER_URL"] as string}/start`
    );
  } else await win.loadFile(path.join(__dirname, "../windows/start.html"));
  win.show();
  win.moveTop();
  return win;
};
