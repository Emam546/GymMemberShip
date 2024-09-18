import {
  StyledInput,
  InputProps,
  SelectedInputProps,
  StyledSelect,
  WrapElem,
} from "@src/components/common/inputs/styles";
import currencies from "./options.json";
import { ErrorInputShower } from "../main";
import { FieldError } from "react-hook-form";

export type Props = {
  label: string;
  priceProps?: InputProps;
  unitProps?: SelectedInputProps;
  err?: FieldError;
};

export default function BudgetInput({
  label,
  priceProps,
  unitProps,
  err,
}: Props) {
  return (
    <WrapElem label={label}>
      <div className="tw-flex tw-justify-stretch tw-gap-2">
        <div className="tw-flex-1">
          <StyledInput {...priceProps} />
        </div>
        {/* <div>
          <StyledSelect {...{ defaultValue: "EGP", ...unitProps }}>
            {currencies.map(({ code, name }) => {
              return (
                <option key={name} value={code}>
                  {name}
                </option>
              );
            })}
          </StyledSelect>
        </div> */}
      </div>
      <ErrorInputShower err={err} />
    </WrapElem>
  );
}
