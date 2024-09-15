import React from "react";
import { ErrorInputShower } from "./main";
import { FieldError } from "react-hook-form";
export type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    err?: FieldError;
};
const RadioInput = React.forwardRef<HTMLInputElement, Props>(
    ({ id, title, err, ...props }, ref) => {
        return (
            <>
                <div className="form-check">
                    <input
                        type="radio"
                        className="form-check-input"
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
export default RadioInput;
