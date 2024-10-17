import classNames from "classnames";
import React, { useState } from "react";
import { ComponentProps, ComponentRef } from "react";

export const TextInput = React.forwardRef<
  ComponentRef<"input">,
  ComponentProps<"input">
>(({ className, onChange, ...props }, ref) => {
  const [textValue, setState] = useState(props.value);
  return (
    <div
      className="tw-w-fit tw-relative tw-min-w-[3rem] tw-bg-red-700 tw-p-0 after:tw-content-[attr(data-value)] after:tw-invisible"
      data-value={textValue}
    >
      <input
        className={classNames(
          "tw-p-0 tw-m-0 tw-border-none ltr:tw-pr-3 rtl:tw-pl-3 focus:tw-outline focus:tw-outline-2 focus:tw-outline-gray-600 tw-rounded tw-w-full",
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
