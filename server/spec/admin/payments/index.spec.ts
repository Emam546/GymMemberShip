import agent from "@test/index";
import { expect } from "chai";
import {
  createSubscription,
  createSubscriptionRequest as createSubscriptionRequest,
} from "../subscriptions/utils";
import { createPlanRequest } from "../plans/utils";
import { createUserRequest } from "../users/utils";

let user: DataBase.WithId<DataBase.Models.User>;
let plan: DataBase.WithId<DataBase.Models.Plans>;
beforeAll(async () => {
  user = await createUserRequest();
  plan = await createPlanRequest();
});

describe("GET", () => {
  beforeAll(async () => {
    const payment = createSubscription(plan._id, user._id);
    await agent.post("/api/admin/subscriptions").send(payment).expect(200);
  });
  test("Success", async () => {
    const res = await agent.get("/api/admin/subscriptions");
    expect(res.body.data).instanceOf(Array);
    expect(res.body.data.length).gt(0);
  });
  test("Test limit", async () => {
    const res = await agent.get("/api/admin/subscriptions").query({ limit: 5 });
    expect(res.body.data).instanceOf(Array);
    expect(res.body.data.length).lte(5);
  });

  test("remaining type", async () => {
    const res = await agent
      .get("/api/admin/subscriptions")
      .query({ remaining: true });
    expect(res.body.data).instanceOf(Array);
    const doc: DataBase.Models.Subscriptions[] = res.body.data;
    expect(doc.find((doc) => doc.remaining > 0));
  });
});

describe("Get Profit Profit", () => {
  let payment: DataBase.WithId<DataBase.Models.Subscriptions>;
  beforeAll(async () => {
    payment = await createSubscriptionRequest(plan._id, user._id);
  });
  test("get All payments profit", async () => {
    const res = await agent.get(`/api/admin/subscriptions/profit`).expect(200);
    expect(res.body.data.length).greaterThanOrEqual(1);
    expect(res.body.data[0]).include.keys("profit");
  });
});
