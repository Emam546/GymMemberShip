/* eslint-disable node/no-process-env */
import { SignOptions } from "jsonwebtoken";

export default {
  nodeEnv: process.env.NODE_ENV ?? "",
  port: process.env.PORT ?? 0,
  mongo: {
    url: process.env.MONGODB_URL ?? "",
  },
  cookieProps: {
    key: "ExpressGeneratorTs",
    secret: process.env.COOKIE_SECRET ?? "",
    options: {
      httpOnly: true,
      signed: true,
      path: process.env.COOKIE_PATH ?? "",
      maxAge: Number(process.env.COOKIE_EXP ?? 0),
      domain: process.env.COOKIE_DOMAIN ?? "",
      secure: process.env.SECURE_COOKIE === "true",
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? "",
    options: { expiresIn: process.env.COOKIE_EXP ?? "" } as SignOptions,
  },
  dir: process.env.DIR,
} as const;
