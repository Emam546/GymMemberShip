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
        >(`/api/admin/users/${id}`);
        const payments = await requester.get<
          Routes.ResponseSuccess<
            DataBase.Populate.Model<
              DataBase.WithId<DataBase.Models.Payments>,
              "planId" | "adminId"
            >[]
          >
        >(`/api/admin/users/${id}/payments`);
        const user = res.data.data;
        const body = payments.data.data.map<string[]>((doc, i) => {
          const endAt = new Date(
            new Date(doc.createdAt).getTime() +
              doc.plan.num * 1000 * 24 * 60 * 60
          );
          return [
            (i + 1).toString(),
            doc.planId?.name || "",
            `${doc.paid} EGP`,
            formateDate(new Date(doc.createdAt)),
            formateDate(new Date(endAt)),
          ];
        });

        const doc = createTableDoc(
          [["Id", "Plan", "Paid Price", "CreatedAt", "End At"]],
          body
        );
        await printJsDoc(doc, `${user.name}-payments.pdf`);
      }}
    />
  );
}
