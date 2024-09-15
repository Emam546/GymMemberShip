import { app } from "electron";
import { spawn } from "child_process";
import { serverStart } from "@serv/command";
import path from "path";

const appName = app.getPath("exe");

const expressPath = app.isPackaged
  ? path.join(app.getAppPath(), "out/server/index.js")
  : "./out/server/index.js";
const utf16Decoder = new TextDecoder("UTF-8");
const command = `-r module-alias/register ${expressPath} --env=${process.env.NODE_ENV}`;
export function RunServer() {
  return new Promise((res, rej) => {
    const expressAppProcess = spawn(`${appName}`, command.split(" "), {
      env: {
        ELECTRON_RUN_AS_NODE: "1",
        ...process.env,
      },
    });
    expressAppProcess.stderr.on("data", (e) => {
      const text = utf16Decoder.decode(e);
      console.error("Error", text);
    });
    expressAppProcess.stdout.on("data", (data: Buffer) => {
      const text = utf16Decoder.decode(data);
      const state = text.split("\n").includes(serverStart);
      if (state) res([expressAppProcess.stdout, expressAppProcess.stderr]);
    });
  });
}
