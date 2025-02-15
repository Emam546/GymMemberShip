import classNames from "classnames";
import React, {
  ComponentProps,
  ComponentPropsWithRef,
  ComponentRef,
} from "react";
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export const StyledInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={classNames(
          "form-control placeholder:tw-text-gray-300",
          className
        )}
        {...props}
        ref={ref}
      />
    );
  }
);
export const FileInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={classNames(
          "form-control placeholder:tw-text-gray-300",
          className
        )}
        type="file"
        id="formFileMultiple"
        {...props}
        ref={ref}
      />
    );
  }
);
export type SelectedInputProps = ComponentPropsWithRef<"select">;

export const StyledSelect = React.forwardRef<
  ComponentRef<"select">,
  ComponentProps<"select">
>(({ className, ...props }, ref) => {
  return (
    <select
      className={classNames("form-select", className)}
      ref={ref}
      {...props}
    />
  );
});

export interface WrapProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  label?: string | React.ReactNode;
}
export const WrapElem = React.forwardRef<HTMLDivElement, WrapProps>(
  ({ label, children, ...props }, ref) => {
    if (!label) return <>{children}</>;
    return (
      <div ref={ref} {...props}>
        <span className="form-label tw-block">{label}</span>
        {children}
      </div>
    );
  }
);
