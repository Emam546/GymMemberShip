import "./ipc";
import {
  BrowserWindowConstructorOptions,
  globalShortcut,
  nativeImage,
  shell,
  WebContentsView,
} from "electron";
import path from "path";
import { convertFunc } from "@app/main/utils/convert";

import { isDev } from "@app/main/utils";
import { Context } from "@src/types/api";
import { Context as TitleContext } from "@shared/renderer/frame";
import { MainWindow } from "./window";
import EnvVars from "@app/main/declarations/major/EnvVars";
const ICON_IAMGE_PATH = `images/app/app_icon`;
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
  const win = new MainWindow({
    ...options,
    ...state,
    icon: nativeImage.createFromPath("sources/app/app_icon.png"),
    frame: false,
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
  const titlebarView = new WebContentsView({
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"), // optional
      sandbox: false,
      additionalArguments: [
        convertFunc(
          encodeURIComponent(
            JSON.stringify({
              icon_link: `http://localhost:${EnvVars.port}/${ICON_IAMGE_PATH}`,
            } as TitleContext)
          ),
          "data"
        ),
      ],
    },
  });
  win.contentView.addChildView(titlebarView);
  titlebarView.setBounds({ x: 0, y: 0, width: 1200, height: 30 });

  // Create web content view for external site
  const webView = new WebContentsView();
  win.contentView.addChildView(webView);
  webView.setBounds({
    x: 0,
    y: titlebarView.getBounds().height,
    width: 1200,
    height: 760,
  });

  // webView.setAutoResize({ width: true, height: true })
  await webView.webContents.loadURL(`http://localhost:${EnvVars.port}`);
  webView.webContents.on("did-fail-load", async () => {
    if (isDev) {
      await webView.webContents.loadURL(
        `${process.env["ELECTRON_RENDERER_URL"] as string}/404.html`
      );
    } else
      await webView.webContents.loadFile(
        path.join(__dirname, "../windows/404.html")
      );
  });
  win.on("resize", () => {
    const bounds = win.getContentBounds();
    webView.setBounds({
      x: 0,
      y: titlebarView.getBounds().height,
      width: bounds.width,
      height: bounds.height - titlebarView.getBounds().height,
    });
    titlebarView.setBounds({
      x: 0,
      y: 0,
      width: bounds.width,
      height: titlebarView.getBounds().height,
    });
  });

  win.on("close", saveState);
  await win.loadURL(`http://localhost:${EnvVars.port}`);
  if (isDev)
    globalShortcut.register("Ctrl+Shift+I", () => {
      if (win.webContents.isDevToolsOpened()) {
        win.webContents.closeDevTools();
      } else {
        win.webContents.openDevTools();
      }
    });
  win.webContents.on("did-fail-load", () => {
    win.webContents.reloadIgnoringCache();
  });
  if (isDev) {
    await titlebarView.webContents.loadURL(
      `${process.env["ELECTRON_RENDERER_URL"] as string}/frame.html`
    );
    globalShortcut.register("Ctrl+Shift+I", () => {
      if (webView.webContents.isDevToolsOpened()) {
        webView.webContents.closeDevTools();
      } else {
        webView.webContents.openDevTools();
      }
    });
  } else
    await titlebarView.webContents.loadFile(
      path.join(__dirname, "../windows/frame.html")
    );
  win.show();
  win.maximize();
  return win;
};
