import agent from "@test/index";
import { faker } from "@faker-js/faker";
export function createAdminData(): Omit<
  DataBase.Models.Admins,
  "createdAt" | "createdBy"
> {
  return {
    name: faker.person.fullName(),
    password: faker.internet.password(),
    type: "admin",
    email: faker.internet.email(),
    phone: faker.phone.number(),
  };
}
export async function createAdminRequest(
  data?: ReturnType<typeof createAdminData>
): Promise<DataBase.WithId<DataBase.Models.Plans>> {
  const res = await agent
    .post("/api/admin/admins")
    .send(data || createAdminData())
    .expect(200);
  return res.body.data;
}
beforeAll(async () => {
  const res = await agent
    .post("/api/admin/admins")
    .send(createAdminData())
    .expect(200);
  admin = res.body.data;
});
export let admin: DataBase.WithId<DataBase.Models.Admins>;
