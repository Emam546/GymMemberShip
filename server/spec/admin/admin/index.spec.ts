import agent from "@test/index";
import { createAdminData, createAdminRequest } from "./utils";

describe("POST", () => {
  test("success", async () => {
    const user = createAdminData();
    const res = await agent.post("/api/admin/admins").send(user);
    expect(res.statusCode).toBe(200);
    const testUser = res.body.data;
    expect(testUser._id).not.toBe(undefined);
    expect(testUser.name).toBe(user.name);
    expect(testUser.email).toBe(user.email);
    expect(testUser.phone).toBe(user.phone);
  });
  describe("wrong", () => {
    test("email", async () => {
      const res = await agent
        .post("/api/admin/admins")
        .send({ ...createAdminData(), email: 1230 });
      expect(res.statusCode).toBe(400);
    });
    test("description", async () => {
      const res = await agent.post("/api/admin/admins").send({});
      expect(res.statusCode).toBe(400);
    });
  });
});
describe("GET", () => {});
describe("Get Password from Admin", () => {
  
});
