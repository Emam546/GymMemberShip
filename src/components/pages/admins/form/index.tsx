import PrimaryButton from "@src/components/button";
import { Grid2 } from "@src/components/grid";
import MainInput from "@src/components/common/inputs/main";
import { useForm } from "react-hook-form";
import React from "react";
import { ObjectEntries } from "@src/utils";
import { useTranslation } from "react-i18next";
import i18n from "@src/i18n";
import SelectInput from "@src/components/common/inputs/select";
import PhoneNumberWithForm from "@src/components/common/inputs/phone";
export interface DataType {
  name: string;
  password: string;
  phone?: string;
  email?: string;
  type: "assistant" | "admin";
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
  const { register, handleSubmit, formState, control, reset } =
    useForm<DataType>({
      values: defaultData,
    });
  const { t } = useTranslation("form:admin");
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
          id={"name-input"}
          title={t("password")}
          {...register("password", { required: true })}
          err={formState.errors.password}
        />
        <PhoneNumberWithForm
          id={"phone-input"}
          title={t("phone")}
          control={control}
          name="phone"
          err={formState.errors.phone}
        />
        <MainInput
          id={"age-input"}
          title={t("email")}
          {...register("email")}
          err={formState.errors.email}
        />
        <SelectInput title={t("type")} id="type-input" {...register("type")}>
          <option value="admin">Admin</option>
          <option value="assistant">User</option>
        </SelectInput>
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
        type: "Type";
      };
    }
  }
}
