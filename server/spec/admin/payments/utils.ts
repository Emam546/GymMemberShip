import agent from "@test/index";
import { faker } from "@faker-js/faker";
import { admin } from "../admin/utils";
export function createPayment(
  planId: string,
  userId: string
): Omit<DataBase.Models.Payments, "createdAt" | "createdBy"> {
  return {
    separated: faker.datatype.boolean(),
    paid: faker.number.int(100),
    plan: {
      type: (["day", "month", "year"] as Array<DataBase.PlansType>)[
        faker.number.int(2)
      ],
      num: faker.number.int(100),
    },
    planId,
    userId,
    adminId: admin._id,
    remaining: faker.number.int(100),
    
  } as any;
}
export async function createPaymentRequest(
  planId: string,
  userId: string
): Promise<DataBase.WithId<DataBase.Models.Payments>> {
  const payment = createPayment(planId, userId);
  const res = await agent.post("/api/admin/payments").send(payment);
  return res.body.data;
}
