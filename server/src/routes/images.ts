import { Router } from "express";
import path from "path";
import fs from "fs";
const router = Router();
const Imagespath = "./sources/backgrounds";
router.get("/names", (req, res) => {
  res.sendSuccess(fs.readdirSync(Imagespath));
});
router.get("/:name", (req, res) => {
  const imageName = req.params.name;

  // Define possible extensions to search for
  const extensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

  // Check for the image with any of the extensions
  const ext = extensions.find((ext) => {
    const imagePath = path.join("./sources/backgrounds", `${imageName}${ext}`);
    if (fs.existsSync(imagePath)) return true;
    return false;
  });

  // If an image is found, send it, otherwise send a 404 error
  if (ext) {
    res.sendFile(path.join("./sources/backgrounds", `${imageName}${ext}`));
  } else {
    res.status(404).send("Image not found");
  }
});

export default router;
