import { Grid2 } from "@src/components/grid";
import { useForm } from "react-hook-form";
import { useDebounceEffect } from "@src/hooks";

import i18n from "@src/i18n";
import { useTranslation } from "react-i18next";
import CheckInput from "@src/components/common/checkInput";
export interface DataType {
  active?: boolean;
  remaining?: true;
}
interface FormValues extends DataType {
  applyActive: boolean;
}
export interface Props {
  onData: (data: DataType) => Promise<any> | any;
  values?: DataType;
  disableActive?: boolean;
}
export type DefaultData = DataType;
export default function PaymentsDataFilter({
  onData,
  values,
  disableActive,
}: Props) {
  const { register, getValues, watch } = useForm<FormValues>({
    defaultValues: {
      applyActive: true,
    },
  });
  const { t } = useTranslation("subscription:data:form");
  useDebounceEffect(
    () => {
      const data = getValues();
      onData({
        active: data.applyActive ? data.active : undefined,
        remaining: data.remaining || undefined,
      });
    },
    1000,
    [JSON.stringify(watch())]
  );
  return (
    <div>
      {!disableActive && (
        <div className="tw-flex tw-gap-4">
          <CheckInput
            label={t("applyActive")}
            id={"apply-active"}
            defaultChecked
            {...register("applyActive")}
          />
          <CheckInput
            label={t("isActive")}
            id={"is-active"}
            disabled={!watch("applyActive")}
            defaultChecked
            {...register("active")}
          />
        </div>
      )}

      <CheckInput
        {...register("remaining")}
        label={t("hasRemaining")}
        id={"has-money"}
      />
    </div>
  );
}
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "subscription:data:form": {
        applyActive: string;
        isActive: string;
        hasRemaining: string;
      };
    }
  }
}
