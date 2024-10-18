import PrimaryButton from "@src/components/button";
import { Grid2 } from "@src/components/grid";
import MainInput from "@src/components/common/inputs/main";
import TextArea from "@src/components/common/inputs/textArea";
import { FieldError, useForm } from "react-hook-form";
import React from "react";
import BudgetInput from "@src/components/common/inputs/budget";
import { useTranslation } from "react-i18next";

export interface DataType {
  title: string;
}
export interface Props {
  defaultData?: DefaultData;
  onData: (data: DataType) => Promise<any> | any;
  buttonName: React.ReactNode;
}
export type DefaultData = DataType;
export default function WorkOutInfoForm({
  defaultData,
  buttonName,
  onData,
}: Props) {
  const { register, handleSubmit, formState } = useForm<DataType>({
    values: defaultData,
  });
  const { t } = useTranslation("form:info:workout");
  return (
    <form onSubmit={handleSubmit(onData)} autoComplete="off">
      <Grid2>
        <MainInput
          id={"name-input"}
          title={t("title")}
          {...register("title")}
          err={formState.errors.title}
        />
      </Grid2>
      <div className="tw-mt-4 tw-flex tw-justify-end">
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
      "form:info:workout": {
        title: string;
      };
    }
  }
}
