import { app } from "electron";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { serverStart } from "@serv/command";
import path from "path";
import { getEnv } from "./utils";

const appName = app.getPath("exe");

const expressPath = app.isPackaged
  ? path.join(app.getAppPath(), "out/server/index.js")
  : "./out/server/index.js";
const utf16Decoder = new TextDecoder("UTF-8");
const command = [expressPath, `--env=${getEnv()}`];

export function RunServer() {
  return new Promise<ChildProcessWithoutNullStreams>((res, rej) => {
    const expressAppProcess = spawn(`${appName}`, command, {
      env: {
        ELECTRON_RUN_AS_NODE: "1",
        dir: app.isPackaged ? app.getAppPath() : "./",
        ...process.env,
      },
    }).on("error", (e) => {
      console.log(e);
    });
    expressAppProcess.stderr.on("data", (e) => {
      const text = utf16Decoder.decode(e);
      console.error("Error", text);
    });
    expressAppProcess.stdout.on("data", (data: Buffer) => {
      const text = utf16Decoder.decode(data);
      console.log(text.replaceAll("\n", ""));
      const state = text.split("\n").includes(serverStart);
      if (state) res(expressAppProcess);
    });
  });
}
