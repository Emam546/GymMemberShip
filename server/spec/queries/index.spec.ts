import "@test/pre-start";
import "@test/index";
import { expect } from "chai";
import Payments from "@serv/models/payments";
describe("Test Function", () => {
  test("Success", async () => {
    const startDate = new Date(2004, 1, 1);
    const results = await Payments.aggregate([
      {
        $match: {
          createdBy: {
            $gte: startDate, // Greater than or equal to the start date
          },
        },
      },
      {
        $group: { _id: "$paid.type", totalPrice: { $sum: "$paid.num" } },
      },
    ]);
    expect(results[0].totalPrice).gte(0);
  });
});
