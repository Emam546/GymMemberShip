import { contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Custom APIs for renderer
const api = electronAPI.ipcRenderer;
const data = process.argv.find((v) => v.startsWith("data-"));
const logoImage = process.argv.find((v) => v.startsWith("image-data-"));
let context = data
  ? JSON.parse(decodeURIComponent(data).replace(/^data-/, ""))
  : null;
const imageData = logoImage ? logoImage.replace(/^image-data-/, "") : null;
context = {
  ...context,
  logoImage: imageData,
};
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
    contextBridge.exposeInMainWorld("context", context);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
  // @ts-ignore (define in dts)
  window.context = context;
}
