import { Router } from "express";
import cors from "cors";
import adminRoute from "./admin";
import usersRoute from "./users";
const router = Router();

router.use(cors({ origin: "*" }));
router.use("/admin", adminRoute);
router.use("/users", usersRoute);
export default router;
