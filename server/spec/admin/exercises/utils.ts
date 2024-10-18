import agent from "@test/index";
import { faker } from "@faker-js/faker";
import { MakeItSerializable } from "@utils/index";
export function createExercise(): DataBase.Models.Exercises {
  return MakeItSerializable({
    order: 0,
    title: faker.person.fullName(),
    workoutIds: [],
  });
}
export async function createExerciseRequest(
  ...a: Parameters<typeof createExercise>
): Promise<DataBase.WithId<DataBase.Models.Subscriptions>> {
  const payment = createExercise(...a);
  const res = await agent.post("/api/admin/exercises").send(payment);
  return res.body.data;
}
