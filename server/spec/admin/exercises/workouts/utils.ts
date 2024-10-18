import agent from "@test/index";
import { faker } from "@faker-js/faker";
import { MakeItSerializable } from "@utils/index";
export type DocData = Omit<DataBase.Models.Workouts, "createdAt" | "steps"> & {
  steps: Omit<DataBase.Models.Workouts["steps"][0], "_id">[];
};
export function createWorkOut(steps?: DocData["steps"]): DocData {
  steps =
    steps ||
    new Array(faker.number.int(3)).fill(0).map((val) => {
      return {
        title: faker.person.fullName(),
        desc: faker.lorem.paragraph(),
        files: [],
      };
    });
  return MakeItSerializable({
    steps: [],
    hide: faker.datatype.boolean(),
    title: faker.person.fullName(),
  });
}
export async function createWorkoutRequest(
  ...a: Parameters<typeof createWorkOut>
): Promise<DataBase.WithId<DataBase.Models.Workouts>> {
  const payment = createWorkOut(...a);
  const res = await agent.post("/api/admin/exercises").send(payment);
  return res.body.data;
}
