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
import SelectInput from "@src/components/common/inputs/select";
import {
  usePrintBarCode,
  useSendBarcodeAsImage,
} from "@src/components/BarcodePrinter";
import { printJsDoc } from "@src/utils/print";
import { PrintButton } from "@src/components/common/printButton";
import { WhatsappButton } from "@src/components/common/buttons/whatsapp";
import { isValidPhoneNumber } from "react-phone-number-input";
export interface Data {
  startAt: Date;
  endAt: Date;
  remaining: number;
  paid: DataBase.Price;
}
interface FormData extends Data {
  plan: DataBase.Models.Payments["plan"];
  trainerId?: string;
}
type Doc = DataBase.Populate.Model<
  DataBase.WithId<DataBase.Models.Payments>,
  "planId" | "adminId" | "userId"
>;

export interface Props {
  payment?: Doc;
  trainers: DataBase.WithId<DataBase.Models.Trainers>[];
  onUpdate: (payment: FormData) => void;
  onIncrement: (payment: Doc) => void;
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
export function AttendPerson({
  payment,
  onUpdate,
  onIncrement,
  trainers,
}: Props) {
  const {
    register,
    setValue,
    handleSubmit,
    getValues,
    watch,
    formState,
    reset,
  } = useForm<FormData>({
    defaultValues: { trainerId: "" },
    values: payment
      ? { ...payment, trainerId: payment.trainerId ?? "" }
      : undefined,
  });
  useEffect(() => {
    reset();
  }, [payment]);
  const { t } = useTranslation("payment:form:update");
  const { t: t2 } = useTranslation("payment:add");
  const { t: t3 } = useTranslation("form:attend");
  const printBarcode = usePrintBarCode({
    onSuccess(doc) {
      printJsDoc(doc, `${payment?.userId?.name?.split(" ").join("-")}.pdf`);
    },
  });
  const sendBarcode = useSendBarcodeAsImage({
    onSuccess() {
      alert("message was sent successfully");
    },
  });
  const attend = useAttend({
    onSuccess() {
      if (!payment) return;
      onIncrement({ ...payment, logsCount: payment.logsCount + 1 });
      reset();
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
          if (!payment) return alert(t("message.noPayment"));
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
              value={payment?.planId?.name}
              disabled
            />
            <Link href={`/plans/${payment?.planId?._id}`}>
              {payment?.planId?.name}
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
              payment?.planId?.prices[watch("plan.type")]
            )}
          />
          <BudgetInput
            label={t2("remaining")}
            priceProps={register("remaining", { valueAsNumber: true })}
            err={formState.errors.remaining}
          />
        </Grid2>
        <div className="tw-my-5">
          <SelectInput
            id="trainer-input"
            {...register("trainerId")}
            title={t2("trainer.label")}
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
        </div>
        <WrapElem label="Last Active Payment" className="tw-my-5">
          <table className="tw-text-center tw-w-full tw-mt-3 table-attended">
            <thead>
              <tr>
                <th>{t3("table.th.attended")}</th>
                <th>{t3("table.th.remaining")}</th>
                <th>{t3("table.th.total")}</th>
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
          <div className="tw-flex tw-gap-1 tw-items-start">
            <PrimaryButton disabled={formState.isLoading} type="submit">
              {t("buttons.update", { ns: "translation" })}
            </PrimaryButton>
            <PrintButton
              fn={async () => {
                if (!payment) return alert(t("message.noPayment"));

                await printBarcode.mutateAsync([
                  {
                    ...payment,
                    adminId: payment.adminId?._id || "",
                    trainerId: trainers.find(({ _id }) => {
                      return getValues("trainerId") == _id;
                    }),
                  },
                ]);
              }}
            />
            <WhatsappButton
              fn={async () => {
                if (!payment) return alert(t("message.noPayment"));
                if (
                  !payment.userId?.phone ||
                  !isValidPhoneNumber(payment.userId.phone)
                ) {
                  alert(t("message.validNumber"));
                  return;
                }
                await sendBarcode.mutateAsync({
                  data: [
                    {
                      ...payment,
                      adminId: payment.adminId?._id || "",
                      trainerId: trainers.find(({ _id }) => {
                        return getValues("trainerId") == _id;
                      }),
                    },
                  ],
                  phone: payment.userId.phone,
                });
              }}
            />
          </div>
          <div>
            <SuccessButton
              type="button"
              disabled={formState.isLoading}
              onClick={() => {
                if (!payment) return alert(t("message.noPayment"));

                const trainerId = getValues("trainerId");
                if (trainerId)
                  attend.mutate({
                    paymentId: payment._id,
                    body: { trainerId: trainerId },
                  });
                else attend.mutate({ paymentId: payment._id });
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
        table: {
          th: {
            attended: "AttendedDays";
            remaining: "Remaining Days";
            total: "Total Days";
          };
        };
      };
    }
  }
}

