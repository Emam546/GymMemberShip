import { formateDate } from "@src/utils";
import { createTableDoc } from "@src/utils/jspdf";
import { PrintButton } from "@src/components/common/printButton";
import { printJsDoc } from "@src/utils/print";
import requester from "@src/utils/axios";
type Payment = DataBase.Populate.Model<
  DataBase.WithId<DataBase.Models.Subscriptions>,
  "planId" | "userId" | "adminId" | "trainerId"
>;
export default function PrintPaymentsQuery({ query }: { query: unknown }) {
  return (
    <PrintButton
      fn={async () => {
        const payments = await requester.get<Routes.ResponseSuccess<Payment[]>>(
          `/api/admin/subscriptions/query`,
          { params: query }
        );
        const body = payments.data.data.map<string[]>((doc, i) => {
          const endAt = new Date(
            new Date(doc.createdAt).getTime() +
              doc.plan.num * 1000 * 24 * 60 * 60
          );
          return [
            (i + 1).toString(),
            doc.userId?.name || "",
            doc.planId?.name || "",
            `${doc.paid}EGP`,
            `${doc.remaining}EGP`,
            formateDate(new Date(doc.createdAt)),
            formateDate(new Date(doc.endAt || endAt)),
          ];
        });

        const doc = createTableDoc(
          [
            [
              "Id",
              "User",
              "Plan",
              "Paid Price",
              "Remaining",
              "Started At",
              "End At",
            ],
          ],
          body
        );
        await printJsDoc(doc, `${new Date().getTime()}-payments.pdf`);
      }}
    />
  );
}
