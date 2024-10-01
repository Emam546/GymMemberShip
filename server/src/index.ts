import "./pre-start"; // Must be the first import
import "./validator";
import logger from "jet-logger";
import EnvVars from "@serv/declarations/major/EnvVars";
import HttpStatusCodes from "@serv/declarations/major/HttpStatusCodes";
import server from "./server";
import next from "next";
import { serverStart } from "./command";
import connect from "./db/connect";
// **** Start server **** //
const dev = EnvVars.nodeEnv == "development";
const app = next({ dev, dir: EnvVars.dir });
// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
logger.info(`NEXT PATH ${EnvVars.dir}`);
const handle = app.getRequestHandler();
// **** Start server **** //
logger.info(`${EnvVars.nodeEnv}`);
connect(EnvVars.mongo.url).then(() => {
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
  function shutDown() {
    app.close();
  }
  process.on("SIGTERM", shutDown);
  process.on("SIGINT", shutDown);
});
