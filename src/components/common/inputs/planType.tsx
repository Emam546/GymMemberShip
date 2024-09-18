import { FieldError } from "react-hook-form";
import MainInput, {
  ErrorInputShower,
  Props as MainInputProps,
} from "@src/components/common/inputs/main";
import SelectInput, { Props as SelectProps } from "./select";

export interface Props {
  label: string;
  priceProps?: Omit<MainInputProps, "title" | "id">;
  unitProps?: Omit<SelectProps, "title" | "id">;
  err?: FieldError;
}

export default function PlanTypeInput({
  priceProps,
  unitProps,
  err,
  label,
}: Props) {
  return (
    <div>
      <div className="tw-flex">
        <div>
          <SelectInput {...unitProps} id={"paid-type"} title={"Choose Type"}>
            <option value="">Choose Type</option>;
            <option value={"day"}>Day</option>
            <option value={"month"}>Month</option>
            <option value={"year"}>Year</option>
          </SelectInput>
        </div>
        <div className="tw-flex-1">
          <MainInput {...priceProps} id="paid-num" title="Amount of Type" />
        </div>
      </div>
      <ErrorInputShower err={err} />
    </div>
  );
}
