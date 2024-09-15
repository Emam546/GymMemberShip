import classNames from "classnames";
import React from "react";

export default function PrimaryButton({
    className,
    ...props
}: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>) {
    return (
        <button
            className={classNames("btn btn-primary", className)}
            {...props}
        />
    );
}
export const UploadFileButton = React.forwardRef<
    HTMLInputElement,
    React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    >
>(({ className, children, ...props }, ref) => {
    return (
        <>
            <label
                htmlFor={props.id}
                className={classNames("btn btn-primary", className)}
            >
                {children}
            </label>
            <input
                type="file"
                className="tw-appearance-none tw-invisible tw-absolute"
                {...props}
            />
        </>
    );
});

export function SuccessButton({
    className,
    ...props
}: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>) {
    return (
        <button
            className={classNames("btn btn-success", className)}
            {...props}
        />
    );
}
export function DangerButton({
    className,
    ...props
}: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>) {
    return (
        <button
            className={classNames("btn btn-danger", className)}
            {...props}
        />
    );
}
