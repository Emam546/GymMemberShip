import { app, BrowserWindow } from "electron";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { serverStart, whatsappReady } from "@serv/command";
import path from "path";
import { getEnv } from "./utils";
import { createQrCodeWindow } from "./lib/qrCode";

const appName = app.getPath("exe");

const expressPath = app.isPackaged
  ? path.join(app.getAppPath(), "out/server/index.js")
  : "./out/server/index.js";
const utf16Decoder = new TextDecoder("UTF-8");
const command = [expressPath, `--env=${getEnv()}`];

export class ExpressServer {
  static expressProcess: ChildProcessWithoutNullStreams | null = null;
  constructor() {}
  async runServer() {
    if (ExpressServer.expressProcess) return false;
    console.log("start server");
    ExpressServer.expressProcess =
      await new Promise<ChildProcessWithoutNullStreams>((res, rej) => {
        const expressAppProcess = spawn(`${appName}`, command, {
          env: {
            ELECTRON_RUN_AS_NODE: "1",
            dir: app.isPackaged ? app.getAppPath() : "./",
            ...process.env,
          },
        }).on("error", (e) => {
          rej(e);
        });
        expressAppProcess.stderr.on("data", (e) => {
          const text = utf16Decoder.decode(e);
          console.error("StdOut Error", text);
        });
        expressAppProcess.stdout.on("data", (data: Buffer) => {
          const text = utf16Decoder.decode(data);
          console.log(text.replaceAll("\n", ""));
          const state = text.split("\n").includes(serverStart);
          if (state) res(expressAppProcess);
        });
        expressAppProcess.stdout.on("data", async (data: Buffer) => {
          const text = utf16Decoder.decode(data).replace("\n", "");
          const state = /^QR:/.test(text);
          if (!state) return;
          console.log("state");
          const qrCode = text.replace(/^QR:/, "");
          this.runWhatsappWindow(qrCode, expressAppProcess);
        });
        expressAppProcess.on("close", () => {
          rej("server killed");
          app.quit();
        });
        app.once("quit", () => {
          console.log("server killed");
          rej("server killed");
          if (!expressAppProcess.killed) expressAppProcess.kill();
        });
        process.on("SIGKILL", () => {
          expressAppProcess.kill();
        });
        process.on("exit", () => {
          expressAppProcess.kill();
        });
      });
    console.log("server started");
    return ExpressServer.expressProcess;
  }
  whatsappWin?: BrowserWindow;
  private async runWhatsappWindow(
    qrCode: string,
    server: ChildProcessWithoutNullStreams
  ) {
    this.whatsappWin?.close();
    this.whatsappWin = await createQrCodeWindow({ preloadData: { qrCode } });
    const G = (data: Buffer) => {
      const text = utf16Decoder.decode(data);
      const state = text.split("\n").includes(whatsappReady);

      if (!state) return;
      this.whatsappWin?.close();
    };
    server.stdout.on("data", G);
    this.whatsappWin.on("close", () => {
      server.stdout.removeListener("data", G);
    });
  }
}
