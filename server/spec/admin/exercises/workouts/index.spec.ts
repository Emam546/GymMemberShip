import agent from "@test/index";
import { expect } from "chai";
import { createWorkoutRequest, createWorkOut } from "./utils";

describe("POST", () => {
  test("success", async () => {
    const payment = createWorkOut();
    const res = await agent
      .post("/api/admin/workouts")
      .send(payment)
      .expect(200);
    const resPayment = res.body.data;
    expect(resPayment._id).not.eq(undefined);
    expect(resPayment).deep.includes(payment);
  });
  describe("Wrong", () => {
    test("Wrong order type", async () => {
      const payment = createWorkOut() as any;
      payment.hide = "string";
      await agent.post("/api/admin/workouts").send(payment).expect(400);
    });
    test("Wrong steps Type", async () => {
      const payment = createWorkOut() as any;
      payment.steps = "string";
      await agent.post("/api/admin/workouts").send(payment).expect(400);
    });
  });
});
describe("GET", () => {});
