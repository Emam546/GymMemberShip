import { Router } from "express";
import cors from "cors";
import adminRoute from "./admin";
const router = Router();

router.use(cors({ origin: "*" }));
router.use("/admin", adminRoute);
export default router;
