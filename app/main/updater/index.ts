import { app } from "electron";
// import { autoUpdater } from "electron-updater";
import { createUpdateWindow } from "@app/main/lib/update";
import AppUpdater from "./AppUpdater";
import PackageJson from "../../../package.json";
import { logger } from "../helpers/logger";
logger.info(`Version ${PackageJson.version}`);
const autoUpdater = new AppUpdater({
  owner: PackageJson.publish.owner,
  releaseType: PackageJson.publish.releaseType as any,
  repo: PackageJson.publish.repo,
});
app.whenReady().then(async () => {
  autoUpdater.on("error", (e) => logger.err(e));
  // if (isProd) autoUpdater.checkForUpdates();
});
autoUpdater.once("update-available", (update) => {
  logger.info("update available");
  autoUpdater.once("progress", async (info) => {
    logger.info("start downloading");
    await createUpdateWindow({
      preloadData: {
        curSize: info.chunk.length,
        fileSize: info.remainingSize + info.chunk.length,
      },
      autoUpdater: autoUpdater,
    });
  });
  app.once("before-quit", () => {
    logger.info("Download the update");
    autoUpdater.downloadUpdate(update).then((asset) => {
      logger.info(asset?.name);
      autoUpdater.once("updater-downloaded", (report) => {
        logger.info("update finished");
        app.removeAllListeners("before-quit");
        if (!report.filePath) return;
        autoUpdater.quitAndInstall(report.filePath);
      });
    });
  });
  app.on("before-quit", (e) => {
    e.preventDefault();
  });
});
export default autoUpdater;
