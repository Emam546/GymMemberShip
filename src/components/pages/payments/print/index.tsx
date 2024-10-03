import { formateDate } from "@src/utils";
import { createTableDoc } from "@src/utils/jspdf";
import { PrintButton } from "@src/components/common/printButton";
import { printJsDoc } from "@src/utils/print";
import requester from "@src/utils/axios";
type Payment = DataBase.Populate<
  DataBase.Populate<
    DataBase.WithId<DataBase.Models.Payments>,
    "userId",
    DataBase.WithId<DataBase.Models.User>
  >,
  "planId",
  DataBase.WithId<DataBase.Models.Plans>
>;
export default function PrintUserPayments({ query }: { query: unknown }) {
  return (
    <PrintButton
      fn={async () => {
        const payments = await requester.get<Routes.ResponseSuccess<Payment[]>>(
          `/api/admin/payments`,
          { params: query }
        );
        const body = payments.data.data.map<string[]>((doc, i) => {
          const endAt = new Date(
            new Date(doc.createdAt).getTime() +
              doc.plan.num * 1000 * 24 * 60 * 60
          );
          return [
            (i + 1).toString(),
            doc.planId.name || "",
            doc.planId.name || "",
            `${doc.paid}EGP`,
            formateDate(new Date(doc.createdAt)),
            formateDate(new Date(endAt)),
          ];
        });

        const doc = createTableDoc(
          [["Id", "User", "Plan", "Paid Price", "CreatedAt", "End At"]],
          body
        );
        await printJsDoc(doc, `${new Date().getTime()}-payments.pdf`);
      }}
    />
  );
}
