/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Router } from "express";
import passport from "@serv/passport.config";
import { sign } from "@serv/util/jwt";

const router = Router();
router.post(
  "/local",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    session: true,
  })
);
router.get("/check", (req, res) => {
  if (!req.isAuthenticated()) return res.status(403);
  return res.status(200).sendSuccess(req.user);
});
router.get("/logout", (req, res) => {
  res.set("X-Access-Token", "");
  res.send({ status: true, msg: "success", data: {} });
});
// router.use((req, res, next) => {
//   if (!req.user) return next();
//   res.cookie("token", sign(req.user));
//   res.redirect("/");
// });
export default router;
