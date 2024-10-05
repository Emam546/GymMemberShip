import { formateDate } from "@src/utils";
import { createTableDoc } from "@src/utils/jspdf";
import { PrintButton } from "@src/components/common/printButton";
import { printJsDoc } from "@src/utils/print";
import requester from "@src/utils/axios";
export interface Data {
  query: unknown;
  id: string;
}
type LogDoc = DataBase.Populate.Model<
  DataBase.WithId<DataBase.Models.Logs>,
  "adminId" | "userId" | "trainerId"
>;
export default function PrintPlanLogs({ query, id }: Data) {
  return (
    <PrintButton
      fn={async () => {
        const payments = await requester.get<Routes.ResponseSuccess<LogDoc[]>>(
          `/api/admin/plans/${id}/logs`,
          { params: query }
        );
        const body = payments.data.data.map<string[]>((doc, i) => {
          return [
            (i + 1).toString(),
            doc.userId?.name || "",
            formateDate(new Date(doc.createdAt)),
          ];
        });

        const doc = createTableDoc([["Id", "User", "CreatedAt"]], body);
        await printJsDoc(doc, `${new Date().getTime()}-payments.pdf`);
      }}
    />
  );
}
