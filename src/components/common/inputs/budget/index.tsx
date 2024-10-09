import {
  StyledInput,
  InputProps,
  SelectedInputProps,
  WrapElem,
} from "@src/components/common/inputs/styles";
import { ErrorInputShower } from "../main";
import { FieldError } from "react-hook-form";
import { isNumber, isString } from "@src/utils/types";
import { useTranslation } from "react-i18next";
import i18n from "@src/i18n";

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
export interface ShouldPaidBudgetProps extends Props {
  price?: number;
}
export function ShouldPaidBudget({ price, ...props }: ShouldPaidBudgetProps) {
  const { t } = useTranslation("input:budget");
  return (
    <div>
      <BudgetInput {...props} />
      {isNumber(price) && (
        <p className="tw-mb-0">
          {t("shouldPay.paragraph", {
            val: `${price}EGP`,
          })}
        </p>
      )}
    </div>
  );
}
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "input:budget": {
        shouldPay: {
          paragraph: "the amount to be paid is {{val}}";
        };
      };
    }
  }
}
