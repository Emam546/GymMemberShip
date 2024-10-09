import PrimaryButton from "@src/components/button";
import BudgetInput, {
  ShouldPaidBudget,
} from "@src/components/common/inputs/budget";
import { Grid2 } from "@src/components/grid";
import { FieldError, useForm } from "react-hook-form";
import PlanTypeInput from "@src/components/common/inputs/planType";
import { useEffect } from "react";
import SelectPlan from "./selectPlan";
import { useTranslation } from "react-i18next";
import i18n from "@src/i18n";
import { getDefaultDays, paidType } from "@src/utils/payment";
import { WrapElem } from "@src/components/common/inputs/styles";
import DatePicker, {
  EndDatePicker,
} from "@src/components/common/inputs/datePicker";
import SelectInput from "@src/components/common/inputs/select";

export interface FormData {
  planId: string;
  plan: {
    type: DataBase.PlansType;
    num: number;
  };
  startAt: Date;
  endAt: Date;
  paid: DataBase.Price;
  remaining: DataBase.Price;
  trainerId?: string;
}
export interface Props {
  plans: DataBase.WithId<DataBase.Models.Plans>[];
  trainers: DataBase.WithId<DataBase.Models.Trainers>[];
  onData: (data: FormData) => any;
}

export default function AddUserPayment({ plans, onData, trainers }: Props) {
  const { handleSubmit, register, formState, getValues, setValue, watch } =
    useForm<FormData>();
  const planType = watch("plan.type");
  const numberOfDays = watch("plan.num");
  const planId = watch("planId");
  const { t } = useTranslation("payment:add");
  const plan = plans.find((val) => val._id == planId);
  const planPrice = plan?.prices[planType];
  const paidAmount = watch("paid");
  useEffect(() => {
    if (!planPrice) return;
    setValue("paid", paidType(getValues("plan"), planPrice));
  }, [planType, planId, numberOfDays]);
  useEffect(() => {
    if (!numberOfDays) return;
    const startAt = getValues("startAt");
    setValue(
      "endAt",
      new Date(
        startAt.getFullYear(),
        startAt.getMonth(),
        startAt.getDate() + numberOfDays
      )
    );
  }, [numberOfDays, watch("startAt")]);
  useEffect(() => {
    if (!planType) return;
    setValue("plan.num", getDefaultDays(planType));
  }, [planType]);
  useEffect(() => {
    if (!planPrice) return;
    const TheMust = paidType(getValues("plan"), planPrice);
    setValue("remaining", TheMust - paidAmount);
  }, [paidAmount]);
  register("startAt", { valueAsDate: true, value: new Date() });
  register("endAt", { valueAsDate: true, value: new Date() });
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        if (data["trainerId"] == "") delete data["trainerId"];

        await onData(data);
      })}
      autoComplete="off"
    >
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
              valueAsNumber: true,
            })}
            unitProps={register("plan.type", { required: true })}
            err={
              (formState.errors.plan?.num ||
                formState.errors.plan?.type) as FieldError
            }
          />
        </div>
        <WrapElem label={t("startAt")}>
          <DatePicker
            value={watch("startAt")}
            onChange={(val) => {
              if (val) setValue("startAt", val);
            }}
          />
        </WrapElem>
        <WrapElem label={t("endAt")}>
          <EndDatePicker
            value={watch("endAt")}
            onChange={(val) => {
              if (val) setValue("endAt", val);
            }}
            numberOfDays={numberOfDays}
          />
        </WrapElem>
        <ShouldPaidBudget
          label={t("paid.label")}
          priceProps={{
            ...register("paid", {
              required: t("paid.label"),
              valueAsNumber: true,
              min: 0,
            }),
            placeholder: t("paid.placeholder"),
            type: "number",
          }}
          unitProps={{}}
          err={formState.errors.paid}
          price={planPrice ? paidType(watch("plan"), planPrice) : undefined}
        />

        <BudgetInput
          label={t("remaining")}
          priceProps={{
            ...register("remaining", {
              required: t("paid.required.num"),
              valueAsNumber: true,
              value: 0,
            }),
            placeholder: "eg.120",
            type: "number",
          }}
          unitProps={{}}
          err={formState.errors.remaining}
        />
        <SelectInput
          {...register("trainerId")}
          title={t("trainer.label")}
          id={"trainer-input"}
          err={formState.errors.trainerId}
        >
          <option value="">{t("trainer.default")}</option>
          {trainers.map((val) => {
            return (
              <option value={val._id} key={val._id}>
                {val.name}
              </option>
            );
          })}
        </SelectInput>
      </Grid2>
      <div className="tw-flex tw-justify-end tw-items-end tw-mt-5">
        <PrimaryButton type="submit">
          {t("buttons.activate", { ns: "translation" })}
        </PrimaryButton>
      </div>
    </form>
  );
}
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "payment:add": {
        "Choose Course": "Choose Course";
        payment: {
          endAt: "This payment should be end at {{val}}";
        };
        paid: {
          label: "The amount paid";
          required: {
            currency: "Please select a currency";
            num: "Please set the course price or set it to 0";
          };
          paragraph: "The amount to be paid is {{val}}";
          placeholder: "eg.120";
        };
        startAt: string;
        endAt: string;
        remaining: string;
        trainer: {
          label: "Trainer";
          default: "Choose Trainer";
        };
      };
    }
  }
}
i18n.addLoadUrl("/components/users/addPayment", "payment:add");
