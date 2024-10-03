import SelectInput, {
  Props as SelectInputProps,
} from "@src/components/common/inputs/select";
import Link from "next/link";
import React, { ComponentRef, useState, useTransition } from "react";
export interface Props extends SelectInputProps {
  plans: DataBase.WithId<DataBase.Models.Plans>[];
  planId?: string;
}
const SelectPlan = React.forwardRef<ComponentRef<"select">, Props>(
  ({ plans, children, planId, ...props }, ref) => {
    const { t } = useTranslation("inputs:selectPlan");
    const plan = plans.find((val) => val._id == planId);
    return (
      <div>
        <SelectInput ref={ref} {...props}>
          <option value="">{t("default")}</option>
          {plans.map((val) => {
            return (
              <option value={val._id} key={val._id}>
                {val.name}
              </option>
            );
          })}
          {children}
        </SelectInput>
        <p className="tw-mb-0">
          {plan && <Link href={`/plans/${plan?._id}`}>{plan?.name}</Link>}
        </p>
      </div>
    );
  }
);
import i18n from "@src/i18n";
import { useTranslation } from "react-i18next";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "inputs:selectPlan": {
        default: "Choose Course";
      };
    }
  }
}
i18n.addLoadUrl(
  "/components/common/selectPlan",
  "inputs:selectPlan"
);

export default SelectPlan;
