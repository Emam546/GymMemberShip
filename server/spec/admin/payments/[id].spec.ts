import { faker } from "@faker-js/faker";

import agent from "@test/index";
import { expect } from "chai";
import { createPayment } from "./utils";
import { createPlanRequest } from "../plans/utils";
import { createUserRequest } from "../users/utils";

let payment: DataBase.WithId<DataBase.Models.Payments>;
let user: DataBase.WithId<DataBase.Models.User>;
let plan: DataBase.WithId<DataBase.Models.Plans>;
beforeAll(async () => {
  user = await createUserRequest();
  plan = await createPlanRequest();
});
beforeAll(async () => {
  const res = await agent
    .post("/api/admin/payments")
    .send(createPayment(plan._id, user._id))
    .expect(200);
  payment = res.body.data;
});
describe("GET", () => {
  test("Success", async () => {
    const res = await agent
      .get(`/api/admin/payments/${payment._id}`)
      .expect(200);
  });
  test("WrongId", async () => {
    const res = await agent.get(`/api/admin/payments/WrongId`);
    expect(res.statusCode).eq(404);
    expect(res.body.status).false;
  });
});
describe("POST", () => {
  test("Success", async () => {
    const newPayment = createPayment(plan._id, user._id);
    const newData: Partial<DataBase.WithId<DataBase.Models.Payments>> = {
      paid: 0,
      plan: {
        num: 0,
        type: "day",
      },
    };
    const res = await agent
      .post(`/api/admin/payments/${payment._id}`)
      .send({ ...newData })
      .expect(200);
    expect({ ...payment, ...newData }).deep.eq(res.body.data);
  });
  test("WrongId", async () => {
    const newUser = createPayment(plan._id, user._id);
    const res = await agent
      .post(`/api/admin/payments/WrongId`)
      .send({ ...newUser })
      .expect(404);
    expect(res.body.status).false;
  });

  test("Update New UserId", async () => {
    const userId = "NewID";
    const res = await agent
      .post(`/api/admin/payments/${payment._id}`)
      .send({ userId })
      .expect(400);
  });
});
describe("DELETE", () => {
  let payment: DataBase.WithId<DataBase.Models.Payments>;
  beforeEach(async () => {
    const res = await agent
      .post("/api/admin/payments")
      .send(createPayment(plan._id, user._id))
      .expect(200);
    payment = res.body.data;
  });
  test("Success", async () => {
    await agent.delete(`/api/admin/payments/${payment._id}`).expect(200);
    await agent.get(`/api/admin/payments/${payment._id}`).expect(404);
  });
});
describe("Logs", () => {
  test("incremental log adding", async () => {
    const res = await agent
      .get(`/api/admin/payments/${payment._id}`)
      .expect(200);
    await agent.post(`/api/admin/payments/${payment._id}/logs`).expect(200);
    const res2 = await agent
      .get(`/api/admin/payments/${payment._id}`)
      .expect(200);
    expect(res.body.data.logsCount).eq(res2.body.data.logsCount - 1);
  });
});
