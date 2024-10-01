import PrimaryButton from "@src/components/button";
import { Grid2 } from "@src/components/grid";
import MainInput from "@src/components/common/inputs/main";
import { useForm } from "react-hook-form";
import React from "react";
import { ObjectEntries } from "@src/utils";
import { useTranslation } from "react-i18next";
import i18n from "@src/i18n";

export interface DataType {
  name: string;
  password: string;
  phone?: string;
  email?: string;
}
export interface Props {
  defaultData?: DefaultData;
  onData: (data: DataType) => Promise<any> | any;
  buttonName: React.ReactNode;
}
export type DefaultData = DataType;
export default function AdminInfoForm({
  defaultData,
  buttonName,
  onData,
}: Props) {
  const { register, handleSubmit, formState } = useForm<DataType>({
    values: defaultData,
  });
  const { t } = useTranslation("form:admin");
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
          title={t("name")}
          {...register("name")}
          err={formState.errors.name}
        />
        <MainInput
          id={"name-input"}
          title={t("password")}
          {...register("password")}
          err={formState.errors.name}
        />
        <MainInput
          id={"phone-input"}
          title={t("phone")}
          {...register("phone")}
          err={formState.errors.name}
        />
        <MainInput
          id={"age-input"}
          title={t("email")}
          {...register("email", {
            valueAsNumber: true,
          })}
          err={formState.errors.email}
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
      "form:admin": {
        name: "Name";
        phone: "Phone";
        email: "Email";
        password: "password";
      };
    }
  }
}
i18n.addLoadUrl("/components/admins/form", "form:admin");
