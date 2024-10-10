import { faker } from "@faker-js/faker";

import agent from "@test/index";
import { expect } from "chai";
import { createPayment } from "./utils";
import { createPlanRequest } from "../plans/utils";
import { createUserRequest } from "../users/utils";
import { createTrainerData, createTrainerRequest } from "../trainers/utils";

let payment: DataBase.WithId<DataBase.Models.Subscriptions>;
let user: DataBase.WithId<DataBase.Models.User>;
let plan: DataBase.WithId<DataBase.Models.Plans>;
beforeAll(async () => {
  user = await createUserRequest();
  plan = await createPlanRequest();
});
beforeAll(async () => {
  const res = await agent
    .post("/api/admin/subscriptions")
    .send(createPayment(plan._id, user._id))
    .expect(200);
  payment = res.body.data;
});
describe("GET", () => {
  test("Success", async () => {
    const res = await agent
      .get(`/api/admin/subscriptions/${payment._id}`)
      .expect(200);
  });
  test("WrongId", async () => {
    const res = await agent.get(`/api/admin/subscriptions/WrongId`);
    expect(res.statusCode).eq(404);
    expect(res.body.status).false;
  });
});
describe("POST", () => {
  test("Success", async () => {
    const newPayment = createPayment(plan._id, user._id);
    const newData: Partial<DataBase.WithId<DataBase.Models.Subscriptions>> = {
      paid: 0,
      plan: {
        num: 0,
        type: "day",
      },
    };
    const res = await agent
      .post(`/api/admin/subscriptions/${payment._id}`)
      .send({ ...newData })
      .expect(200);
    expect({ ...payment, ...newData }).deep.eq(res.body.data);
  });
  test("WrongId", async () => {
    const newUser = createPayment(plan._id, user._id);
    const res = await agent
      .post(`/api/admin/subscriptions/WrongId`)
      .send({ ...newUser })
      .expect(404);
    expect(res.body.status).false;
  });

  test("Update New UserId", async () => {
    const userId = "NewID";
    const res = await agent
      .post(`/api/admin/subscriptions/${payment._id}`)
      .send({ userId })
      .expect(400);
  });
});
describe("DELETE", () => {
  let payment: DataBase.WithId<DataBase.Models.Subscriptions>;
  beforeEach(async () => {
    const res = await agent
      .post("/api/admin/subscriptions")
      .send(createPayment(plan._id, user._id))
      .expect(200);
    payment = res.body.data;
  });
  test("Success", async () => {
    await agent.delete(`/api/admin/subscriptions/${payment._id}`).expect(200);
    await agent.get(`/api/admin/subscriptions/${payment._id}`).expect(404);
  });
});
describe("Logs", () => {
  test("Add a log by payment route", async () => {
    await agent
      .post(`/api/admin/subscriptions/${payment._id}/logs`)
      .expect(200);
    const res = await agent
      .get(`/api/admin/subscriptions/${payment._id}/logs`)
      .expect(200);
    expect(res.body.data.length).greaterThanOrEqual(1);
  });
  test("incremental log adding", async () => {
    const res = await agent
      .get(`/api/admin/subscriptions/${payment._id}`)
      .expect(200);
    await agent
      .post(`/api/admin/subscriptions/${payment._id}/logs`)
      .expect(200);
    const res2 = await agent
      .get(`/api/admin/subscriptions/${payment._id}`)
      .expect(200);
    expect(res.body.data.logsCount).eq(res2.body.data.logsCount - 1);
  });
  describe("Add a trainer log", () => {
    let trainer: DataBase.WithId<DataBase.Models.Trainers>;
    beforeAll(async () => {
      trainer = await createTrainerRequest();
    });
    test("Add", async () => {
      await agent
        .post(`/api/admin/subscriptions/${payment._id}/logs`)
        .send({
          trainerId: trainer._id,
        })
        .expect(200);
      const res = await agent.get(
        `/api/admin/subscriptions/${payment._id}/logs`
      );
      expect(res.body.data).instanceOf(Array);
      console.log(res.body.data);
      expect(
        (res.body.data as any[]).some((val: any) => {
          return val.trainerId._id == trainer._id;
        })
      ).true;
    });
  });
});
