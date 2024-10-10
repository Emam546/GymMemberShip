import agent from "@test/index";
import { faker } from "@faker-js/faker";
import { MakeItSerializable } from "@utils/index";
export function createPayment(
  planId: string,
  userId: string,
  trainerId?: string
): Omit<
  DataBase.Models.Subscriptions,
  "createdAt"  | "logsCount" | "adminId" | "type"
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
    trainerId,
  });
}
export async function createPaymentRequest(
  ...a: Parameters<typeof createPayment>
): Promise<DataBase.WithId<DataBase.Models.Subscriptions>> {
  const payment = createPayment(...a);
  const res = await agent.post("/api/admin/subscriptions").send(payment);
  return res.body.data;
}
