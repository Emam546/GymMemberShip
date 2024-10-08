import "./pre-start";
import supertest, { SuperTest, Test } from "supertest";
import connect from "@serv/db/connect";
import server from "@serv/server";
import EnvVars from "@serv/declarations/major/EnvVars";
import mongoose from "mongoose";
import { expect } from "chai";
import Admins from "@serv/models/admins";
import { InitDataBase } from "@serv/db/init";

beforeAll(async () => {
  await connect(EnvVars.mongo.url);
  await InitDataBase();
});
afterAll(async () => {
  await mongoose.disconnect();
});
let cookies: string;
beforeAll(async () => {
  const admins = await Admins.find({}).select("+password");
  const admin = admins[0];
  const res = await agent
    .post("/api/admin/admins/auth/login")
    .send({
      id: admin._id,
      password: admin.password,
    })
    .expect(200);
  expect(res.body.data).not.undefined;
  expect(res.body.data.password).undefined;
  cookies = res.headers["set-cookie"];
});
const hook =
  <T extends "put" | "get" | "delete" | "post">(method: T) =>
  (...args: Parameters<SuperTest<Test>[T]>) =>
    supertest(server)
      [method](args as any)
      .set("Cookie", cookies || "");

const agent = {
  post: hook("post"),
  get: hook("get"),
  put: hook("put"),
  delete: hook("delete"),
};
export default agent;
