import { faker } from "@faker-js/faker";
import agent from "@test/index";

export function createTrainerData(): Omit<DataBase.Models.Trainers, ""> {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
  };
}
export async function createUserRequest(
  data?: ReturnType<typeof createTrainerData>
): Promise<DataBase.WithId<DataBase.Models.User>> {
  const response = await agent
    .post("/api/admin/trainers")
    .send(data || createTrainerData());
  return response.body.data;
}
