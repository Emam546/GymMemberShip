import { Grid2 } from "@src/components/grid";
import { useForm } from "react-hook-form";
import { useDebounceEffect } from "@src/hooks";

import i18n from "@src/i18n";
import { useTranslation } from "react-i18next";
import CheckInput from "@src/components/common/checkInput";
export interface DataType {
  isActive: boolean;
  remaining?: true;
}
export interface Props {
  onData: (data: DataType) => Promise<any> | any;
  values: DataType;
}
export type DefaultData = DataType;
export default function TimeStartEndSelector({ onData, values }: Props) {
  const { handleSubmit, register, getValues, watch } = useForm<DataType>({
    defaultValues: values,
    values,
  });
  const { t } = useTranslation("payments:filter");
  useDebounceEffect(
    () => {
      const data = getValues();
      onData({ ...data, remaining: data.remaining || undefined });
    },
    1000,
    [watch()]
  );
  return (
    <div>
      <Grid2>
        <CheckInput
          label={"is Active"}
          id={"is-active"}
          defaultChecked
          {...register("isActive")}
        />
        <CheckInput
          {...register("isActive")}
          label={"Has remaining money"}
          id={"has-money"}
        />
      </Grid2>
    </div>
  );
}
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "payment:data:form": {
        isActive: string;
        hasRemaining: string;
      };
    }
  }
}
// i18n.addLoadUrl("/components/payments/filter", "payments:filter");
