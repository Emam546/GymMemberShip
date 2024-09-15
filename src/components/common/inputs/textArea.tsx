import classNames from "classnames";
import React from "react";
import { ErrorInputShower } from "./main";
import { FieldError } from "react-hook-form";
type Props = {
    id: string;
    title: string;
    desc?: string;
    err?: FieldError;
} & React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
>;
const TextArea = React.forwardRef<HTMLTextAreaElement, Props>(
    ({ id, className, title, desc, err, ...props }, ref) => {
        return (
            <div>
                <label
                    htmlFor={id}
                    className="form-label"
                >
                    {title}
                </label>
                <textarea
                    className={classNames("form-control", className)}
                    id={id}
                    {...props}
                    ref={ref}
                    style={{
                        minHeight: "8rem",
                    }}
                />
                <ErrorInputShower err={err} />
                {desc && <div className="form-text">{desc}</div>}
            </div>
        );
    }
);

export default TextArea;
