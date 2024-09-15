import "./pre-start"; // Must be the first import
import logger from "jet-logger";
import EnvVars from "@serv/declarations/major/EnvVars";
import server from "./server";
import next from "next";
import { serverStart } from "./command";
// **** Start server **** //
const dev = EnvVars.nodeEnv == "development";
const app = next({ dev });
const handle = app.getRequestHandler();
// **** Start server **** //
logger.info(`${EnvVars.nodeEnv}`);
app
  .prepare()
  .then(() => {
    server.get("*", (req, res) => {
      return handle(req, res);
    });

    const msg = "Express server started on port: " + EnvVars.port.toString();
    server.listen(EnvVars.port, () => {
      // eslint-disable-next-line no-console
      console.log(serverStart);
      logger.info(msg);
    });
  })
  .catch((ex) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    logger.err(ex.stack);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });
process.on("SIGTERM", () => app.close());
process.on("SIGINT", () => app.close());
server.on("close", () => console.log("Express server closed."));
