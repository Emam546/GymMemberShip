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
}

export default function MoneyPaidProductForm({ onData, totalPrice }: Props) {
  const { handleSubmit, register, formState, setValue, watch, getValues } =
    useForm<FormData>();
  const { t } = useTranslation("subscription:add");

  useEffect(() => {
    setValue("remaining", totalPrice - getValues("paid"));
  }, [watch("paid")]);
  useEffect(() => {
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
          {t("buttons.activate", { ns: "translation" })}
        </PrimaryButton>
      </div>
    </form>
  );
}
