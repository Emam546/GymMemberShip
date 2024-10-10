import PrimaryButton from "@src/components/button";
import { Grid2 } from "@src/components/grid";
import MainInput from "@src/components/common/inputs/main";
import { useForm } from "react-hook-form";
import React from "react";
import { ObjectEntries } from "@src/utils";
import { useTranslation } from "react-i18next";
import SelectInput from "@src/components/common/inputs/select";
export interface DataType {
  name: string;
  price: number;
  num: number;
}
export interface Props {
  defaultData?: DefaultData;
  onData: (data: DataType) => Promise<any> | any;
  buttonName: React.ReactNode;
}
export type DefaultData = DataType;
export default function ProductInfoForm({
  defaultData,
  buttonName,
  onData,
}: Props) {
  const { register, handleSubmit, formState, reset } = useForm<DataType>({
    values: defaultData,
  });
  const { t } = useTranslation("form:product");
  return (
    <form
      onSubmit={handleSubmit(async (data: any) => {
        ObjectEntries(data).forEach(([key, val]) => {
          if (typeof val == "number" && isNaN(val)) delete data[key];
          if (!val) delete data[key];
        });
        await onData(data);
        reset();
      })}
      autoComplete="off"
    >
      <Grid2>
        <MainInput
          id={"name-input"}
          title={t("name")}
          {...register("name", { required: true })}
          err={formState.errors.name}
        />
        <MainInput
          id={"price-input"}
          title={t("price")}
          {...register("price", { required: true, valueAsNumber: true })}
          err={formState.errors.price}
        />
        <MainInput
          id={"price-input"}
          title={t("num")}
          {...register("num", {
            required: true,
            valueAsNumber: true,
            min: 0,
            value: 1,
          })}
          err={formState.errors.num}
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
      "form:product": {
        name: string;
        num: number;
        price: number;
      };
    }
  }
}
