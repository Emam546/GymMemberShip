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
        <div className="mb-0 fw-normal form-check">
          <input
            type="checkbox"
            ref={ref}
            className={classNames("form-check-input", className)}
            {...props}
            id={id}
          />
        </div>
        <label className="form-check-label" htmlFor={id} {...labelProps}>
          {label}
        </label>
      </div>
    );
  }
);

export default CheckInput;
