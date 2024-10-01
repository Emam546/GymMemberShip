import passport from "passport";
import EnvVars from "@serv/declarations/major/EnvVars";
import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { MixedExtract } from "./utils";
import Admins from "@serv/models/admins";
// eslint-disable-next-line @typescript-eslint/no-empty-interface

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: MixedExtract(),
      secretOrKey: EnvVars.jwt.secret,
      jsonWebTokenOptions: EnvVars.jwt.options,
    },
    function (jwt_payload, done) {
      return done(null, jwt_payload);
    }
  )
);
passport.use(
  new LocalStrategy(async (id, password, done): Promise<void> => {
    const user = await Admins.findById(id);
    if (!user) return done(null, false, { message: "Incorrect username." });
    if (user.password != password)
      return done(null, false, { message: "Incorrect password." });
    return done(null, user.toJSON());
  })
);
passport.serializeUser(function (profile, cb) {
  cb(null, profile);
});

passport.deserializeUser(function (id, cb) {
  cb(null, id as Express.User);
});
export default passport;
