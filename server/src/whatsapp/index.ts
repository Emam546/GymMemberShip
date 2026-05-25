import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import path from "path";
import { whatsappReady } from "@serv/command";
import logger from "jet-logger";
import puppeteer from "puppeteer";
import EnvVars from "@serv/declarations/major/EnvVars";
// eslint-disable-next-line node/no-process-env
const Chrome_PATH = process.env.CHROME_PATH;
async function getChromiumExecPath() {
  return path
    .join(await puppeteer.executablePath())
    .replace("app.asar", "app.asar.unpacked");
}
let whatsappClient: Client | null = null;
export let isConnected = false;
export async function connectWhatsapp(timeOut = 5000) {
  logger.info("connecting");
  const client = new Client({
    authStrategy: new LocalAuth({
      clientId: "main",
    }),
    puppeteer: {
      executablePath: Chrome_PATH ?? (await getChromiumExecPath()),
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
  process.on("SIGINT", async () => {
    try {
      await client?.destroy();
    } catch {
      /* empty */
    }
  });
  const res = await new Promise<boolean>((res, rej) => {
    if (isConnected) return res(true);
    const func = async () => {
      try {
        const response = await fetch("https://web.whatsapp.com/");
        if (!response.ok) return;
        logger.info("start connecting to whatsapp");
        await client.initialize();
      } catch (error) {
        logger.err(error);
        setTimeout(func, timeOut);
      }
    };
    func();
    client.once("ready", () => {
      // eslint-disable-next-line no-console
      console.log(whatsappReady);
      res(true);
    });
    client.once("auth_failure", (err) => {
      logger.err(err);
      rej(err);
    });
    setTimeout(() => {
      logger.warn("whatsapp timeout");
      res(false);
    }, timeOut);
  });
  if (!res) return false;
  client.on("qr", (qr) => {
    // eslint-disable-next-line no-console
    console.log(`QR:${qr}`);
    if (!EnvVars.electronAsNode) qrcode.generate(qr, { small: true });
  });
  client.on("authenticated", () => {
    isConnected = true;
  });
  client.on("disconnected", (reason) => {
    logger.info(`Client was disconnected: ${reason}`);
    isConnected = false;
  });
  whatsappClient = client;
  return true;
}

export default whatsappClient;
// Start the client
