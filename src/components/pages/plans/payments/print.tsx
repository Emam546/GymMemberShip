import { formateDate } from "@src/utils";
import { createTableDoc } from "@src/utils/jspdf";
import { PrintButton } from "@src/components/common/printButton";
import { printJsDoc } from "@src/utils/print";
import requester from "@src/utils/axios";
import { planToDays } from "@src/utils/payment";

export default function PrintPlanPayments({
  id,
  query,
}: {
  id: string;
  query?: unknown;
}) {
  return (
    <PrintButton
      fn={async () => {
        const res = await requester.get<
          Routes.ResponseSuccess<DataBase.WithId<DataBase.Models.Plans>>
        >(`/api/admin/plans/${id}`);
        const payments = await requester.get<
          Routes.ResponseSuccess<
            DataBase.WithId<
              DataBase.Populate<
                DataBase.Models.Payments,
                "userId",
                DataBase.WithId<DataBase.Models.User>
              >
            >[]
          >
        >(`/api/admin/plans/${id}/payments`, { params: query });
        const plan = res.data.data;

        const body = await Promise.all(
          payments.data.data.map<Promise<string[]>>(async (doc, i) => {
            const endAt = new Date(
              new Date(doc.createdAt).getTime() +
                planToDays(doc.plan) * 1000 * 24 * 60 * 60
            );
            return [
              (i + 1).toString(),
              doc.userId.name || "",
              `${doc.paid}EGP`,
              formateDate(new Date(doc.createdAt)),
              formateDate(new Date(endAt)),
            ];
          })
        );

        const doc = createTableDoc(
          [["Id", "User", "Paid Price", "CreatedAt", "EndAt"]],
          body
        );
        await printJsDoc(doc, `${plan.name}-payments.pdf`);
      }}
    />
  );
}
