import { faker } from "@faker-js/faker";
import agent from "@test/index";
import { expect } from "chai";
import { createUserData } from "./utils";
let user: DataBase.WithId<DataBase.Models.User>;
beforeAll(async () => {
  const res = await agent.post("/api/admin/users").send(createUserData());
  expect(res.statusCode).eq(200);
  user = res.body.data;
});
describe("GET", () => {
  test("Success", async () => {
    const res = await agent.get(`/api/admin/users/${user._id}`);
    expect(res.statusCode).eq(200);
    expect(user).deep.eq(res.body.data);
  });
  test("WrongId", async () => {
    const res = await agent.get(`/api/admin/users/WrongId`);
    expect(res.statusCode).eq(404);
    expect(res.body.status).false;
  });
});
describe("POST", () => {
  test("Success", async () => {
    const newUser = createUserData();
    const res = await agent
      .post(`/api/admin/users/${user._id}`)
      .send({ ...newUser });

    expect(res.statusCode).eq(200);
    expect({ ...user, ...newUser }).deep.eq(res.body.data);
  });
  test("WrongId", async () => {
    const newUser = createUserData();
    const res = await agent
      .post(`/api/admin/users/WrongId`)
      .send({ ...newUser });
    expect(res.statusCode).eq(404);
    expect(res.body.status).false;
  });
  test("update email type", async () => {
    const email = faker.internet.email();
    const res = await agent
      .post(`/api/admin/users/${user._id}`)
      .send({ email })
      .expect(200);
    expect(res.body.data.email).eq(email);
  });
  test("update blocked type", async () => {
    const res = await agent
      .post(`/api/admin/users/${user._id}`)
      .send({ blocked: true })
      .expect(200);
    expect(res.body.data.blocked).eq(true);
  });
  describe("WrongData", () => {});
});
describe("DELETE", () => {
  let user: DataBase.WithId<DataBase.Models.User>;
  beforeEach(async () => {
    const res = await agent.post("/api/admin/users").send(createUserData());
    expect(res.statusCode).eq(200);
    user = res.body.data;
  });
  test("Success", async () => {
    await agent.delete(`/api/admin/users/${user._id}`).expect(200);
    await agent.get(`/api/admin/users/${user._id}`).expect(404);
  });
});
