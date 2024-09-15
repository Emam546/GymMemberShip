import "./ipc";
import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  shell,
} from "electron";
import path from "path";
import { convertFunc } from "@app/main/utils/convert";

import { isDev, isProd } from "@app/main/utils";
import { Context } from "@src/types/api";
import { MainWindow } from "./window";
export const createMainWindow = async (
  options: BrowserWindowConstructorOptions,
  preloadData?: Context
): Promise<MainWindow> => {
  const state: Electron.BrowserWindowConstructorOptions = {
    show: false,
    autoHideMenuBar: true,
  };

  const getCurrentPosition = () => {
    const position = win.getPosition();
    const size = win.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
    };
  };

  const saveState = () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition());
    }
  };
  const win = new BrowserWindow({
    ...options,
    ...state,
    icon: "build/icon.ico",
    webPreferences: {
      ...state.webPreferences,
      ...options.webPreferences,
      sandbox: false,
      preload: path.join(__dirname, "../preload/index.js"),
      additionalArguments: [
        convertFunc(
          encodeURIComponent(JSON.stringify(preloadData || null)),
          "data"
        ),
      ],
    },
  });

  win.on("ready-to-show", () => {
    win.maximize();
    win.show();
  });

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });
  win.on("close", saveState);
  await win.loadURL(`http://localhost:3000`);
  if (isDev) win.webContents.openDevTools();
  win.webContents.on("did-fail-load", () => {
    win.webContents.reloadIgnoringCache();
  });

  return win;
};
