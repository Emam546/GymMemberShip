import { Router } from "express";
import path from "path";
import fs from "fs";
const router = Router();
const ImagesPath = "./sources/";
router.get("/*", (req, res, next) => {
  const paths = (req.params as { 0: string })[0];
  const dynamicPaths = paths; // Split the path into individual segments
  // Define possible extensions to search for
  const extensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

  // Check for the image with any of the extensions
  const ext = extensions.find((ext) => {
    const imagePath = path.join(ImagesPath, `${dynamicPaths}${ext}`);
    if (fs.existsSync(imagePath)) return true;
    return false;
  });

  // If an image is found, send it, otherwise send a 404 error
  if (ext) {
    res.sendFile(path.join(ImagesPath, `${dynamicPaths}${ext}`), {
      root: process.cwd(),
    });
  } else {
    // res.status(404).send("Image not found");
    next();
  }
});

export default router;
