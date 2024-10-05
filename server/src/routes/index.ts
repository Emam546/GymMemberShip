import { Router } from "express";
import cors from "cors";
import adminRoute from "./admin";
import imagesRoute from "./images";
const router = Router();

router.use(cors({ origin: "*" }));
router.use("/admin", adminRoute);
router.use("/images", imagesRoute);
export default router;
