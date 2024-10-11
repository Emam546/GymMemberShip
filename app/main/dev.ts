import app from "./index";
import { createQrCodeWindow } from "./lib/qrCode";
import { createStartWindow } from "./lib/start";
app.on("ready", async () => {
  // await createQrCodeWindow({ preloadData: { qrCode: "Me" } });
  // await createStartWindow({ preloadData: {} });
});
