import { formateDate } from "@src/utils";
import { createTableDoc } from "@src/utils/jspdf";
import { PrintButton } from "@src/components/common/printButton";
import { printJsDoc } from "@src/utils/print";
import requester from "@src/utils/axios";
export interface Data {
  query: unknown;
}
type LogDoc = DataBase.Populate<
  DataBase.Populate<
    DataBase.WithId<DataBase.Models.Logs>,
    "userId",
    DataBase.WithId<DataBase.Models.User>
  >,
  "planId",
  DataBase.WithId<DataBase.Models.Plans>
>;
export default function PrintLogs({ query }: Data) {
  return (
    <PrintButton
      fn={async () => {
        const payments = await requester.get<Routes.ResponseSuccess<LogDoc[]>>(
          `/api/admin/logs`,
          { params: query }
        );
        const body = payments.data.data.map<string[]>((doc, i) => {
          return [
            (i + 1).toString(),
            doc.userId.name || "",
            doc.planId.name || "",
            formateDate(new Date(doc.createdAt)),
          ];
        });

        const doc = createTableDoc([["Id", "User", "Plan", "CreatedAt"]], body);
        await printJsDoc(doc, `${new Date().getTime()}-payments.pdf`);
      }}
    />
  );
}
