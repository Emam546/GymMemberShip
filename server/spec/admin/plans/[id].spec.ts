import { faker } from "@faker-js/faker";
import { createPlanData } from "./index.spec";
import agent from "@test/index";
import { expect } from "chai";
let plan: DataBase.WithId<DataBase.Models.Plans>;
beforeAll(async () => {
  const res = await agent.post("/api/admin/plans").send(createPlanData());
  expect(res.statusCode).eq(200);
  plan = res.body.data;
});
describe("GET", () => {
  test("Success", async () => {
    const res = await agent.get(`/api/admin/plans/${plan._id}`).expect(200);
    expect(plan).deep.eq(res.body.data);
  });
  test("WrongId", async () => {
    const res = await agent.get(`/api/admin/plans/WrongId`);
    expect(res.statusCode).eq(404);
    expect(res.body.status).false;
  });
});
describe("POST", () => {
  test("Success", async () => {
    const newUser = createPlanData();
    const res = await agent
      .post(`/api/admin/plans/${plan._id}`)
      .send({ ...newUser });

    expect(res.statusCode).eq(200);
    expect({ ...plan, ...newUser }).deep.eq(res.body.data);
  });
  test("WrongId", async () => {
    const newUser = createPlanData();
    const res = await agent
      .post(`/api/admin/plans/WrongId`)
      .send({ ...newUser }).expect(404);
    expect(res.body.status).false;
  });
  test("update name type", async () => {
    const name = faker.person.fullName();
    const res = await agent
      .post(`/api/admin/plans/${plan._id}`)
      .send({ name })
      .expect(200);
    expect(res.body.data.name).eq(name);
  });
});
describe("DELETE", () => {
  let user: DataBase.WithId<DataBase.Models.User>;
  beforeEach(async () => {
    const res = await agent.post("/api/admin/plans").send(createPlanData());
    expect(res.statusCode).eq(200);
    user = res.body.data;
  });
  test("Success", async () => {
    await agent.delete(`/api/admin/plans/${user._id}`).expect(200);
    await agent.get(`/api/admin/plans/${user._id}`).expect(404);
  });
});
