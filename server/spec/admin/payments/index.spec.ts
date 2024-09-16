import agent from "@test/index";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import { createUserData } from "../user/index.spec";
import { createPlanData } from "../plans/index.spec";
export function createPayment(
  planId: string,
  userId: string
): Omit<DataBase.Models.Payments, "createdAt" | "createdBy"> {
  return {
    separated: faker.datatype.boolean(),
    paid: {
      type: "EGP",
      num: faker.number.int(100),
    },
    plan: {
      type: (["day", "month", "year"] as Array<DataBase.PlansType>)[
        faker.number.int(2)
      ],
      num: faker.number.int(100),
    },
    planId,
    userId,
  };
}
let user: DataBase.WithId<DataBase.Models.User>;
let plan: DataBase.WithId<DataBase.Models.Plans>;
beforeAll(async () => {
  const res = await agent
    .post("/api/admin/user")
    .send(createUserData())
    .expect(200);
  user = res.body.data;
  const res2 = await agent
    .post("/api/admin/plans")
    .send(createPlanData())
    .expect(200);
  plan = res2.body.data;
});
describe("POST", () => {
  test("success", async () => {
    const payment = createPayment(plan._id, user._id);
    const res = await agent.post("/api/admin/payments").send(payment);
    console.log(JSON.stringify(res.body, undefined, 2));
    const resPayment = res.body.data;
    expect(resPayment._id).not.eq(undefined);
    expect(resPayment).deep.includes(payment);
  });
  describe("Wrong", () => {
    test("Wrong Paid Type", async () => {
      const payment: any = createPayment(user._id, plan._id);
      payment.paid = null;
      const res = await agent
        .post("/api/admin/payments")
        .send(payment)
        .expect(400);
      expect(res.body.err).has.property("paid");
    });
    test("Wrong userId Type", async () => {
      const payment = createPayment(user._id, plan._id);
      payment.userId = "wrongId";
      const res = await agent
        .post("/api/admin/payments")
        .send(payment)
        .expect(400);
      console.log(res.body);
      expect(res.body.err).has.property("userId");
    });
  });
});
describe("GET", () => {
  beforeAll(async () => {
    const payment = createPayment(plan._id, user._id);
    await agent.post("/api/admin/payments").send(payment).expect(200);
  });
  test("Success", async () => {
    const res = await agent.get("/api/admin/payments");
    console.log(res.body);
    expect(res.body.data).instanceOf(Array);
    expect(res.body.data.length).gt(0);
  });
  test("Test limit", async () => {
    const res = await agent.get("/api/admin/payments").query({ limit: 5 });
    console.log(res.body);
    expect(res.body.data).instanceOf(Array);
    expect(res.body.data.length).lte(5);
  });
  test("Test Skip", async () => {
    const res = await agent.get("/api/admin/payments").expect(200);
    expect(res.body.data).instanceOf(Array);
    const res2 = await agent
      .get("/api/admin/payments")
      .query({ skip: 1 })
      .expect(200);
    expect(res.body.data).not.deep.eq(res2.body.data);
  });
  test("Test no Skip", async () => {
    const res = await agent.get("/api/admin/payments").expect(200);
    expect(res.body.data).instanceOf(Array);
    const res2 = await agent
      .get("/api/admin/payments")
      .query({ skip: 0 })
      .expect(200);
    expect(res.body.data).deep.eq(res2.body.data);
  });
});
