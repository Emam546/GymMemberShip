import { NodeEnvs } from "@serv/declarations/enums";
import EnvVars from "@serv/declarations/major/EnvVars";
import mongoose from "mongoose";
export const dbName = "GymMemberShip";
const connect = (url: string, autoIndex = false) => {
  return mongoose.connect(url, {
    minPoolSize: 10, // Can now run 10 operations at a time
    autoIndex: EnvVars.nodeEnv !== NodeEnvs.Production || autoIndex,
    dbName,
  });
};
export default connect;
