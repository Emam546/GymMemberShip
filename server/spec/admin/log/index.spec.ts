import agent from "@test/index";
import { expect } from "chai";
import { user, plan } from "../payments/index.spec";
import { payment } from "../payments/[id].spec";
export function createLog(
  planId: string,
  userId: string,
  paymentId: string
): Omit<DataBase.Models.Logs, "createdAt" | "createdBy"> {
  return {
    paymentId,
    planId,
    userId,
  };
}

describe("POST", () => {
  test("success", async () => {
    const log = createLog(plan._id, user._id, payment._id);
    const res = await agent.post("/api/admin/logs").send(log);
    const resPayment = res.body.data;
    expect(resPayment._id).not.eq(undefined);
    expect(resPayment).deep.includes(log);
  });
  describe("Wrong", () => {
    test("Wrong UserId Type", async () => {
      const log = createLog(user._id, plan._id, payment._id);
      log.userId = "wrongId";
      const res = await agent.post("/api/admin/logs").send(log).expect(400);
      expect(res.body.err).has.property("userId");
    });
  });
});
describe("GET", () => {
  beforeAll(async () => {
    const log = createLog(plan._id, user._id, payment._id);
    await agent.post("/api/admin/logs").send(log).expect(200);
  });
  test("Success", async () => {
    const res = await agent.get("/api/admin/logs");
    expect(res.body.data).instanceOf(Array);
    expect(res.body.data.length).gt(0);
  });
  test("Test limit", async () => {
    const res = await agent.get("/api/admin/logs").query({ limit: 5 });
    expect(res.body.data).instanceOf(Array);
    expect(res.body.data.length).lte(5);
  });
  test("Test Skip", async () => {
    const res = await agent.get("/api/admin/logs").expect(200);
    expect(res.body.data).instanceOf(Array);
    const res2 = await agent
      .get("/api/admin/logs")
      .query({ skip: 1 })
      .expect(200);
    expect(res.body.data).not.deep.eq(res2.body.data);
  });
  test("Test no Skip", async () => {
    const res = await agent.get("/api/admin/logs").expect(200);
    expect(res.body.data).instanceOf(Array);
    const res2 = await agent
      .get("/api/admin/logs")
      .query({ skip: 0 })
      .expect(200);
    expect(res.body.data).deep.eq(res2.body.data);
  });
});
// describe("User Methods", () => {
//   let user: DataBase.WithId<DataBase.Models.User>;
//   let payment: DataBase.WithId<DataBase.Models.User>;
//   beforeEach(async () => {
//     const res = await agent
//       .post("/api/admin/user")
//       .send(createUserData())
//       .expect(200);
//     user = res.body.data;
//     const res2 = await agent
//       .post("/api/admin/logs")
//       .send(createLog(plan._id, user._id))
//       .expect(200);
//     payment = res2.body.data;
//   });
//   describe("GET", () => {
//     test("Success", async () => {
//       const res = await agent
//         .get(`/api/admin/user/${user._id}/payments`)
//         .expect(200);
//       expect(res.body.data).deep.includes(payment);
//     });
//     test("Use limit", async () => {
//       const limit = 5;
//       const res = await agent
//         .get(`/api/admin/user/${user._id}/payments`)
//         .query({ limit })
//         .expect(200);
//       expect(res.body.data.length).lte(limit);
//     });
//   });

//   test("no payments", async () => {
//     const res = await agent
//       .post("/api/admin/user")
//       .send(createUserData())
//       .expect(200);
//     const user = res.body.data;
//     const res2 = await agent
//       .get(`/api/admin/user/${user._id}/payments`)
//       .expect(200);
//     expect(res2.body.data.length).eq(0);
//   });
//   test("payments deleted with user", async () => {
//     await agent.delete(`/api/admin/user/${user._id}`).expect(200);
//     await agent.get(`/api/admin/logs/${payment._id}`).expect(404);
//   });
//   test("unrelated payments will not be deleted", async () => {
//     const res = await agent
//       .post("/api/admin/user")
//       .send(createUserData())
//       .expect(200);
//     const user2 = res.body.data;
//     const res2 = await agent
//       .post("/api/admin/logs")
//       .send(createLog(plan._id, user2._id))
//       .expect(200);
//     const payment2 = res2.body.data;
//     await agent.delete(`/api/admin/user/${user._id}`).expect(200);
//     await agent.get(`/api/admin/logs/${payment._id}`).expect(404);
//     await agent.get(`/api/admin/logs/${payment2._id}`).expect(200);
//   });
// });
// describe("Plan method", () => {
//   describe("GET", () => {
//     let payment: DataBase.WithId<DataBase.Models.User>;
//     beforeAll(async () => {
//       const res2 = await agent
//         .post("/api/admin/logs")
//         .send(createLog(plan._id, user._id))
//         .expect(200);
//       payment = res2.body.data;
//     });
//     test("Success", async () => {
//       const res = await agent
//         .get(`/api/admin/plans/${plan._id}/payments`)
//         .expect(200);
//       expect(res.body.data).deep.includes(payment);
//     });
//     test("Use limit", async () => {
//       const limit = 5;
//       const res = await agent
//         .get(`/api/admin/plans/${plan._id}/payments`)
//         .query({ limit })
//         .expect(200);
//       expect(res.body.data.length).lte(limit);
//     });
//   });

//   test("no payments", async () => {
//     const res = await agent
//       .post("/api/admin/plans")
//       .send(createPlanData())
//       .expect(200);
//     const plan = res.body.data;
//     const res2 = await agent
//       .get(`/api/admin/plans/${plan._id}/payments`)
//       .expect(200);
//     expect(res2.body.data.length).eq(0);
//   });
// });
