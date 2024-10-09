import { FieldError } from "react-hook-form";
import MainInput, {
  ErrorInputShower,
  Props as MainInputProps,
} from "@src/components/common/inputs/main";
import SelectInput, { Props as SelectProps } from "./select";
import i18n from "@src/i18n";
import { useTranslation } from "react-i18next";
import { formateDate } from "@src/utils";

export interface Props {
  priceProps?: Omit<MainInputProps, "title" | "id">;
  unitProps?: Omit<SelectProps, "title" | "id">;
  err?: FieldError;
}

export default function PlanTypeInput({
  priceProps,
  unitProps,
  err,
}: Props) {
  const { t } = useTranslation("inputs:planType");
  return (
    <div>
      <div className="tw-flex">
        <div>
          <SelectInput {...unitProps} id={"paid-type"} title={t("type.label")}>
            <option value="">{t("type.default")}</option>;
            <option value={"day"}>{t("type.opt.day")}</option>
            <option value={"month"}>{t("type.opt.Month")}</option>
            <option value={"year"}>{t("type.opt.year")}</option>
          </SelectInput>
        </div>
        <div className="tw-flex-1">
          <MainInput {...priceProps} id="paid-num" title={t("amount.label")} />
        </div>
      </div>
      <ErrorInputShower err={err} />
    </div>
  );
}
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "inputs:planType": {
        type: {
          label: "Choose Type";
          default: "Choose Type";
          opt: {
            day: "Day";
            Month: "Month";
            year: "Year";
          };
        };
        endAt: "{{val}}";
        "amount.label": "Amount of Type";
      };
    }
  }
}
