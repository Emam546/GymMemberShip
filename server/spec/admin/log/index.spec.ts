import agent from "@test/index";
import { expect } from "chai";
import { createLog } from "./utils";
import { createPlanRequest } from "../plans/utils";
import { createUserData, createUserRequest } from "../users/utils";
import { createPaymentRequest } from "../payments/utils";
let user: DataBase.WithId<DataBase.Models.User>;
let plan: DataBase.WithId<DataBase.Models.Plans>;
let payment: DataBase.WithId<DataBase.Models.Payments>;
beforeAll(async () => {
  user = await createUserRequest();
  plan = await createPlanRequest();
  payment = await createPaymentRequest(plan._id, user._id);
});
describe("POST", () => {
  test("success", async () => {
    const log = createLog(plan._id, user._id, payment._id);
    const res = await agent.post("/api/admin/logs").send(log);
    const resPayment = res.body.data;
    expect(resPayment._id).not.eq(undefined);
    expect(resPayment).deep.includes(log);
  });
  describe("Wrong", () => {
    test("Wrong UserId Type", async () => {
      const log = createLog(user._id, plan._id, payment._id);
      log.userId = "wrongId";
      const res = await agent.post("/api/admin/logs").send(log).expect(400);
      expect(res.body.err).has.property("userId");
    });
  });
});
describe("GET", () => {
  beforeAll(async () => {
    const log = createLog(plan._id, user._id, payment._id);
    await agent.post("/api/admin/logs").send(log).expect(200);
  });
  test("Success", async () => {
    const res = await agent.get("/api/admin/logs");
    expect(res.body.data).instanceOf(Array);
    expect(res.body.data.length).gt(0);
  });
  test("Test limit", async () => {
    const res = await agent.get("/api/admin/logs").query({ limit: 5 });
    expect(res.body.data).instanceOf(Array);
    expect(res.body.data.length).lte(5);
  });
  test("Test Skip", async () => {
    const res = await agent.get("/api/admin/logs").expect(200);
    expect(res.body.data).instanceOf(Array);
    const res2 = await agent
      .get("/api/admin/logs")
      .query({ skip: 1 })
      .expect(200);
    expect(res.body.data).not.deep.eq(res2.body.data);
  });
});
