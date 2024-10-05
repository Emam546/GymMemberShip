import PrimaryButton from "@src/components/button";
import { Grid2 } from "@src/components/grid";
import MainInput from "@src/components/common/inputs/main";
import { FieldError, useForm } from "react-hook-form";
import DatePicker, {
  EndDatePicker,
} from "@src/components/common/inputs/datePicker";
import { WrapElem } from "@src/components/common/inputs/styles";
import SelectPlan from "../../users/addPayment/selectPlan";
import PlanTypeInput from "@src/components/common/inputs/planType";
import CheckInput from "@src/components/common/checkInput";
import BudgetInput, {
  ShouldPaidBudget,
} from "@src/components/common/inputs/budget";
import Link from "next/link";
import { formateDate } from "@src/utils";
import { useTranslation } from "react-i18next";
import i18n from "@src/i18n";
import { useEffect } from "react";
import { getDefaultDays, paidType } from "@src/utils/payment";

export type DataType = {
  plan: DataBase.Models.Payments["plan"];
  paid: DataBase.Models.Payments["paid"];
  remaining: DataBase.Models.Payments["remaining"];
};
type FormData = DataBase.Models.Payments;
export interface Props {
  payment: DataBase.WithId<DataBase.Models.Payments>;
  user: DataBase.WithId<DataBase.Models.User>;
  plans: DataBase.WithId<DataBase.Models.Plans>[];
  onData: (data: DataType) => Promise<any> | any;
}
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "payment:form:update": {
        User: "User";
        Plan: "Plan";
        createdAt: string;
      };
    }
  }
}
export default function PaymentInfoForm({
  payment,
  onData,
  user,
  plans,
}: Props) {
  const { register, handleSubmit, setValue, formState, getValues, watch } =
    useForm<FormData>({
      values: payment,
      defaultValues: payment,
      resetOptions: {
        keepDirty: true,

        keepValues: true,
      },
    });
  const planId = watch("planId");
  const plan = plans.find((val) => val._id == planId);
  const planPrice = plan?.prices[getValues("plan.type")];
  const { t: t1 } = useTranslation("payment:form:update");
  const { t: t2 } = useTranslation("payment:add");

  useEffect(() => {
    const planType = getValues("plan.type");
    if (!planType) return;
    setValue("plan.num", getDefaultDays(planType));
  }, [watch("plan.type")]);
  return (
    <>
      <form
        onSubmit={handleSubmit(({ paid, plan, remaining }) => {
          onData({
            paid,
            plan,
            remaining,
          });
        })}
        autoComplete="off"
      >
        <Grid2>
          <div>
            <MainInput
              id={"name-input"}
              title={t1("User")}
              value={user.name}
              disabled={true}
            />
            <p>
              <Link href={`/users/${user._id}`}>{user.name}</Link>
            </p>
          </div>
          <SelectPlan
            plans={plans}
            planId={watch("planId")}
            id={"plan-input"}
            title={t1("Plan")}
            {...register("planId", { disabled: true })}
            err={formState.errors.planId}
          />
          <WrapElem label={t1("createdAt")}>
            <DatePicker disabled value={new Date(getValues("createdAt"))} />
          </WrapElem>
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
          <WrapElem label={t2("startAt")}>
            <DatePicker
              value={watch("startAt")}
              onChange={(val) => {
                if (val) setValue("startAt", val);
              }}
            />
          </WrapElem>
          <WrapElem label={t2("endAt")}>
            <EndDatePicker
              value={watch("endAt")}
              onChange={(val) => {
                if (val) setValue("endAt", val);
              }}
              numberOfDays={watch("plan.num")}
            />
          </WrapElem>
          <ShouldPaidBudget
            label={t2("paid.label")}
            priceProps={{
              ...register("paid", {
                required: t2("paid.required.num"),
                valueAsNumber: true,
                min: 0,
              }),
              placeholder: "eg.120",
              type: "number",
            }}
            unitProps={{}}
            err={formState.errors.paid}
            price={
              planPrice ? paidType(getValues("plan"), planPrice) : undefined
            }
          />
          <div>
            <BudgetInput
              label={t2("remaining")}
              priceProps={{
                ...register("remaining", {
                  required: t2("paid.required.num"),
                  valueAsNumber: true,
                  min: 0,
                  value: 0,
                }),
                placeholder: "eg.120",
                type: "number",
              }}
              unitProps={{}}
              err={formState.errors.paid}
            />
          </div>
        </Grid2>
        <div className="tw-mt-4 tw-flex tw-justify-end">
          <PrimaryButton type="submit" disabled={formState.isSubmitting}>
            {t2("buttons.update", { ns: "translation" })}
          </PrimaryButton>
        </div>
      </form>
    </>
  );
}
i18n.addLoadUrl("/components/payments/info", "payment:form:update");
i18n.addLoadUrl("/components/users/addPayment", "payment:add");
