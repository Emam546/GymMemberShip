import { dialog } from "electron";
import fs from "fs";
export async function SaveFile(data: Buffer, filename: string) {
  const { canceled, filePath: newpath } = await dialog.showSaveDialog({
    title: "Save PDF",
    defaultPath: filename,
    filters: [{ name: "PDF Files", extensions: ["pdf"] }],
  });
  if (canceled || !newpath) return null;
  fs.writeFileSync(newpath, data);
  return newpath;
}
