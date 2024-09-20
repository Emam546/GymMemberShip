/* eslint-disable no-console */
import { is } from "@electron-toolkit/utils";
import { app } from "electron";
console.log(process.env.NODE_ENV);
export const isProd =
  app.isPackaged || !is.dev || process.env.NODE_ENV == "production";
export const isDev =
  process.env.NODE_ENV == "development" && is.dev && !app.isPackaged;

export function getEnv() {
  if (isProd) return "production";
  if (isDev) return "development";
  return "testing";
}
console.log("production", isProd);
console.log("development", isDev);
