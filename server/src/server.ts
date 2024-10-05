import cookieParser from "cookie-parser";
import "./express";
import "express-async-errors";
import helmet from "helmet";
import express, { NextFunction, Request, Response } from "express";
import baseRoute from "./routes/index";
import logger from "jet-logger";
import EnvVars from "@serv/declarations/major/EnvVars";
import HttpStatusCodes from "@serv/declarations/major/HttpStatusCodes";
import { NodeEnvs } from "@serv/declarations/enums";
import { RouteError, RouteErrorHasError } from "@serv/declarations/classes";
import passport from "./passport.config";
import session from "express-session";
// **** Init express **** //
const app = express();

// **** Set basic express settings **** //
//Cross origins
app.use(
  session({
    secret: EnvVars.cookieProps.secret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser(EnvVars.cookieProps.secret));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.session());
app.use(passport.initialize());
// Show routes called in console during development
if (EnvVars.nodeEnv === NodeEnvs.Dev) {
  // app.use(morgan("dev"));
}

// Security
if (EnvVars.nodeEnv === NodeEnvs.Production) {
  app.use(helmet());
}
// **** Add API routes **** //
const folderToHost = "./locales";
// Use express.static middleware to serve the folder
app.use("/locales", express.static(folderToHost));
// Add APIs
app.use("/api", baseRoute);

// Setup error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(((err: Error, _: Request, res: Response, next: NextFunction) => {
  logger.err(err, true);
  let error: unknown;
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) status = err.status;
  if (err instanceof RouteErrorHasError) error = err.err;
  console.error(err);
  return res.status(status).SendFailed(err.message, error);
}) as any);

export default app;
