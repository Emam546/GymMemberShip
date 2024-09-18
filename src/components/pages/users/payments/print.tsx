import { formateDate } from "@src/utils";
import { createTableDoc } from "@src/utils/jspdf";
import { PrintButton } from "@src/components/common/printButton";
import { printJsDoc } from "@src/utils/print";
import requester from "@src/utils/axios";

export default function PrintUserPayments({ id }: { id: string }) {
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
                "planId",
                DataBase.WithId<DataBase.Models.Plans>
              >
            >[]
          >
        >(`/api/admin/users/${id}/payments`);
        const plan = res.data.data;
        const body = payments.data.data.map<string[]>((doc, i) => {
          return [
            (i + 1).toString(),
            doc.planId.name || "",
            `${doc.paid.num} ${doc.paid.type}`,
            formateDate(new Date(doc.createdAt)),
          ];
        });

        const doc = createTableDoc(
          [["Id", "Plan", "Paid Price", "CreatedAt"]],
          body
        );
        printJsDoc(doc, `${plan.name}-payments.pdf`);
      }}
    />
  );
}
