import "./locales";
import PrimaryButton from "@src/components/button";
import { Grid2 } from "@src/components/grid";
import MainInput from "@src/components/common/inputs/main";
import TextArea from "@src/components/common/inputs/textArea";
import { FieldError, useForm } from "react-hook-form";
import React from "react";
import BudgetInput from "@src/components/common/inputs/budget";
import { useTranslation } from "react-i18next";

export interface DataType {
  name: string;
  prices: Partial<Record<DataBase.PlansType, DataBase.Price>>;
  details: {
    desc?: string;
  };
}
export interface Props {
  defaultData?: DefaultData;
  onData: (data: DataType) => Promise<any> | any;
  buttonName: React.ReactNode;
} 
export type DefaultData = DataType;
export default function PlanInfoForm({
  defaultData,
  buttonName,
  onData,
}: Props) {
  const { register, handleSubmit, formState } = useForm<DataType>({
    values: defaultData,
  });
  const { t } = useTranslation("form:add:plan");
  return (
    <form onSubmit={handleSubmit(onData)} autoComplete="off">
      <Grid2>
        <MainInput
          id={"name-input"}
          title={t("Plan Name")}
          {...register("name")}
          err={formState.errors.name}
        />
      </Grid2>
      <Grid2 className="tw-mt-3">
        <BudgetInput
          label={t("Day Price")}
          priceProps={{
            ...register("prices.day.num", {
              required: "Please set the price or set it to 0",
              valueAsNumber: true,
              min: 0,
            }),
            placeholder: "eg.120",
            type: "number",
          }}
          unitProps={{
            ...register("prices.day.type", {
              required: "Please select a currency",
              value: "EGP",
            }),
          }}
          err={
            (formState.errors.prices?.day?.num ||
              formState.errors.prices?.day?.type) as FieldError
          }
        />
        <BudgetInput
          label={t("Month Price")}
          priceProps={{
            ...register("prices.month.num", {
              required: t("errors.price"),
              valueAsNumber: true,
              min: 0,
            }),
            placeholder: "eg.120",
            type: "number",
          }}
          unitProps={{
            ...register("prices.month.type", {
              required: t("errors.currency"),
              value: "EGP",
            }),
          }}
          err={
            (formState.errors.prices?.month?.num ||
              formState.errors.prices?.month?.type) as FieldError
          }
        />

        <BudgetInput
          label={t("Year Price")}
          priceProps={{
            ...register("prices.year.num", {
              required: t("errors.price"),
              valueAsNumber: true,
              min: 0,
            }),
            placeholder: "eg.120",
            type: "number",
          }}
          unitProps={{
            ...register("prices.year.type", {
              required: t("errors.currency"),
              value: "EGP",
            }),
          }}
          err={
            (formState.errors.prices?.year?.num ||
              formState.errors.prices?.year?.type) as FieldError
          }
        />
      </Grid2>
      <div className="tw-mt-4">
        <TextArea
          id={"desc-input"}
          title={t("Plan description")}
          {...register("details.desc", { value: "" })}
          className="tw-min-h-[10rem]"
          err={formState.errors.details?.desc}
        />
      </div>
      <div className="tw-mt-4 tw-flex tw-justify-end">
        <PrimaryButton type="submit" disabled={formState.isSubmitting}>
          {buttonName}
        </PrimaryButton>
      </div>
    </form>
  );
}
