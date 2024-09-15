import { NodeEnvs } from "@serv/declarations/enums";
import EnvVars from "@serv/declarations/major/EnvVars";
import mongoose from "mongoose";
export const dbName = "Resume";
const connect = (url: string, autoIndex = false) => {
    return mongoose.connect(url, {
        minPoolSize: 10, // Can now run 10 operations at a time
        autoIndex: EnvVars.nodeEnv === NodeEnvs.Dev || autoIndex,
        dbName,
    });
};
export default connect;
