import agent from "@test/index";
import { expect } from "chai";
import { createPlanData } from "./utils";
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
