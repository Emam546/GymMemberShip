import PrimaryButton from "@src/components/button";
import BudgetInput from "@src/components/common/inputs/budget";
import { Grid2 } from "@src/components/grid";
import { FieldError, useForm } from "react-hook-form";
import PlanTypeInput from "@src/components/common/inputs/planType";
import { useEffect } from "react";
import CheckInput from "@src/components/common/checkInput";
import SelectPlan from "./selectPlan";
import { formateDate } from "@src/utils";
import { planToDays } from "@src/utils/payment";
import { useTranslation } from "react-i18next";
import i18n from "@src/i18n";

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
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "payment:add": {
        "Choose Course": "Choose Course",
        "payment": {
          "endAt": "This payment should be end at {{val}}"
        },
        "paid": {
          "label": "The amount paid",
          "required": {
            "currency": "Please select a currency",
            "num": "Please set the course price or set it to 0"
          },
          "paragraph": "The amount to be paid is {{val}}",
          "placeholder": "eg.120"
        },
        "separated": "separated"
      }
    }
  }
}
export default function AddUserPayment({ plans, onData }: Props) {
  const { handleSubmit, register, formState, getValues, setValue, watch } =
    useForm<FormData>();
  const paidType = watch("plan.type");
  const numberOfDays = watch("plan.num");
  const planId = watch("planId");
  const { t } = useTranslation("payment:add")
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
            title={t("Choose Course")}
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
              {t("payment.endAt", {
                val: formateDate(
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
                )
              })}
            </p>
          )}
        </div>
        <div>
          <BudgetInput
            label={t("paid.label")}
            priceProps={{
              ...register("paid.num", {
                required: t("paid.label"),
                valueAsNumber: true,
                min: 0,
              }),
              placeholder: t("paid.placeholder"),
              type: "number",
            }}
            unitProps={{
              ...register("paid.type", {
                required: t("paid.required.currency"),
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
              {t("paid.paragraph", {
                val: `${numberOfDays * planPrice.num
                  }${planPrice.type.toLocaleUpperCase()}`
              })}
            </p>
          )}
        </div>
        <div className="tw-self-stretch tw-flex tw-items-end tw-max-h-[4.4rem]">
          <CheckInput
            label={t("separated")}
            id={"separated-input"}
            className="tw-mx-0.5 tw-h-4 tw-w-4 tw-rounded tw-overflow-hidden"
            {...register("separated")}
          />
        </div>
      </Grid2>
      <div className="tw-flex tw-justify-end tw-items-end tw-mt-5">
        <PrimaryButton type="submit">{t("buttons.activate", { ns: "translation" })}</PrimaryButton>
      </div>
    </form>
  );
}
i18n.addLoadUrl("/locales/components/users/addPayment", "payment:add")