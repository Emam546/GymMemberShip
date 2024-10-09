/* eslint-disable no-console */
// eslint-disable-next-line node/no-process-env
import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import path from "path";
const Chrome_PATH = process.env.CHROME_PATH;
function getChromiumExecPath() {
  return path
    .join(
      path.resolve(
        __dirname,
        "../../../node_modules/whatsapp-web.js/node_modules/puppeteer-core/.local-chromium/win64-1045629/chrome-win"
      ),
      "chrome.exe"
    )
    .replace("app.asar", "app.asar.unpacked");
}
console.log(getChromiumExecPath());
const whatsappClient = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath: Chrome_PATH ?? getChromiumExecPath(),
    headless: true,
    defaultViewport: null,
    args: [
      "--fast-start",
      "--disable-extensions",
      "--no-sandbox",
      "--disable-gpu",
      "--remote-debugging-port=9222",
      "--headless",
      "--start-maximized",
    ],
    ignoreHTTPSErrors: true,
  },
});
export let isConnected = false;
export function connectWhatsapp(timeOut = 5000) {
  return new Promise<boolean>((res, rej) => {
    if (isConnected) return res(true);
    whatsappClient.initialize();
    console.log("start connecting to whatsapp");
    whatsappClient.once("ready", () => {
      console.log("connected to whatsapp");
      res(true);
    });
    whatsappClient.once("auth_failure", (err) => {
      console.log(err);
      rej(err);
    });
    setTimeout(() => {
      res(false);
    }, timeOut);
  });
}
whatsappClient.on("qr", (qr) => {
  console.log(`QR:${qr}`);
  if (!process.env.ELECTRON_RUN_AS_NODE) qrcode.generate(qr, { small: true });
});
whatsappClient.on("authenticated", () => {
  isConnected = true;
});
whatsappClient.on("disconnected", (reason) => {
  console.log("Client was disconnected:", reason);
  isConnected = false;
});

export default whatsappClient;
// Start the client
