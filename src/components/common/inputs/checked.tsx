import React from "react";
import { ErrorInputShower } from "./main";
import { FieldError } from "react-hook-form";
export type StyledCheckProps = React.InputHTMLAttributes<HTMLInputElement> & {
    type?: "checkbox" | "radio";
};
export type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    err?: FieldError;
};
export const StyledCheckedInput = React.forwardRef<
    HTMLInputElement,
    StyledCheckProps
>(({ type, ...props }, ref) => {
    return (
        <>
            <input
                type={type || "checkbox"}
                className="form-check-input"
                ref={ref}
                {...props}
            />
        </>
    );
});
const CheckedInput = React.forwardRef<HTMLInputElement, Props>(
    ({ id, title, err, type, ...props }, ref) => {
        return (
            <>
                <div className="form-check">
                    <StyledCheckedInput
                        type="checkbox"
                        id={id}
                        ref={ref}
                        {...props}
                    />
                    <label
                        className="form-check-label"
                        htmlFor={id}
                    >
                        {title}
                    </label>
                </div>
                <ErrorInputShower err={err} />
            </>
        );
    }
);
export const RadioInput = React.forwardRef<HTMLInputElement, Props>(
    ({ id, title, err, type, ...props }, ref) => {
        return (
            <>
                <div className="form-check">
                    <StyledCheckedInput
                        type="radio"
                        id={id}
                        ref={ref}
                        {...props}
                    />
                    <label
                        className="form-check-label"
                        htmlFor={id}
                    >
                        {title}
                    </label>
                </div>
                <ErrorInputShower err={err} />
            </>
        );
    }
);
export default CheckedInput;
