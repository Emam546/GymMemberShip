import agent from "@test/index";
import { createTrainerData, createTrainerRequest } from "./utils";

describe("POST", () => {
  test("success", async () => {
    const user = createTrainerData();
    const res = await agent.post("/api/admin/trainers").send(user);
    expect(res.statusCode).toBe(200);
    const testUser = res.body.data;
    expect(testUser._id).not.toBe(undefined);
    expect(testUser.name).toBe(user.name);
    expect(testUser.email).toBe(user.email);
    expect(testUser.phone).toBe(user.phone);
  });
  describe("wrong", () => {
    test("email", async () => {
      const res = await agent.post("/api/admin/trainers").send({ email: 1230 });
      expect(res.statusCode).toBe(400);
    });
  });
});
describe("GET", () => {
  test("GET Any Result", async () => {
    await agent.post("/api/admin/trainers").send(createTrainerData());
    const response = await agent.get("/api/admin/trainers");
    expect(response.statusCode).toBe(200);
    expect(response.body.data).not.toBeUndefined();
    expect(response.body.data.length).not.toBe(0);
  });
});
