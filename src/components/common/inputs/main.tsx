import classNames from "classnames";
import React from "react";
import { FieldError } from "react-hook-form";
type Props = {
    id: string;
    title: string;
    desc?: string;
    err?: FieldError;
} & React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
>;
export function ErrorInputShower({
    err,
    className,
    ...props
}: { err?: FieldError } & React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <>
            {err && (
                <p
                    className={classNames("tw-text-red-600 tw-mb-0", className)}
                    {...props}
                >
                    {err.type == "validate" &&
                        err.message == "" &&
                        "Invalid input"}
                    {err.type == "required" &&
                        err.message == "" &&
                        "Required Input please fill the input first"}
                    {err.type == "min" &&
                        err.message == "" &&
                        "The Value of the input is below the minimum"}
                    {err.message != "" && err.message}
                </p>
            )}
        </>
    );
}
const MainInput = React.forwardRef<HTMLInputElement, Props>(function (
    { id, title, desc, err, ...props }: Props,
    ref
) {
    return (
        <div>
            <label
                htmlFor={id}
                className="form-label"
            >
                {title}
            </label>
            <input
                className="form-control"
                id={id}
                {...props}
                ref={ref}
            />
            {desc && <div className="form-text">{desc}</div>}
            <ErrorInputShower err={err} />
        </div>
    );
});
export default MainInput;
