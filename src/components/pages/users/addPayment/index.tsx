import PrimaryButton from "@src/components/button";
import BudgetInput from "@src/components/common/inputs/budget";
import { Grid2 } from "@src/components/grid";
import { FieldError, useForm } from "react-hook-form";
import PlanTypeInput from "@src/components/common/inputs/planType";
import { useEffect } from "react";
import Link from "next/link";
import CheckInput from "@src/components/common/checkInput";
import SelectPlan from "./selectPlan";
import { formateDate } from "@src/utils";
import { planToDays } from "@src/utils/payment";

export interface FormData {
  planId: string;
  plan: {
    type: DataBase.PlansType;
    num: number;
  };
  separated: boolean;
  paid: DataBase.Price;
}
export interface Props {
  plans: DataBase.WithId<DataBase.Models.Plans>[];
  onData: (data: FormData) => any;
}
export default function AddUserPayment({ plans, onData }: Props) {
  const { handleSubmit, register, formState, getValues, setValue, watch } =
    useForm<FormData>();
  const paidType = watch("plan.type");
  const numberOfDays = watch("plan.num");
  const planId = watch("planId");
  const plan = plans.find((val) => val._id == planId);
  const planPrice = plan?.prices[paidType];
  useEffect(() => {
    if (!planPrice) return;
    setValue("paid.num", numberOfDays * planPrice.num);
    setValue("paid.type", planPrice.type);
  }, [paidType, planId, numberOfDays]);
  return (
    <form onSubmit={handleSubmit(onData)} autoComplete="off">
      <Grid2>
        <div>
          <SelectPlan
            id={"plan-input"}
            title={"Choose Course"}
            plans={plans}
            planId={planId}
            err={formState.errors.planId}
            {...register("planId", { required: true })}
          />
        </div>
        <div>
          <PlanTypeInput
            priceProps={register("plan.num", {
              required: true,
              value: 1,
              valueAsNumber: true,
            })}
            unitProps={register("plan.type", { required: true })}
            err={
              (formState.errors.plan?.num ||
                formState.errors.plan?.type) as FieldError
            }
          />
          {paidType && numberOfDays && (
            <p className="tw-mb-0">
              This payment should be end at{" "}
              {formateDate(
                new Date(
                  new Date().getTime() +
                    planToDays({
                      type: paidType,
                      num: numberOfDays,
                    }) *
                      1000 *
                      24 *
                      60 *
                      60
                )
              )}
            </p>
          )}
        </div>
        <div>
          <BudgetInput
            label={"The amount paid"}
            priceProps={{
              ...register("paid.num", {
                required: "Please set the course price or set it to 0",
                valueAsNumber: true,
                min: 0,
              }),
              placeholder: "eg.120",
              type: "number",
            }}
            unitProps={{
              ...register("paid.type", {
                required: "Please select a currency",
                value: "EGP",
              }),
            }}
            err={
              (formState.errors.paid?.num ||
                formState.errors.paid?.type) as FieldError
            }
          />
          {planPrice && (
            <p className="tw-mb-0">
              The amount to be paid is{" "}
              <span>
                {`${
                  numberOfDays * planPrice.num
                }${planPrice.type.toLocaleUpperCase()}`}
              </span>
            </p>
          )}
        </div>
        <div className="tw-self-stretch tw-flex tw-items-end tw-max-h-[4.4rem]">
          <CheckInput
            label={"Separated"}
            id={"separated-input"}
            className="tw-mx-0.5 tw-h-4 tw-w-4 tw-rounded tw-overflow-hidden"
            {...register("separated")}
          />
        </div>
      </Grid2>
      <div className="tw-flex tw-justify-end tw-items-end tw-mt-5">
        <PrimaryButton type="submit">Activate</PrimaryButton>
      </div>
    </form>
  );
}
