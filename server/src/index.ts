import "./pre-start"; // Must be the first import
import "./validator";
import logger from "jet-logger";
import EnvVars from "@serv/declarations/major/EnvVars";
import server from "./server";
import next from "next";
import { serverStart } from "./command";
import connect from "./db/connect";
import { InitDataBase as PreStartDataBase } from "./db/init";
import { connectWhatsapp } from "./whatsapp";
// **** Start server **** //
const dev = EnvVars.nodeEnv == "development";
const app = next({ dev, dir: EnvVars.dir });
logger.info(`NEXT PATH ${EnvVars.dir || "undefined"}`);
const handle = app.getRequestHandler();
// **** Start server **** //
logger.info(`${EnvVars.nodeEnv}`);
connect(EnvVars.mongo.url).then(async () => {
  await PreStartDataBase();
  await connectWhatsapp(EnvVars.whatsapp.timeout);
  await app
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
    .catch(logger.err);

  function shutDown() {
    logger.info("shut down");
    app.close();
  }
  process.on("SIGTERM", shutDown);
  process.on("SIGINT", shutDown);
});
