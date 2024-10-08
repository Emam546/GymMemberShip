import agent from "@test/index";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import { createPayment, createPaymentRequest } from "./utils";
import { createPlanRequest } from "../plans/utils";
import { createUserRequest } from "../users/utils";

let user: DataBase.WithId<DataBase.Models.User>;
let plan: DataBase.WithId<DataBase.Models.Plans>;
beforeAll(async () => {
  user = await createUserRequest();
  plan = await createPlanRequest();
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
  let payment: DataBase.WithId<DataBase.Models.Payments>;
  beforeEach(async () => {
    user = await createUserRequest();
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
      expect(
        (res.body.data as DataBase.WithId<DataBase.Models.Payments>[]).some(
          (val) => val._id == payment._id
        )
      ).true;
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
    const user = await createUserRequest();
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
    const user2 = await createUserRequest();
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
      plan = await createPlanRequest();
      const res2 = await agent
        .post("/api/admin/payments")
        .send(createPayment(plan._id, user._id))
        .expect(200);
      payment = res2.body.data;
    });
    test("Success", async () => {
      const res = await agent
        .get(`/api/admin/plans/${plan._id}/payments/profit`)
        .expect(200);
      expect(res.body.data[0].paymentCount).eq(1);
    });
  });

  test("no payments", async () => {
    const plan = await createPlanRequest();
    const res2 = await agent
      .get(`/api/admin/plans/${plan._id}/payments`)
      .expect(200);
    expect(res2.body.data.length).eq(0);
  });
});

describe("Get Profit Profit", () => {
  let payment: DataBase.WithId<DataBase.Models.Payments>;
  beforeAll(async () => {
    payment = await createPaymentRequest(plan._id, user._id);
  });
  test("get All payments profit", async () => {
    const res = await agent.get(`/api/admin/payments/profit`).expect(200);
    expect(res.body.data.length).greaterThanOrEqual(1);
    console.log(res.body.data);
    expect(res.body.data[0]).include.keys("profit");
  });
});
