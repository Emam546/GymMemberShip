import { faker } from "@faker-js/faker";
import { createPayment, plan, user } from "./index.spec";
import agent from "@test/index";
import { expect } from "chai";
export let payment: DataBase.WithId<DataBase.Models.Payments>;
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
    expect(payment).deep.eq(res.body.data);
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
      separated: true,
      paid: {
        num: 0,
        type: "EGP",
      },
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
  test("update separated type", async () => {
    const separated = faker.datatype.boolean();
    const res = await agent
      .post(`/api/admin/payments/${payment._id}`)
      .send({ separated })
      .expect(200);
    expect(res.body.data.separated).eq(separated);
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
