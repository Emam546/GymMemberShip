import agent from "@test/index";
import { faker } from "@faker-js/faker";
import { MakeItSerializable } from "@utils/index";
export function createSubscription(
  planId: string,
  userId: string,
  trainerId?: string
): Omit<
  DataBase.Models.Subscriptions,
  "createdAt" | "logsCount" | "adminId" | "__t"
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
export async function createSubscriptionRequest(
  ...a: Parameters<typeof createSubscription>
): Promise<DataBase.WithId<DataBase.Models.Subscriptions>> {
  const payment = createSubscription(...a);
  const res = await agent.post("/api/admin/subscriptions").send(payment);
  return res.body.data;
}
