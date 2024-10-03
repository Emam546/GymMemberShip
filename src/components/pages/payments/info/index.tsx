import PrimaryButton from "@src/components/button";
import { Grid2 } from "@src/components/grid";
import MainInput from "@src/components/common/inputs/main";
import { FieldError, useForm } from "react-hook-form";
import DatePicker from "@src/components/common/inputs/datePicker";
import { WrapElem } from "@src/components/common/inputs/styles";
import SelectPlan from "../../users/addPayment/selectPlan";
import PlanTypeInput from "@src/components/common/inputs/planType";
import CheckInput from "@src/components/common/checkInput";
import BudgetInput from "@src/components/common/inputs/budget";
import Link from "next/link";
import { formateDate } from "@src/utils";
import { useTranslation } from "react-i18next";
import i18n from "@src/i18n";
import { useEffect } from "react";
import { getDefaultDays, paidType } from "@src/utils/payment";

export type DataType = {
  plan: DataBase.Models.Payments["plan"];
  paid: DataBase.Models.Payments["paid"];
  separated: DataBase.Models.Payments["separated"];
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
        createdAt: {
          label: "Created At";
          paragraph: "This payment should be end at {{val}}";
        };
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
    });
  const planId = watch("planId");
  const plan = plans.find((val) => val._id == planId);
  const planPrice = plan?.prices[getValues("plan.type")];
  const endAt = new Date(
    new Date(payment.createdAt).getTime() +
      payment.plan.num * 1000 * 24 * 60 * 60
  );
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
        onSubmit={handleSubmit(({ paid, plan, separated, remaining }) => {
          onData({
            paid,
            plan,
            separated,
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
            planId={planId}
            id={"plan-input"}
            title={t1("Plan")}
            {...register("planId", { disabled: true })}
            err={formState.errors.planId}
          />
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
          </div>
          <div>
            <BudgetInput
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
            />
            {planPrice && (
              <p className="tw-mb-0">
                {t2("paid.paragraph", {
                  val: `${paidType(getValues("plan"), planPrice)}EGP`,
                })}
              </p>
            )}
          </div>
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
          <WrapElem label={t1("createdAt.label")}>
            <DatePicker disabled value={new Date(getValues("createdAt"))} />
            <p className="tw-mb-0">
              {t1("createdAt.paragraph", { val: formateDate(endAt) })}
            </p>
          </WrapElem>
          <div className="tw-self-stretch tw-flex tw-items-end tw-max-h-[4.4rem]">
            <CheckInput
              label={t2("separated")}
              id={"separated-input"}
              {...register("separated")}
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
