import PrimaryButton from "@src/components/button";
import { Grid2 } from "@src/components/grid";
import MainInput from "@src/components/common/inputs/main";
import TextArea from "@src/components/common/inputs/textArea";
import { useForm } from "react-hook-form";
import React from "react";
import { ObjectEntries } from "@src/utils";
import { useTranslation } from "react-i18next";
import i18n from "@src/i18n";
import PhoneNumberWithForm from "@src/components/common/inputs/phone";

export interface DataType {
  blocked?: boolean;
  name?: string;
  age?: number;
  tall?: number;
  weight?: number;
  sex?: "male" | "female";
  phone?: string;
  details: {
    whyDidYouCame?: string;
  };
}
export interface Props {
  defaultData?: DefaultData;
  onData: (data: DataType) => Promise<any> | any;
  buttonName: React.ReactNode;
}
export type DefaultData = DataType;
export default function UserInfoForm({
  defaultData,
  buttonName,
  onData,
}: Props) {
  const { register, handleSubmit, formState, control } = useForm<DataType>({
    values: defaultData,
  });
  const { t } = useTranslation("form:user");
  register("details", { value: {} });
  return (
    <form
      onSubmit={handleSubmit((data: any) => {
        ObjectEntries(data).forEach(([key, val]) => {
          if (typeof val == "number" && isNaN(val)) delete data[key];
        });
        return onData(data);
      })}
      autoComplete="off"
    >
      <Grid2>
        <MainInput
          id={"name-input"}
          title={t("User Name")}
          {...register("name")}
          err={formState.errors.name}
        />
        <PhoneNumberWithForm
          id={"phone-input"}
          title={t("Phone")}
          control={control}
          name="phone"
          err={formState.errors.name}
        />
      </Grid2>
      <Grid2 className="tw-mt-3">
        <MainInput
          id={"age-input"}
          title={t("Age")}
          {...register("age", {
            valueAsNumber: true,
          })}
          err={formState.errors.age}
        />
        <MainInput
          id={"tall-input"}
          title={t("Tall in centimeter")}
          {...register("tall", {
            valueAsNumber: true,
          })}
          err={formState.errors.tall}
        />
        <MainInput
          id={"weight-input"}
          title={t("Weight in Kg")}
          {...register("weight", {
            valueAsNumber: true,
          })}
          err={formState.errors.weight}
        />
      </Grid2>
      <div className="tw-mt-4">
        <TextArea
          id={"desc-input"}
          title={t("Why did you come")}
          {...register("details.whyDidYouCame")}
          className="tw-min-h-[10rem]"
          err={formState.errors.details?.whyDidYouCame}
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
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "form:user": {
        "User Name": "User Name";
        Phone: "Phone";
        Age: "Age";
        "Tall in centimeter": "Tall in centimeter";
        "Weight in Kg": "Weight in Kg";
        "Why did you come": "Why did you come";
      };
    }
  }
}
i18n.addLoadUrl("/components/users/form", "form:user");
