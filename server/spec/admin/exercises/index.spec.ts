import agent from "@test/index";
import { expect } from "chai";
import { createExercise, createExerciseRequest } from "./utils";

describe("POST", () => {
  test("success", async () => {
    const payment = createExercise();
    const res = await agent
      .post("/api/admin/exercises")
      .send(payment)
      .expect(200);
    const resPayment = res.body.data;
    expect(resPayment._id).not.eq(undefined);
    expect(resPayment).deep.includes(payment);
  });
  describe("Wrong", () => {
    test("Wrong order type", async () => {
      const payment = createExercise() as any;
      payment.order = "string";
      await agent.post("/api/admin/exercises").send(payment).expect(400);
    });
    test("Wrong WorkoutType Type", async () => {
      const payment = createExercise() as any;
      payment.workoutIds = "string";
      await agent.post("/api/admin/exercises").send(payment).expect(400);
    });
  });
});
describe("GET", () => {
  beforeAll(async () => {
    const payment = createExercise();
    await agent.post("/api/admin/exercises").send(payment).expect(200);
  });
  test("Success", async () => {
    const res = await agent.get("/api/admin/exercises");
    expect(res.body.data).instanceOf(Array);
    expect(res.body.data.length).gt(0);
  });
});
