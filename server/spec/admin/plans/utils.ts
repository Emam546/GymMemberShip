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
      day: faker.number.int({ min: 10, max: 50 }),
      month: faker.number.int({ min: 50, max: 300 }),
      year: faker.number.int({ min: 50, max: 300 }),
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
