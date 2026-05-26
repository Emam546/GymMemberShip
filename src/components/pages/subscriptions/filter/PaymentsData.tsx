import { useForm } from "react-hook-form";
import { useDebounceEffect } from "@src/hooks";

import { useTranslation } from "react-i18next";
import CheckInput from "@src/components/common/checkInput";
export interface DataType {
  active?: boolean;
  remaining: boolean;
  applyActive?: boolean;
}
type FormValues = DataType;
export interface Props {
  onData: (data: DataType) => Promise<unknown> | unknown;
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
    values,
  });
  const { t } = useTranslation("subscription:data:form");
  useDebounceEffect(
    () => {
      console.log("update");
      const data = getValues();
      onData({
        ...data,
      });
    },
    1000,
    [watch("applyActive"), watch("active")],
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
