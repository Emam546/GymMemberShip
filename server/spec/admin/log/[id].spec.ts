import { faker } from "@faker-js/faker";
import { createLog } from "./utils";
import agent from "@test/index";
import { expect } from "chai";
import { createPaymentRequest } from "../subscriptions/utils";
import { createPlanRequest } from "../plans/utils";
import { createUserRequest } from "../users/utils";
let log: DataBase.WithId<DataBase.Models.Logs>;
let user: DataBase.WithId<DataBase.Models.User>;
let plan: DataBase.WithId<DataBase.Models.Plans>;
let payment: DataBase.WithId<DataBase.Models.Subscriptions>;
beforeAll(async () => {
  user = await createUserRequest();
  plan = await createPlanRequest();
  payment = await createPaymentRequest(plan._id, user._id);
});
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
    expect(res.body.data).not.undefined;
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
