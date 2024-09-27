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
import classNames from "classnames";
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
    <div
      ref={props.InputProps?.ref}
      aria-disabled={props.disabled}
      className={classNames(
        "form-control tw-py-0 hover:tw-border-gray-900 focus-within:tw-border-gray-900",
        "aria-disabled:tw-bg-[#EAEFF4] aria-disabled:hover:tw-border-transparent aria-disabled:tw-cursor-default"
      )}
      style={{
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      <div className="tw-flex tw-items-center tw-h-9">
        <p
          aria-disabled={props.disabled}
          className={classNames(
            "tw-py-2 tw-text-gray-900 tw-m-0 tw-flex-1",
            "aria-disabled:tw-text-gray-800"
          )}
        >
          {formateDate(props.value!.toDate(), "/")}
        </p>
        <button
          disabled={props.disabled}
          onClick={() => props.setOpen?.(true)}
          type="button"
          className="tw-border-none tw-p-2 tw-text-gray-400 tw-bg-inherit tw-text-xl"
        >
          <FontAwesomeIcon icon={faCalendarDays} />
        </button>
      </div>
    </div>
  );
}
export default function DatePicker({
  value,
  onChange,
  ...props
}: Props) {
  const [open, setOpen] = useState(false);
  return (
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
      }}
      onChange={(v) => onChange && onChange((v as Dayjs).toDate())}
      {...props}
    />
  );
}
