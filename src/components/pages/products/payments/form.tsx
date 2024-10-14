import { Grid2 } from "@src/components/grid";
import MainInput from "@src/components/common/inputs/main";
import { useForm } from "react-hook-form";
import DatePicker from "@src/components/common/inputs/datePicker";
import { WrapElem } from "@src/components/common/inputs/styles";
import { useTranslation } from "react-i18next";

export type DataType = {
  createdAt: Date;
};
type FormData = DataBase.Models.ProductPayments;
export interface Props {
  payment: DataBase.WithId<DataBase.Models.ProductPayments>;
  admin?: DataBase.WithId<DataBase.Models.Admins>;
}

export default function ProductPaymentInfoForm({ payment, admin }: Props) {
  const { getValues } = useForm<FormData>({
    values: payment,
  });
  const { t } = useTranslation("productsPayments:info:form");

  return (
    <>
      <Grid2>
        <MainInput
          id={"name-input"}
          title={t("admin")}
          value={admin?.name}
          disabled
        />
        <WrapElem label={t("createdAt")}>
          <DatePicker disabled value={new Date(getValues("createdAt"))} />
        </WrapElem>
      </Grid2>
    </>
  );
}
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "productsPayments:info:form": {
        admin: "Admin";
        createdAt: string;
      };
    }
  }
}
