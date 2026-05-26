import { app, Notification } from "electron";
import { createUpdateWindow } from "@app/main/lib/update";
import AppUpdater from "./AppUpdater";
import PackageJson from "../../../package.json";
import { logger } from "../helpers/logger";
import { MainWindow } from "../lib/main/window";
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
  logger.info(`update available ${update.tag_name}`);
  logger.info("Downloading the update");
  const notification = new Notification({
    title: "Update Available",
    body: `Version ${update.tag_name} is available. Click to download.`,
  });

  notification.show();
  notification.on("click", async () => {
    logger.info("User accepted update");
    app.once("before-quit", () => {
      logger.info("Download the update");
      autoUpdater.downloadUpdate(update).then((asset) => {
        logger.info(asset?.name);
      });
    });
  });
  autoUpdater.once("updater-downloaded", (report) => {
    logger.info("update finished");
    app.removeAllListeners("before-quit");
    if (!report.filePath) return;
    autoUpdater.quitAndInstall(report.filePath);
  });

  autoUpdater.once("metadata", async (metadata) => {
    logger.info("start downloading");
    MainWindow.Window?.hide();
    await createUpdateWindow({
      preloadData: {
        curSize: 0,
        fileSize: metadata.size,
      },
      autoUpdater: autoUpdater,
    });
  });
});
export default autoUpdater;
