import { Grid2 } from "@src/components/grid";
import { useForm } from "react-hook-form";
import { useDebounceEffect } from "@src/hooks";
import { WrapElem } from "@src/components/common/inputs/styles";
import DatePicker from "@src/components/common/inputs/datePicker";

export interface DataType {
  startAt: Date;
  endAt: Date;
}
export interface Props {
  onData: (data: DataType) => Promise<any> | any;
  values: DataType;
}
import i18n from "@src/i18n";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";



export type DefaultData = DataType;
export default function TimeStartEndSelector({ onData, values }: Props) {
  const { handleSubmit, setValue, getValues, watch } = useForm<DataType>({
    defaultValues: values,
    values,
  });
  const { t } = useTranslation("payments:filter");
  useDebounceEffect(
    () => {
      onData(getValues());
    },
    1000,
    [watch("startAt"), watch("endAt")]
  );
  return (
    <div>
      <Grid2>
        <WrapElem label={t("Start at")}>
          <DatePicker
            value={new Date(getValues("startAt"))}
            onChange={(val) => {
              setValue("startAt", val);
            }}
            maxDate={dayjs(new Date(getValues("endAt")))}
          />
        </WrapElem>
        <WrapElem label={t("End At")}>
          <DatePicker
            value={new Date(getValues("endAt"))}
            onChange={(val) => {
              setValue("endAt", val);
            }}
            minDate={dayjs(new Date(getValues("startAt")))}
          />
        </WrapElem>
      </Grid2>
    </div>
  );
}
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "payments:filter": {
        "Start at": "Start at";
        "End At": "End at";
      };
    }
  }
}