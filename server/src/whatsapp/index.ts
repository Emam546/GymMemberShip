/* eslint-disable no-console */
import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
// eslint-disable-next-line node/no-process-env
const Chrome_Path = process.env.CHROME_PATH;
const whatsappClient = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: Chrome_Path
    ? {
        executablePath: Chrome_Path,
      }
    : undefined,
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
  qrcode.generate(qr, { small: true });
});
whatsappClient.on("authenticated", (auth) => {
  isConnected = true;
});
whatsappClient.on("disconnected", (reason) => {
  console.log("Client was disconnected:", reason);
  isConnected = false;
});

export default whatsappClient;
// Start the client
