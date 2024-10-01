import passport from "passport";
import EnvVars from "@serv/declarations/major/EnvVars";
import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { MixedExtract } from "./utils";
import Admins from "@serv/models/admins";
import mongoose from "mongoose";
// eslint-disable-next-line @typescript-eslint/no-empty-interface
declare module "express-session" {
  interface SessionData {
    user: Express.User;
  }
}
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
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User
      extends DataBase.WithId<Omit<DataBase.Models.Admins, "password">> {}
  }
}
passport.use(
  new LocalStrategy(
    { usernameField: "id" },
    async (id, password, done): Promise<void> => {
      try {
        if (!mongoose.Types.ObjectId.isValid(id))
          done(null, false, { message: "id-valid" });
        const user = await Admins.findById(id);
        if (!user) return done(null, false, { message: "id-not-exist" });
        if (user.password != password)
          return done(null, false, { message: "password-incorrect" });
        return done(null, {
          name: user.name,
          _id: user._id.toString(),
          type: user.type,
          email: user.email,
          phone: user.phone,
        });
      } catch (err) {
        return done(err, false, { message: "Error Happened" });
      }
    }
  )
);
passport.serializeUser(function (profile, cb) {
  cb(null, profile);
});

passport.deserializeUser(function (id, cb) {
  cb(null, id as Express.User);
});
export default passport;
