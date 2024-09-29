import "./pre-start";
import "./helpers/ipcMain";
import "./updater";
import { createMainWindow } from "./lib/main";
import { app } from "electron";
import { electronApp } from "@electron-toolkit/utils";
import { lunchArgs } from "./helpers/launchHelpers";
import path from "path";
import { ExpressServer } from "./express";
import { createStartWindow } from "./lib/start";
const expressProcess = new ExpressServer();
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("gymMemberShip", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else app.setAsDefaultProtocolClient("gymMemberShip");

if (!app.isPackaged) {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}
async function createWindow(args: string[]) {
  const data = lunchArgs(args);
  return await createMainWindow({}, data || {});
}

electronApp.setAppUserModelId("com.gymMemberShip");

const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) app.quit();
else
  app.on("second-instance", (_, argv) => {
    //users requested a second instance of the app.
    //argv has the process.argv arguments of the second instance.
    if (!app.hasSingleInstanceLock()) return;
    createWindow(argv);
  });
app.on("window-all-closed", () => {
  app.quit();
});
app.whenReady().then(async () => {
  const win = await createStartWindow({ preloadData: {} });
  const state = await expressProcess.runServer();
  if (!state) return;
  console.log("start app");
  await createWindow(process.argv);
  win.close();
  console.log("app started");
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
export default app;
