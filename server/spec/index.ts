import "./pre-start";
import supertest from "supertest";
import connect from "@serv/db/connect";
import server from "@serv/server";
import EnvVars from "@serv/declarations/major/EnvVars";
import mongoose from "mongoose";
const agent = supertest(server);
beforeAll(async () => {
  await connect(EnvVars.mongo.url);
});
afterAll(async () => {
  await mongoose.disconnect();
});
jest.setTimeout(10000);
export default agent;
