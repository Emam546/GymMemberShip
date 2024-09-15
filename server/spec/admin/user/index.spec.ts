import agent from "@test/index";
import { faker } from "@faker-js/faker";
export function createUserData(): Omit<
  DataBase.Models.User,
  "signedIn" | "signedInBy"
> {
  return {
    name: faker.person.fullName(),

    age: faker.number.int({ min: 10, max: 100 }),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    weight: faker.number.int({ min: 0, max: 200 }),
    tall: faker.number.int({ min: 150, max: 200 }),
    details: {
      whyDidYouCame: faker.lorem.text(),
    },
  };
}
describe("POST", () => {
  test("success", async () => {
    const user = createUserData();
    const res = await agent.post("/api/admin/user").send(user);
    expect(res.statusCode).toBe(200);
    const testUser = res.body.data;
    expect(testUser._id).not.toBe(undefined);
    expect(testUser.age).toBe(user.age);
    expect(testUser.name).toBe(user.name);
    expect(testUser.email).toBe(user.email);
    expect(testUser.phone).toBe(user.phone);
    expect(testUser.details.whyDidYouCame).toBe(user.details.whyDidYouCame);
  });
  describe("wrong", () => {
    test("email", async () => {
      const res = await agent.post("/api/admin/user").send({ email: 1230 });
      expect(res.statusCode).toBe(400);
    });
    test("age", async () => {
      const res = await agent
        .post("/api/admin/user")
        .send({ age: "wrong value" });
      expect(res.statusCode).toBe(400);
    });
    test("description", async () => {
      const res = await agent.post("/api/admin/user").send({});
      expect(res.statusCode).toBe(400);
    });
  });
});
describe("GET", () => {
  test("GET Any Result", async () => {
    await agent.post("/api/admin/user").send(createUserData());
    const response = await agent.get("/api/admin/user");
    expect(response.statusCode).toBe(200);
    expect(response.body.data).not.toBeUndefined();
    expect(response.body.data.length).not.toBe(0);
  });
  test("limit query", async () => {
    await agent.post("/api/admin/user").send(createUserData());
    const response = await agent.get("/api/admin/user").query({
      limit: 2,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.data).not.toBeUndefined();
    expect(response.body.data.length).toBe(2);
  });
  describe("Age", () => {
    test("age", async () => {
      const orgUser = createUserData();
      await agent.post("/api/admin/user").send(orgUser);
      const query = {
        ageMin: orgUser.age,
        ageMax: orgUser.age,
      };
      const response = await agent.get("/api/admin/user").query(query);
      expect(response.statusCode).toBe(200);
      expect(response.body.data).not.toBeUndefined();
      expect(response.body.data.length).not.toBe(0);
      (response.body.data as DataBase.Models.User[]).forEach((user) => {
        expect(user.age).toBe(orgUser.age);
      });
    });
    test("Age min", async () => {
      const query = {
        ageMin: 5,
      };
      const response = await agent.get("/api/admin/user").query(query);
      expect(response.statusCode).toBe(200);
      expect(response.body.data).not.toBeUndefined();
      (response.body.data as DataBase.Models.User[]).forEach((user) => {
        expect(user.age).toBeGreaterThanOrEqual(query.ageMin);
      });
    });
    test("Age Max", async () => {
      const query = {
        ageMax: 5,
      };
      const response = await agent.get("/api/admin/user").query(query);
      expect(response.statusCode).toBe(200);
      expect(response.body.data).not.toBeUndefined();
      (response.body.data as DataBase.Models.User[]).forEach((user) => {
        expect(user.age).toBeLessThanOrEqual(query.ageMax);
      });
    });
  });
});
