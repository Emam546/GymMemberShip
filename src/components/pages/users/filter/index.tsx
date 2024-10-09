
import { Grid2 } from "@src/components/grid";
import { useForm } from "react-hook-form";
import { ObjectEntries } from "@src/utils";
import { useDebounceEffect } from "@src/hooks";
import { StyledInput } from "@src/components/common/inputs/styles";
import { useTranslation } from "react-i18next";

export interface DataType {
  name?: string;
  phone?: string;
}
export interface Props {
  onData: (data: DataType) => Promise<any> | any;
}
export type DefaultData = DataType;
export default function UsersFilter({ onData }: Props) {
  const { t } = useTranslation("filter:users");
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
          placeholder={t("name.placeholder")}
          {...register("name")}
        />
      </Grid2>
    </form>
  );
}
import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "filter:users": {
        "name.placeholder": "Search By Name";
      };
    }
  }
}
i18n.addLoadUrl("/components/users/filter", "filter:users");
