import DatePicker, {
  EndDatePicker,
} from "@src/components/common/inputs/datePicker";
import PrimaryButton, { SuccessButton } from "@src/components/button";
import MainInput from "@src/components/common/inputs/main";
import PlanTypeInput from "@src/components/common/inputs/planType";
import { WrapElem } from "@src/components/common/inputs/styles";
import { Grid2 as OrgGrid } from "@src/components/grid";
import i18n from "@src/i18n";
import { FieldError, useForm } from "react-hook-form";
import { ComponentProps, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { paidType, remainingDays } from "@src/utils/payment";
import BudgetInput, {
  ShouldPaidBudget,
} from "@src/components/common/inputs/budget";
import { useAttend } from "@src/hooks/payments";
export interface Data {
  startAt: Date;
  endAt: Date;
  remaining: number;
  paid: DataBase.Price;
}
interface FormData extends Data {
  plan: DataBase.Models.Payments["plan"];
}
type Doc = DataBase.Populate<
  DataBase.WithId<DataBase.Models.Payments>,
  "planId",
  DataBase.WithId<DataBase.Models.Plans>
>;

export interface Props {
  payment?: Doc;
  onUpdate: (payment: FormData) => any;
  onIncrement: (payment: Doc) => any;
}
export function Grid2({ ...props }: ComponentProps<"div">) {
  return (
    <OrgGrid
      {...props}
      style={{
        gap: 0,
      }}
    />
  );
}
export function AttendPerson({ payment, onUpdate, onIncrement }: Props) {
  const { register, setValue, handleSubmit, watch, formState, reset } =
    useForm<FormData>({
      values: payment,
    });
  useEffect(() => {
    reset();
  }, [payment]);
  const { t } = useTranslation("payment:form:update");
  const { t: t2 } = useTranslation("payment:add");
  const attend = useAttend({
    onSuccess() {
      onIncrement({ ...payment!, logsCount: payment!.logsCount + 1 });
    },
  });
  register("startAt", { valueAsDate: true });

  const TotalDays = watch("plan.num") || 0;
  const rDays = payment ? remainingDays(payment) : 0;
  const attendedDays = payment?.logsCount || 0;

  return (
    <>
      <form
        action=""
        onSubmit={handleSubmit(async (data) => {
          if (!payment) return;
          await onUpdate({
            endAt: data.endAt,
            paid: data.paid,
            plan: data.plan,
            startAt: data.startAt,
            remaining: data.remaining,
          });
        })}
      >
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
        <Grid2 className="tw-my-4">
          <div>
            <MainInput
              title={t("Plan")}
              id="user-id"
              value={payment?.planId.name}
              disabled
            />
            <Link href={`/plans/${payment?.planId._id}`}>
              {payment?.planId.name}
            </Link>
          </div>
          <WrapElem label={t("createdAt")}>
            <DatePicker
              value={new Date(payment?.createdAt || new Date())}
              disabled
            />
          </WrapElem>
          <WrapElem label={t2("startAt")}>
            <DatePicker
              value={
                new Date(watch("startAt") || payment?.createdAt || new Date())
              }
              onChange={(val) => {
                if (val) setValue("startAt", val);
              }}
            />
          </WrapElem>
          <WrapElem label={t2("endAt")}>
            <EndDatePicker
              value={new Date(payment?.endAt || new Date())}
              onChange={(val) => {
                if (!val) return;
                setValue("endAt", val);
              }}
              numberOfDays={watch("plan.num")}
            />
          </WrapElem>

          <ShouldPaidBudget
            label={t2("paid.label")}
            priceProps={register("paid")}
            price={paidType(
              watch("plan"),
              payment?.planId.prices[watch("plan.type")]
            )}
          />
          <BudgetInput
            label={t2("remaining")}
            priceProps={register("remaining", { valueAsNumber: true })}
          />
        </Grid2>

        <WrapElem label="Last Active Payment" className="tw-my-5">
          <table className="tw-text-center tw-w-full tw-mt-3 table-attended">
            <thead>
              <tr>
                <th>Attended Days</th>
                <th>Remaining Days</th>
                <th>Total Days</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{attendedDays}</td>
                <td>{rDays}</td>
                <td>{TotalDays}</td>
              </tr>
            </tbody>
          </table>
        </WrapElem>
        <div className="tw-flex tw-justify-between">
          <div className="tw-flex tw-gap-1">
            <PrimaryButton disabled={formState.isLoading} type="submit">
              {t("buttons.update", { ns: "translation" })}
            </PrimaryButton>
          </div>
          <div>
            <SuccessButton
              type="button"
              disabled={formState.isLoading}
              onClick={() => {
                if (payment) attend.mutate(payment._id);
              }}
            >
              {t("buttons.attend", { ns: "translation" })}
            </SuccessButton>
          </div>
        </div>
      </form>
    </>
  );
}

declare global {
  namespace I18ResourcesType {
    interface Resources {
      "form:attend": {
        userName: "User Name";
        planName: "Plan";
        createdAt: "Created At";
        startedAt: "Started At";
        endAt: "End At";
        paid: "Paid";
        remaining: "Remaining";
        lastPayment: "Last Active Payment";
      };
    }
  }
}
i18n.addLoadUrl("/components/payments/info", "payment:form:update");
i18n.addLoadUrl("/components/users/addPayment", "payment:add");
