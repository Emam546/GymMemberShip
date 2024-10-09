import {
  BaseSingleInputFieldProps,
  DatePickerProps,
  DateValidationError,
  FieldSection,
  DatePicker as OrgDatePicker,
  UseDateFieldProps,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Dayjs } from "dayjs";
import React, { useState } from "react";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formateDate } from "@src/utils";
import { useTranslation } from "react-i18next";
import { isNumber } from "@src/utils/types";
import i18n from "@src/i18n";
export type Props = {
  value: Date;
  onChange?: (val: Date) => any;
} & Omit<DatePickerProps<Dayjs>, "value" | "onChange">;
interface ButtonFieldProps
  extends UseDateFieldProps<Dayjs>,
    BaseSingleInputFieldProps<
      Dayjs | null,
      Dayjs,
      FieldSection,
      DateValidationError
    > {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}
function CustomField(props: ButtonFieldProps) {
  return (
    <div ref={props.InputProps?.ref} className={"tw-relative"}>
      <input
        disabled={props.disabled}
        className={"form-control"}
        ref={props.inputRef}
        value={props.value ? formateDate(props.value.toDate()) : undefined}
        {...props.inputProps}
        readOnly
      />
      <button
        disabled={props.disabled}
        onClick={() => props.setOpen?.(true)}
        type="button"
        className="tw-border-none tw-text-gray-500 disabled:tw-text-gray-400 tw-bg-inherit tw-text-xl tw-absolute rtl:tw-left-4 ltr:tw-right-4 tw-top-1/2 -tw-translate-y-1/2 tw-z-10"
      >
        <FontAwesomeIcon icon={faCalendarDays} />
      </button>
    </div>
  );
}
export default function DatePicker({ value, onChange, ...props }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <OrgDatePicker
        value={dayjs(value)}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        slots={{
          field: CustomField,
        }}
        slotProps={{
          field: { setOpen } as any,
          popper: { dir: "ltr" },
        }}
        onChange={(v) => {
          if (!v) return;
          onChange?.(v.toDate());
        }}
        {...props}
      />
    </div>
  );
}
export interface EndDatePickerProps extends Props {
  numberOfDays?: number;
}
export function EndDatePicker({ numberOfDays, ...props }: EndDatePickerProps) {
  const { t } = useTranslation("input:datePicker");
  return (
    <div>
      <DatePicker {...props} />
      {isNumber(numberOfDays) && (
        <p className="tw-m-0">
          {t("endDate.paragraph", {
            val: formateDate(
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate() + numberOfDays
              )
            ),
          })}
        </p>
      )}
    </div>
  );
}
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "input:datePicker": {
        endDate: {
          paragraph: "The Payment should be ended at {{val}}";
        };
      };
    }
  }
}

