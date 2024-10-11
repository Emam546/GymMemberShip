import { ConvertToIpCHandleMainFunc, ConvertToIpCMainFunc } from "@shared/api";
import { Api } from "@shared/renderer/start";
import path from "path";
import fs from "fs";
import mime from "mime-types";
import { ObjectEntries } from "@utils/index";
import { ipcMain } from "electron";
type OnMethodsType = {
  [K in keyof Api.OnMethods]: ConvertToIpCMainFunc<Api.OnMethods[K]>;
};
type OnceMethodsType = {
  [K in keyof Api.OnceMethods]: ConvertToIpCMainFunc<Api.OnceMethods[K]>;
};
type HandelMethodsType = {
  [K in keyof Api.HandleMethods]: ConvertToIpCHandleMainFunc<
    Api.HandleMethods[K]
  >;
};
type HandelOnceMethodsType = {
  [K in keyof Api.HandleOnceMethods]: ConvertToIpCHandleMainFunc<
    Api.HandleOnceMethods[K]
  >;
};
export type FlagType = "w" | "a";
export const OnMethods: OnMethodsType = {};
export const OnceMethods: OnceMethodsType = {};

export const HandleMethods: HandelMethodsType = {
  getData(_, src) {
    const ImagesPath = "./sources/";
    const extensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

    // Check for the image with any of the extensions
    const ext = extensions.find((ext) => {
      const imagePath = path.join(ImagesPath, `${src}${ext}`);
      console.log(imagePath);
      if (fs.existsSync(imagePath)) return true;
      return false;
    });
    if (!ext) return null;

    return `data:${mime.contentType(ext)};base64,${fs
      .readFileSync(path.join(ImagesPath, `${src}${ext}`))
      .toString("base64")}`;
  },
};

export const HandleOnceMethod: HandelOnceMethodsType = {};
ObjectEntries(HandleMethods).forEach(([key, val]) => {
  ipcMain.handle(key, val);
});
