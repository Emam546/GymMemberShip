import agent from "@test/index";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
export function createPlanData(): Omit<
  DataBase.Models.Plans,
  "createdAt" | "createdBy"
> {
  return {
    name: faker.person.fullName(),
    prices: {
      day: {
        num: faker.number.int({ min: 10, max: 50 }),
        type: "EGP",
      },
      month: {
        num: faker.number.int({ min: 50, max: 300 }),
        type: "EGP",
      },
      year: {
        num: faker.number.int({ min: 50, max: 300 }),
        type: "EGP",
      },
    },
    details: {
      desc: faker.lorem.text(),
    },
  };
}
export async function createPlanRequest(
  data?: ReturnType<typeof createPlanData>
): Promise<DataBase.WithId<DataBase.Models.Plans>> {
  const res = await agent
    .post("/api/admin/plans")
    .send(data || createPlanData())
    .expect(200);
  return res.body.data;
}
describe("POST", () => {
  test("success", async () => {
    const plan = createPlanData();
    const res = await agent.post("/api/admin/plans").send(plan).expect(200);
    const resPlan = res.body.data;
    expect(resPlan._id).not.eq(undefined);
    expect(resPlan).deep.includes(plan);
  });
  describe("Wrong", () => {
    test("Wrong Price Type", async () => {
      const plan: any = createPlanData();
      plan.prices = null;
      await agent.post("/api/admin/plans").send(plan).expect(400);
    });
  });
});
describe("GET", () => {
  beforeAll(async () => {
    const plan = createPlanData();
    await agent.post("/api/admin/plans").send(plan).expect(200);
  });
  test("Success", async () => {
    const res = await agent.get("/api/admin/plans").expect(200);
    expect(res.body.data).instanceOf(Array);
    expect(res.body.data.length).gt(0);
  });
});
