import { faker } from "@faker-js/faker";

import agent from "@test/index";
import { expect } from "chai";
import { createSubscription, createSubscriptionRequest } from "./utils";
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
    .send(createSubscription(plan._id, user._id))
    .expect(200);
  payment = res.body.data;
});
type Doc = DataBase.Populate.Model<
  DataBase.WithId<DataBase.Models.Subscriptions>,
  "userId" | "planId" | "adminId"
>;
describe("GET", () => {
  let payment: DataBase.WithId<DataBase.Models.Subscriptions>;
  beforeAll(async () => {
    payment = await createSubscriptionRequest(plan._id, user._id);
  });
  test("Success", async () => {
    const res = await agent.get(`/api/admin/subscriptions/query`);
    console.log(res.body);
    expect(res.statusCode).eq(200);
    const data = res.body.data as Doc[];
    expect(data.length).greaterThan(0);
    const doc = data.find((doc) => {
      return doc.userId?._id == user._id;
    });
    expect(doc).not.undefined;
    expect(doc?.planId).not.instanceOf(String);
  });
  test("use limit", async () => {
    const res = await agent
      .get(`/api/admin/subscriptions/query`)
      .query({ limit: 1 });
    expect(res.statusCode).eq(200);
    const data = res.body.data as Doc[];
    expect(data.length).eq(1);
  });
  test("get active payments", async () => {
    const res = await agent
      .get(`/api/admin/subscriptions/query`)
      .query({ active: "true" });
    console.log(res.body);
    expect(res.statusCode).eq(200);
    const data = res.body.data as Doc[];
    const doc = data.some((doc) => {
      return new Date(doc.endAt) > new Date() && doc.logsCount >= doc.plan.num;
    });
    expect(doc).false;
  });
  describe("get inactive payments", () => {
    test("num is 0", async () => {
      const paymentData = createSubscription(plan._id, user._id);
      paymentData.plan.num = 0;
      const resPayment = await agent
        .post("/api/admin/subscriptions")
        .send(paymentData);
      const payment = resPayment.body.data;
      const res = await agent
        .get(`/api/admin/subscriptions/query`)
        .query({ active: "false" });
      expect(res.statusCode).eq(200);
      const data = res.body.data as Doc[];
      expect(data.length).greaterThan(0);
      const state = data.find((doc) => {
        return new Date(doc.endAt) > new Date() && doc.logsCount < doc.plan.num;
      });
      expect(state).undefined;
      const doc = data.find((doc) => {
        return doc.userId?._id == user._id;
      });
      expect(doc).not.undefined;
      expect(doc?._id).eq(payment._id);
      expect(doc?.planId?._id).eq(plan._id);
    });
  });
  describe("get by start at", () => {
    test("greater than or equal", async () => {
      const cur = new Date();
      const paymentData = createSubscription(plan._id, user._id);
      const startAt = new Date(
        cur.getFullYear(),
        cur.getMonth() + 2,
        cur.getDate()
      );
      paymentData.startAt = startAt;
      paymentData.endAt = new Date(startAt.getTime() + 10000);
      const resPayment = await agent
        .post("/api/admin/subscriptions")
        .send(paymentData);
      const res = await agent.get(`/api/admin/subscriptions/query`).query({
        startAt: startAt.getTime(),
      });
      const data = res.body.data as Doc[];
      expect(res.statusCode).eq(200);
      expect(data.find((doc) => doc.startAt < startAt)).undefined;
      expect(data.length).greaterThan(0);
      console.log(resPayment.body, data);
      const doc = data.find((doc) => {
        return doc.userId?._id == resPayment.body.data.userId;
      });
      expect(doc).not.undefined;
      expect(doc?.planId?._id).eq(resPayment.body.data.planId);
    });
    test("lower than or equal", async () => {
      const cur = new Date();
      const paymentData = createSubscription(plan._id, user._id);
      const startAt = new Date(
        cur.getFullYear(),
        cur.getMonth() - 2,
        cur.getDate()
      );
      paymentData.startAt = startAt;
      const resPayment = await agent
        .post("/api/admin/subscriptions")
        .send(paymentData);
      const res = await agent.get(`/api/admin/subscriptions/query`).query({
        endAt: new Date(startAt.getTime() + 100),
      });
      const data = res.body.data as Doc[];
      expect(res.statusCode).eq(200);
      expect(data.find((doc) => doc.startAt > startAt)).undefined;
      expect(data.length).greaterThan(0);
      const doc = data.find((doc) => {
        return doc.userId?._id == resPayment.body.data.userId;
      });
      expect(doc).not.undefined;
    });
  });
});
