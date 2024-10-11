import app from "./index";
import { createStartWindow } from "./lib/start";
app.on("ready", async () => {
  console.log("Whatsapp");
  await createStartWindow({ preloadData: {} });
});
