import agent from "@test/index";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import { createUserData } from "../users/index.spec";
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
export async function createPaymentRequest(
  planId: string,
  userId: string
): Promise<DataBase.WithIdOrg<DataBase.Models.Payments>> {
  const payment = createPayment(planId, userId);
  const res = await agent.post("/api/admin/payments").send(payment);
  return res.body.data;
}
export let user: DataBase.WithId<DataBase.Models.User>;
export let plan: DataBase.WithId<DataBase.Models.Plans>;
beforeAll(async () => {
  const res = await agent
    .post("/api/admin/users")
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
    const resPayment = res.body.data;
    expect(resPayment._id).not.eq(undefined);
    expect(resPayment).deep.includes(payment);
  });
  describe("Wrong", () => {
    test("Wrong Paid Type", async () => {
      const payment: any = createPayment(user._id, plan._id);
      payment.paid = undefined;
      const res = await agent
        .post("/api/admin/payments")
        .send(payment)
        .expect(400);
      expect(res.body.err).has.property("paid");
    });
    test("Wrong UserId Type", async () => {
      const payment = createPayment(user._id, plan._id);
      payment.userId = "wrongId";
      const res = await agent
        .post("/api/admin/payments")
        .send(payment)
        .expect(400);
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
    expect(res.body.data).instanceOf(Array);
    expect(res.body.data.length).gt(0);
  });
  test("Test limit", async () => {
    const res = await agent.get("/api/admin/payments").query({ limit: 5 });
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
describe("User Methods", () => {
  let user: DataBase.WithId<DataBase.Models.User>;
  let payment: DataBase.WithId<DataBase.Models.User>;
  beforeEach(async () => {
    const res = await agent
      .post("/api/admin/users")
      .send(createUserData())
      .expect(200);
    user = res.body.data;
    const res2 = await agent
      .post("/api/admin/payments")
      .send(createPayment(plan._id, user._id))
      .expect(200);
    payment = res2.body.data;
  });
  describe("GET", () => {
    test("Success", async () => {
      const res = await agent
        .get(`/api/admin/users/${user._id}/payments`)
        .expect(200);
      expect(res.body.data).deep.includes(payment);
    });
    test("Use limit", async () => {
      const limit = 5;
      const res = await agent
        .get(`/api/admin/users/${user._id}/payments`)
        .query({ limit })
        .expect(200);
      expect(res.body.data.length).lte(limit);
    });
  });

  test("no payments", async () => {
    const res = await agent
      .post("/api/admin/users")
      .send(createUserData())
      .expect(200);
    const user = res.body.data;
    const res2 = await agent
      .get(`/api/admin/users/${user._id}/payments`)
      .expect(200);
    expect(res2.body.data.length).eq(0);
  });
  test("payments deleted with user", async () => {
    await agent.delete(`/api/admin/users/${user._id}`).expect(200);
    await agent.get(`/api/admin/payments/${payment._id}`).expect(404);
  });
  test("unrelated payments will not be deleted", async () => {
    const res = await agent
      .post("/api/admin/users")
      .send(createUserData())
      .expect(200);
    const user2 = res.body.data;
    const res2 = await agent
      .post("/api/admin/payments")
      .send(createPayment(plan._id, user2._id))
      .expect(200);
    const payment2 = res2.body.data;
    await agent.delete(`/api/admin/users/${user._id}`).expect(200);
    await agent.get(`/api/admin/payments/${payment._id}`).expect(404);
    await agent.get(`/api/admin/payments/${payment2._id}`).expect(200);
  });
});
describe("Plan method", () => {
  describe("GET", () => {
    let payment: DataBase.WithId<DataBase.Models.Payments>;
    beforeAll(async () => {
      const res2 = await agent
        .post("/api/admin/payments")
        .send(createPayment(plan._id, user._id))
        .expect(200);
      payment = res2.body.data;
    });
    test("Success", async () => {
      const res = await agent
        .get(`/api/admin/plans/${plan._id}/payments`)
        .expect(200);
      expect(res.body.data).not.undefined;
    });
    test("Use limit", async () => {
      const limit = 5;
      const res = await agent
        .get(`/api/admin/plans/${plan._id}/payments`)
        .query({ limit })
        .expect(200);
      expect(res.body.data.length).lte(limit);
    });
  });
  describe("get count of payments", () => {
    let payment: DataBase.WithId<DataBase.Models.Payments>;
    let plan: DataBase.WithId<DataBase.Models.Plans>;
    beforeAll(async () => {
      const res1 = await agent
        .post("/api/admin/plans")
        .send(createPlanData())
        .expect(200);
      plan = res1.body.data;
      const res2 = await agent
        .post("/api/admin/payments")
        .send(createPayment(plan._id, user._id))
        .expect(200);
      payment = res2.body.data;
    });
    test("Success", async () => {
      const res = await agent
        .get(`/api/admin/plans/${plan._id}/payments/count`)
        .expect(200);
      expect(res.body.data).eq(1);
    });
  });

  test("no payments", async () => {
    const res = await agent
      .post("/api/admin/plans")
      .send(createPlanData())
      .expect(200);
    const plan = res.body.data;
    const res2 = await agent
      .get(`/api/admin/plans/${plan._id}/payments`)
      .expect(200);
    expect(res2.body.data.length).eq(0);
  });
});
