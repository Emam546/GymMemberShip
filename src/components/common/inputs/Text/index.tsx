import classNames from "classnames";
import React from "react";
import { ComponentProps, ComponentRef } from "react";

export const TextInput = React.forwardRef<
  ComponentRef<"input">,
  ComponentProps<"input">
>(({ className, ...props }, ref) => {
  return (
    <input
      className={classNames(
        "tw-p-0 tw-m-0 tw-border-none focus:tw-outline focus:tw-outline-2 focus:tw-outline-gray-600 tw-rounded",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
