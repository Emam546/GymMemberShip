import PrimaryButton from "@src/components/button";
import { Grid2 } from "@src/components/grid";
import MainInput from "@src/components/common/inputs/main";
import { FieldError, useForm } from "react-hook-form";
import DatePicker from "@src/components/common/inputs/datePicker";
import { WrapElem } from "@src/components/common/inputs/styles";
import SelectPlan from "../../users/addPayment/selectPlan";
import PlanTypeInput from "@src/components/common/inputs/planType";
import { useEffect } from "react";
import CheckInput from "@src/components/common/checkInput";
import BudgetInput from "@src/components/common/inputs/budget";
import Link from "next/link";
import { planToDays } from "@src/utils/payment";
import { formateDate } from "@src/utils";

export type DataType = {
  plan: DataBase.Models.Payments["plan"];
  paid: DataBase.Models.Payments["paid"];
  separated: DataBase.Models.Payments["separated"];
};
type FormData = DataBase.Models.Payments;
export interface Props {
  payment: DataBase.WithId<DataBase.Models.Payments>;
  user: DataBase.WithId<DataBase.Models.User>;
  plans: DataBase.WithId<DataBase.Models.Plans>[];
  onData: (data: DataType) => Promise<any> | any;
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
  const paidType = watch("plan.type");
  const numberOfDays = watch("plan.num");
  const planId = watch("planId");
  const plan = plans.find((val) => val._id == planId);
  const planPrice = plan?.prices[paidType];
  const endAT = new Date(
    new Date(payment.createdAt).getTime() +
      planToDays(payment.plan) * 1000 * 24 * 60 * 60
  );
  return (
    <>
      <form
        onSubmit={handleSubmit(({ paid, plan, separated }) => {
          onData({
            paid,
            plan,
            separated,
          });
        })}
        autoComplete="off"
      >
        <Grid2>
          <div>
            <MainInput
              id={"name-input"}
              title={"User"}
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
            id={"phone-input"}
            title={"Plan"}
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

          <WrapElem label="Created At">
            <DatePicker disabled value={new Date(getValues("createdAt"))} />
            <p className="tw-mb-0">
              This payment should be end at {formateDate(endAT)}
            </p>
          </WrapElem>
          <div className="tw-self-stretch tw-flex tw-items-end tw-max-h-[4.4rem]">
            <CheckInput
              label={"Separated"}
              id={"separated-input"}
              className="tw-mx-0.5 tw-h-4 tw-w-4 tw-rounded tw-overflow-hidden"
              {...register("separated")}
            />
          </div>
        </Grid2>
        <div className="tw-mt-4 tw-flex tw-justify-end">
          <PrimaryButton type="submit" disabled={formState.isSubmitting}>
            Update
          </PrimaryButton>
        </div>
      </form>
    </>
  );
}
