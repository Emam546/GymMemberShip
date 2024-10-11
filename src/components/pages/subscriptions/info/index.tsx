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
import BudgetInput, {
  ShouldPaidBudget,
} from "@src/components/common/inputs/budget";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import i18n from "@src/i18n";
import { useEffect } from "react";
import { getDefaultDays, paidType } from "@src/utils/payment";
import {
  usePrintBarCode,
  useSendBarcodeAsImage,
} from "@src/components/BarcodePrinter";
import { WhatsappButton } from "@src/components/common/buttons/whatsapp";
import { PrintButton } from "@src/components/common/printButton";
import { isValidPhoneNumber } from "react-phone-number-input";
import { printJsDoc } from "@src/utils/print";
import SelectInput from "@src/components/common/inputs/select";

export type DataType = {
  plan: DataBase.Models.Subscriptions["plan"];
  paid: DataBase.Models.Subscriptions["paid"];
  remaining: DataBase.Models.Subscriptions["remaining"];
};
type FormData = DataBase.Models.Subscriptions;
export interface Props {
  payment: DataBase.WithId<DataBase.Models.Subscriptions>;
  user?: DataBase.WithId<DataBase.Models.User>;
  plans: DataBase.WithId<DataBase.Models.Plans>[];
  trainers: DataBase.WithId<DataBase.Models.Trainers>[];
  onData: (data: DataType) => Promise<void> | void;
}

export default function PaymentInfoForm({
  payment,
  onData,
  user,
  plans,
  trainers,
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
  const { t: t1 } = useTranslation("subscription:form:update");
  const { t: t2 } = useTranslation("subscription:add");
  const sendBarcode = useSendBarcodeAsImage({
    onSuccess() {
      alert("message was sent successfully");
    },
  });
  const printBarcode = usePrintBarCode({
    onSuccess(doc) {
      printJsDoc(doc, `${user?.name?.split(" ").join("-")}.pdf`);
    },
  });
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
              value={user?.name}
              disabled={true}
            />
            <p>
              <Link href={`/users/${user?._id}`}>{user?.name}</Link>
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
          <SelectInput
            {...register("trainerId")}
            title={t2("trainer.label")}
            id={"trainer-input"}
            err={formState.errors.trainerId}
          >
            <option value="">{t2("trainer.default")}</option>
            {trainers.map((val) => {
              return (
                <option value={val._id} key={val._id}>
                  {val.name}
                </option>
              );
            })}
          </SelectInput>
        </Grid2>
        <div className="tw-mt-4 tw-flex tw-justify-between">
          <div className="tw-flex tw-gap-3">
            <PrintButton
              fn={async () => {
                if (!payment) return alert(t1("message.noPayment"));

                await printBarcode.mutateAsync([
                  {
                    ...payment,
                    adminId: payment.adminId,
                    planId: plans.find(({ _id }) => {
                      return payment.planId == _id;
                    }),
                    trainerId: trainers.find(({ _id }) => {
                      return getValues("trainerId") == _id;
                    }),
                    userId: user,
                  },
                ]);
              }}
            />
            <WhatsappButton
              fn={async () => {
                if (!payment) return alert(t1("message.noPayment"));

                if (!user?.phone || !isValidPhoneNumber(user.phone)) {
                  alert(t1("message.validNumber"));
                  return;
                }
                await sendBarcode.mutateAsync({
                  data: [
                    {
                      ...payment,
                      adminId: payment.adminId || "",
                      planId: plans.find(({ _id }) => {
                        return payment.planId == _id;
                      }),
                      trainerId: trainers.find(({ _id }) => {
                        return getValues("trainerId") == _id;
                      }),
                      userId: user,
                    },
                  ],
                  phone: user.phone,
                });
              }}
            />
          </div>
          <PrimaryButton type="submit" disabled={formState.isSubmitting}>
            {t2("buttons.update", { ns: "translation" })}
          </PrimaryButton>
        </div>
      </form>
    </>
  );
}
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "subscription:form:update": {
        User: "User";
        Plan: "Plan";
        createdAt: string;
        message: {
          noPayment: string;
          validNumber: string;
        };
      };
    }
  }
}
