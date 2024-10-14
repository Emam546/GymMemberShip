import PrimaryButton from "@src/components/button";
import BudgetInput, {
  ShouldPaidBudget,
} from "@src/components/common/inputs/budget";
import { Grid2 } from "@src/components/grid";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export interface FormData {
  paid: DataBase.Price;
  remaining: DataBase.Price;
}
export interface Props {
  totalPrice: number;
  onData: (data: FormData) => any;
  values?: FormData;
  buttonName: React.ReactNode;
  disableAutoUpdating?: boolean;
}

export default function MoneyPaidProductForm({
  onData,
  totalPrice,
  buttonName,
  values,
  disableAutoUpdating,
}: Props) {
  const { handleSubmit, register, formState, setValue, watch, getValues } =
    useForm<FormData>({
      values,
    });
  const { t } = useTranslation("productPayment:money:form");

  useEffect(() => {
    if (disableAutoUpdating) return;
    setValue("remaining", totalPrice - getValues("paid"));
  }, [watch("paid")]);
  useEffect(() => {
    if (disableAutoUpdating) return;
    setValue("paid", totalPrice);
  }, [totalPrice]);
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        await onData(data);
      })}
      autoComplete="off"
    >
      <Grid2>
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
          price={totalPrice}
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
      </Grid2>
      <div className="tw-flex tw-justify-end tw-items-end tw-mt-5">
        <PrimaryButton type="submit" disabled={formState.isSubmitting}>
          {buttonName}
        </PrimaryButton>
      </div>
    </form>
  );
}
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "productPayment:money:form": {
        paid: {
          label: string;
          placeholder: string;
          "required.num": string;
        };
        remaining: string;
      };
    }
  }
}
