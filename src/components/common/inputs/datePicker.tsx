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
    <div ref={props.InputProps?.ref} className={"tw-relative"}>
      <input
        disabled={props.disabled}
        className={"form-control"}
        value={formateDate(props.value!.toDate(), "/")}
      />
      <button
        disabled={props.disabled}
        onClick={() => props.setOpen?.(true)}
        type="button"
        className="tw-border-none tw-text-gray-400 disabled:tw-text-gray-100 tw-bg-inherit tw-text-xl tw-absolute tw-left-4 tw-top-1/2 -tw-translate-y-1/2 tw-z-10"
      >
        <FontAwesomeIcon icon={faCalendarDays} />
      </button>
    </div>
  );
}
export default function DatePicker({ value, onChange, ...props }: Props) {
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
