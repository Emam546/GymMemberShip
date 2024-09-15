import { Router } from "express";
import cors from "cors";

const router = Router();

router.use(cors({ origin: "*" }));
export default router;
