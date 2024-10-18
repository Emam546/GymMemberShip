import Validator from "validator-checker-js";
import { Router } from "express";
import path from "path";
import { v4 as uuid } from "uuid";
import { RouteError } from "@serv/declarations/classes";
import fs from "fs";
import { fileFolder } from "./utils";
const router = Router();
const registerValidator = new Validator({});
router.post("/", async (req, res) => {
  if (!req.headers["content-type"]?.startsWith("multipart/form-data"))
    return res.status(400).sendFailed("invalid Content Type");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const result = registerValidator.passes(req.body["data"]);
  if (!result.state)
    return res.status(400).sendFailed("invalid Data", result.errors);
  const results = await Promise.all(
    Object.values(req.files || {}).map(async (file, i) => {
      if (file instanceof Array)
        throw new RouteError(400, `the ${i} index should contain one file`);
      const fileName = `${uuid()}${path.extname(file.name)}`;
      const uploadPath = path.join("uploads", fileName);
      await file.mv(uploadPath);
      return fileName;
    })
  );

  res.status(200).sendSuccess(results);
});
router.delete("/:filename", (req, res) => {
  try {
    fs.unlinkSync(path.join(fileFolder, req.params.filename));
    res.status(200).sendSuccess(true);
  } catch (error) {
    res.status(404).sendFailed("the files is not exist");
  }
});
export default router;
