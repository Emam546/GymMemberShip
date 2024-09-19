import SelectInput, {
  Props as SelectInputProps,
} from "@src/components/common/inputs/select";
import Link from "next/link";
import React, { ComponentRef, useState } from "react";
export interface Props extends SelectInputProps {
  plans: DataBase.WithId<DataBase.Models.Plans>[];
  planId?: string;
}
const SelectPlan = React.forwardRef<ComponentRef<"select">, Props>(
  ({ plans, children, planId, ...props }, ref) => {
    const plan = plans.find((val) => val._id == planId);
    return (
      <div>
        <SelectInput
          ref={ref}
          {...props}
        >
          <option value="">Choose Plan</option>;
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
export default SelectPlan;
