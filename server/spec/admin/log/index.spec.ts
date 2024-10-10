import agent from "@test/index";
import { expect } from "chai";
import { createLog } from "./utils";
import { createPlanRequest } from "../plans/utils";
import { createUserData, createUserRequest } from "../users/utils";
import { createPaymentRequest } from "../subscriptions/utils";
let user: DataBase.WithId<DataBase.Models.User>;
let plan: DataBase.WithId<DataBase.Models.Plans>;
let payment: DataBase.WithId<DataBase.Models.Subscriptions>;
beforeAll(async () => {
  user = await createUserRequest();
  plan = await createPlanRequest();
  payment = await createPaymentRequest(plan._id, user._id);
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
