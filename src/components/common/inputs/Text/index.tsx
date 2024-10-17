import classNames from "classnames";
import React, { ComponentPropsWithoutRef, useState } from "react";
import { ComponentRef } from "react";
export const OrgText = React.forwardRef<
  ComponentRef<"input">,
  ComponentPropsWithoutRef<"input">
>(({ className, onChange, ...props }, ref) => {
  const [textValue, setState] = useState(props.value);
  return (
    <div
      className="tw-w-fit tw-relative tw-min-w-[3rem] tw-bg-red-700 tw-p-0 after:tw-content-[attr(data-value)] after:tw-invisible tw-h-5"
      data-value={textValue}
    >
      <input
        className={classNames(
          "tw-absolute tw-top-0 tw-left-0 tw-h-full  tw-w-full",
          className
        )}
        onChange={(e) => {
          onChange?.(e);
          setState(e.currentTarget.value);
        }}
        ref={ref}
        {...props}
      />
    </div>
  );
});
export const TextInput = React.forwardRef<
  ComponentRef<"input">,
  ComponentPropsWithoutRef<"input">
>(({ className, ...props }, ref) => {
  return (
    <OrgText
      className={classNames(
        "tw-p-0 tw-m-0 tw-border-none ltr:tw-pr-3 rtl:tw-pl-3 focus:tw-outline focus:tw-outline-2 focus:tw-outline-gray-600 tw-w-full",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
