import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  nativeImage,
  shell,
} from "electron";
import path from "path";
import { Context } from "@shared/renderer/qrCode";
import { convertFunc } from "@app/main/utils/convert";
import { isDev } from "@app/main/utils";
export interface Props {
  preloadData: Context;
}
export const createQrCodeWindow = async (
  vars: Props,
  options?: BrowserWindowConstructorOptions
): Promise<BrowserWindow> => {
  const preloadData: Context = {
    ...vars.preloadData,
  };
  const win = new BrowserWindow({
    icon: nativeImage.createFromPath("sources/app/app_icon.png"),
    useContentSize: true,
    show: false,
    autoHideMenuBar: true,
    resizable: false,
    fullscreenable: false,
    alwaysOnTop: true, // Optional, keeps the window on top
    center: true,
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
      `${process.env["ELECTRON_RENDERER_URL"] as string}/qrCode`
    );
  } else await win.loadFile(path.join(__dirname, "../windows/qrCode.html"));
  win.show();
  win.moveTop();
  return win;
};
