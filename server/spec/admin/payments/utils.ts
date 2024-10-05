import agent from "@test/index";
import { faker } from "@faker-js/faker";
import { MakeItSerializable } from "@utils/index";
export function createPayment(
  planId: string,
  userId: string
): Omit<
  DataBase.Models.Payments,
  "createdAt" | "createdBy" | "logsCount" | "adminId"
> {
  const days = faker.number.int(100);
  const startAt = new Date();
  return MakeItSerializable({
    paid: faker.number.int(100),
    plan: {
      type: (["day", "month", "year"] as Array<DataBase.PlansType>)[
        faker.number.int(2)
      ],
      num: days,
    },
    planId,
    userId,
    endAt: new Date(
      startAt.getFullYear(),
      startAt.getMonth(),
      startAt.getDate() + days
    ),
    startAt: startAt,
    remaining: faker.number.int(100),
  });
}
export async function createPaymentRequest(
  planId: string,
  userId: string
): Promise<DataBase.WithId<DataBase.Models.Payments>> {
  const payment = createPayment(planId, userId);
  const res = await agent.post("/api/admin/payments").send(payment);
  return res.body.data;
}
