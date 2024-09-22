import { Grid2 } from "@src/components/grid";
import { useForm } from "react-hook-form";
import { formateDate, ObjectEntries } from "@src/utils";
import { useDebounceEffect } from "@src/hooks";
import { StyledInput, WrapElem } from "@src/components/common/inputs/styles";
import DatePicker from "@src/components/common/inputs/datePicker";

export interface DataType {
  startAt: Date;
  endAt: Date;
}
export interface Props {
  onData: (data: DataType) => Promise<any> | any;
  values: DataType;
}
export type DefaultData = DataType;
export default function PaymentsFilter({ onData, values }: Props) {
  const { handleSubmit, setValue, getValues, watch } = useForm<DataType>({
    defaultValues: values,
    values,
  });
  useDebounceEffect(
    () => {
      onData(getValues());
    },
    1000,
    [watch("startAt"), watch("endAt")]
  );
  return (
    <form
      onSubmit={handleSubmit((data: any) => {
        return onData(data);
      })}
      autoComplete="off"
    >
      <Grid2>
        <WrapElem label="Start from">
          <DatePicker
            value={new Date(getValues("startAt"))}
            onChange={(val) => {
              setValue("startAt", val);
            }}
          />
        </WrapElem>
        <WrapElem label="End at">
          <DatePicker
            value={new Date(getValues("endAt"))}
            onChange={(val) => {
              setValue("endAt", val);
            }}
          />
        </WrapElem>
      </Grid2>
    </form>
  );
}
