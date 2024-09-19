/**
 * Pre-start is where we want to place things that must run BEFORE the express
 * server is started. This is useful for environment variables, command-line
 * arguments, and cron-jobs.
 */

import dotenv from "dotenv";
import commandLineArgs from "command-line-args";

// **NOTE** Do not import any local paths here, or any libraries dependent
// on environment variables.

// **** Setup command line options **** //
import "module-alias/register";
import path from "path";
import { addAliases } from "module-alias";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
addAliases({
  "@serv": path.join(__dirname),
});
const options = commandLineArgs([
  {
    name: "env",
    alias: "e",
    defaultValue: "development",
    type: String,
  },
]);
// **** Set the env file **** //

const result2 = dotenv.config({
  path: `${String(options.env)}.env`,
});

if (result2.error) {
  throw result2.error;
}
