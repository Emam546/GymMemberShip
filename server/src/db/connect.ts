import { NodeEnvs } from "@serv/declarations/enums";
import EnvVars from "@serv/declarations/major/EnvVars";
import mongoose from "mongoose";
export const dbName = "GymMemberShip";
let cached: mongoose.Mongoose;
export default async function connect(url: string, autoIndex = false) {
  if (cached) return cached;
  cached = await mongoose.connect(url, {
    minPoolSize: 10, // Can now run 10 operations at a time
    autoIndex: true,
    dbName,
  });
  return cached;
}
