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
      <div>
        <div className="mb-0 fw-normal">
          <input
            type="checkbox"
            ref={ref}
            className={classNames(className)}
            {...props}
            id={id}
          />
          <label htmlFor={id} {...labelProps}>
            {label}
          </label>
        </div>
      </div>
    );
  }
);

export default CheckInput;
