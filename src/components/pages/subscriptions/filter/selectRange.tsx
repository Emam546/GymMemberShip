import { Grid2 } from "@src/components/grid";
import { useForm } from "react-hook-form";
import { useDebounceEffect } from "@src/hooks";

import { useTranslation } from "react-i18next";
import MainInput from "@src/components/common/inputs/main";
export interface DataType {
  start: number;
  end: number;
}
type FormValues = DataType;
export interface Props {
  onData: (data: DataType) => Promise<any> | any;
  values?: DataType;
}
export type DefaultData = DataType;
export default function SelectRangeForm({ onData, values }: Props) {
  const { register, getValues, watch, formState } = useForm<FormValues>({
    values,
  });
  const { t } = useTranslation("subscription:selectRange:form");
  useDebounceEffect(
    () => {
      const data = getValues();
      onData({
        start: data.start || 0,
        end: data.end || 0,
      });
    },
    1000,
    [JSON.stringify(watch())]
  );
  return (
    <Grid2>
      <MainInput
        type="number"
        title={t("start")}
        id={"start-input"}
        {...register("start", { valueAsNumber: true, min: 0 })}
        err={formState.errors.start}
      />
      <MainInput
        type="number"
        title={t("end")}
        id={"start-input"}
        err={formState.errors.end}
        {...register("end", { valueAsNumber: true })}
      />
    </Grid2>
  );
}
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "subscription:selectRange:form": {
        start: "Start";
        end: "End";
      };
    }
  }
}
