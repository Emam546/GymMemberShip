import { faker } from "@faker-js/faker";
import agent from "@test/index";
import { expect } from "chai";
import { createAdminData } from "./utils";
let admin: DataBase.WithId<DataBase.Models.Admins>;
beforeAll(async () => {
  const res = await agent.post("/api/admin/admins").send(createAdminData());
  expect(res.statusCode).eq(200);
  admin = res.body.data;
});
describe("GET", () => {
  test("Success", async () => {
    const res = await agent.get(`/api/admin/admins/${admin._id}`);
    expect(res.statusCode).eq(200);
    expect(admin).deep.eq(res.body.data);
  });
  test("WrongId", async () => {
    const res = await agent.get(`/api/admin/admins/WrongId`);
    expect(res.statusCode).eq(404);
    expect(res.body.status).false;
  });
});
describe("POST", () => {
  test("Success", async () => {
    const newUser = createAdminData();
    const res = await agent
      .post(`/api/admin/admins/${admin._id}`)
      .send({ ...newUser });
    delete (newUser as any)["password"];
    expect(res.statusCode).eq(200);
    expect(res.body.data).not.undefined;
  });
  test("WrongId", async () => {
    const newUser = createAdminData();
    const res = await agent
      .post(`/api/admin/admins/WrongId`)
      .send({ ...newUser });
    expect(res.statusCode).eq(404);
    expect(res.body.status).false;
  });
  test("update email type", async () => {
    const email = faker.internet.email();
    const res = await agent
      .post(`/api/admin/admins/${admin._id}`)
      .send({ email })
      .expect(200);
    expect(res.body.data.email).eq(email);
  });
  test("update type", async () => {
    const res = await agent
      .post(`/api/admin/admins/${admin._id}`)
      .send({ type: "assistant" })
      .expect(200);
    expect(res.body.data.type).eq("assistant");
  });
});
describe("DELETE", () => {
  let admin: DataBase.WithId<DataBase.Models.Admins>;
  beforeEach(async () => {
    const res = await agent.post("/api/admin/admins").send(createAdminData());
    expect(res.statusCode).eq(200);
    admin = res.body.data;
  });
  test("Success", async () => {
    await agent.delete(`/api/admin/admins/${admin._id}`).expect(200);
    await agent.get(`/api/admin/admins/${admin._id}`).expect(404);
  });
});
