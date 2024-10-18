import agent from "@test/index";
import { faker } from "@faker-js/faker";
import { MakeItSerializable } from "@utils/index";
export function createProductPayment(
  products: DataBase.Models.ProductPayments["products"] = []
): Omit<DataBase.Models.ProductPayments, "createdAt" | "adminId" | "__t"> {
  return MakeItSerializable({
    paid: faker.number.int(100),
    remaining: faker.number.int(100),
    products: [],
  });
}
export async function createProductRequest(
  ...a: Parameters<typeof createProductPayment>
): Promise<DataBase.WithId<DataBase.Models.ProductPayments>> {
  const payment = createProductPayment(...a);
  const res = await agent.post("/api/admin/subscriptions").send(payment);
  return res.body.data;
}
