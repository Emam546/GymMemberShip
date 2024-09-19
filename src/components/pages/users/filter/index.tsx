import PrimaryButton from "@src/components/button";
import { Grid2 } from "@src/components/grid";
import MainInput from "@src/components/common/inputs/main";
import { useForm } from "react-hook-form";
import React, { useEffect } from "react";
import { ObjectEntries } from "@src/utils";
import { useDebounceEffect } from "@src/hooks";
import { StyledInput } from "@src/components/common/inputs/styles";

export interface DataType {
  name?: string;
  phone?: string;
}
export interface Props {
  onData: (data: DataType) => Promise<any> | any;
}
export type DefaultData = DataType;
export default function UsersFilter({ onData }: Props) {
  const { register, handleSubmit, formState, getValues, watch } =
    useForm<DataType>();
  useDebounceEffect(
    () => {
      onData(getValues());
    },
    1000,
    [watch("name")]
  );
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
        <StyledInput
          type="search"
          id={"name-input"}
          placeholder="Search By Name"
          {...register("name")}
        />
        {/* <MainInput
          id={"phone-input"}
          title={"Phone"}
          {...register("phone")}
          err={formState.errors.name}
        /> */}
      </Grid2>
    </form>
  );
}
