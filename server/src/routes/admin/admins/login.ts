/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Router } from "express";
import passport from "@serv/passport.config";

const router = Router();
router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    {
      session: true,
    },
    (
      err: Error | null,
      user: Express.User | false,
      message: { message: string }
    ) => {
      if (err) throw err;
      if (!user) return res.status(403).sendFailed(message.message);
      req.logIn(user, () => {
        res.sendSuccess(user);
      });
    }
  )(req, res, next);
});
router.get("/check", (req, res) => {
  if (!req.user) return res.status(403).sendFailed("not authorized");
  return res.status(200).sendSuccess(req.user);
});
router.get("/logout", (req, res) => {
  res.set("X-Access-Token", "");
  res.send({ status: true, msg: "success", data: {} });
});
router.use((req, res, next) => {
  if (!req.user) return next();
  res.redirect("/");
});
export default router;
