import { faker } from "@faker-js/faker";
import { createLog } from "./index.spec";
import { user, plan } from "../payments/index.spec";
import { payment } from "../payments/[id].spec";
import agent from "@test/index";
import { expect } from "chai";
let log: DataBase.WithId<DataBase.Models.Logs>;
beforeAll(async () => {
  const res = await agent
    .post("/api/admin/logs")
    .send(createLog(plan._id, user._id, payment._id))
    .expect(200);
  log = res.body.data;
});
describe("GET", () => {
  test("Success", async () => {
    const res = await agent.get(`/api/admin/logs/${log._id}`).expect(200);
    expect(log).deep.eq(res.body.data);
  });
  test("WrongId", async () => {
    const res = await agent.get(`/api/admin/logs/WrongId`);
    expect(res.statusCode).eq(404);
    expect(res.body.status).false;
  });
});

describe("DELETE", () => {
  let log: DataBase.WithId<DataBase.Models.Logs>;
  beforeEach(async () => {
    const res = await agent
      .post("/api/admin/logs")
      .send(createLog(plan._id, user._id, payment._id))
      .expect(200);
    log = res.body.data;
  });
  test("Success", async () => {
    await agent.delete(`/api/admin/logs/${log._id}`).expect(200);
    await agent.get(`/api/admin/logs/${log._id}`).expect(404);
  });
});
