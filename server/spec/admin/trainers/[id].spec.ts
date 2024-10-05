import { faker } from "@faker-js/faker";
import agent from "@test/index";
import { expect } from "chai";
import { createTrainerData } from "./utils";
let trainer: DataBase.WithId<DataBase.Models.Trainers>;
beforeAll(async () => {
  const res = await agent.post("/api/admin/trainers").send(createTrainerData());
  expect(res.statusCode).eq(200);
  trainer = res.body.data;
});
describe("GET", () => {
  test("Success", async () => {
    const res = await agent.get(`/api/admin/trainers/${trainer._id}`);
    expect(res.statusCode).eq(200);
    expect(trainer).deep.eq(res.body.data);
  });
  test("WrongId", async () => {
    const res = await agent.get(`/api/admin/trainers/WrongId`);
    expect(res.statusCode).eq(404);
    expect(res.body.status).false;
  });
});
describe("POST", () => {
  test("Success", async () => {
    const newUser = createTrainerData();
    const res = await agent
      .post(`/api/admin/trainers/${trainer._id}`)
      .send({ ...newUser });

    expect(res.statusCode).eq(200);
    expect({ ...trainer, ...newUser }).deep.eq(res.body.data);
  });
  test("WrongId", async () => {
    const newUser = createTrainerData();
    const res = await agent
      .post(`/api/admin/trainers/WrongId`)
      .send({ ...newUser });
    expect(res.statusCode).eq(404);
    expect(res.body.status).false;
  });
  test("update email type", async () => {
    const email = faker.internet.email();
    const res = await agent
      .post(`/api/admin/trainers/${trainer._id}`)
      .send({ email })
      .expect(200);
    expect(res.body.data.email).eq(email);
  });
});
describe("DELETE", () => {
  let trainer: DataBase.WithId<DataBase.Models.Trainers>;
  beforeEach(async () => {
    const res = await agent
      .post("/api/admin/trainers")
      .send(createTrainerData());
    expect(res.statusCode).eq(200);
    trainer = res.body.data;
  });
  test("Success", async () => {
    await agent.delete(`/api/admin/trainers/${trainer._id}`).expect(200);
    await agent.get(`/api/admin/trainers/${trainer._id}`).expect(404);
  });
});
