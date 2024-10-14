import classNames from "classnames";
import React, {
  ComponentProps,
  ComponentPropsWithRef,
  ComponentRef,
} from "react";
export interface Props extends ComponentPropsWithRef<"input"> {
  id: string;
  label: string;
  labelProps?: ComponentProps<"label">;
}
const CheckInput = React.forwardRef<ComponentRef<"input">, Props>(
  ({ id, label, labelProps, className, ...props }, ref) => {
    return (
      <div className="tw-flex tw-items-center tw-gap-2">
        <input
          type="checkbox"
          ref={ref}
          className={classNames(
            "form-check-input tw-m-0 tw-mr-0 tw-p-0",
            className
          )}
          {...props}
          id={id}
        />
        <label className="form-check-label" htmlFor={id} {...labelProps}>
          {label}
        </label>
      </div>
    );
  }
);

export default CheckInput;
