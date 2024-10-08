import { faker } from "@faker-js/faker";
import agent from "@test/index";

export function createUserData(): Omit<
  DataBase.Models.User,
  "createdAt" | "createdBy" | "adminId" | "barcode"
> {
  return {
    name: faker.person.fullName(),
    age: faker.number.int({ min: 10, max: 100 }),
    email: faker.internet.email(),
    weight: faker.number.int({ min: 0, max: 200 }),
    tall: faker.number.int({ min: 150, max: 200 }),
    details: {
      whyDidYouCame: faker.lorem.text(),
    },
  };
}
export async function createUserRequest(
  data?: ReturnType<typeof createUserData>
): Promise<DataBase.WithId<DataBase.Models.User>> {
  const response = await agent
    .post("/api/admin/users")
    .send(data || createUserData());
  return response.body.data;
}
