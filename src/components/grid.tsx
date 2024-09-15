import classNames from "classnames";
import React from "react";
export type Props = React.HTMLAttributes<HTMLDivElement>;
export function Grid2({ children, className }: Props) {
    return (
        <div
            className={classNames(
                "tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-x-4 tw-gap-y-4",
                className
            )}
        >
            {children}
        </div>
    );
}
export function Grid3({ children, className }: Props) {
    return (
        <div
            className={classNames(
                "tw-grid tw-grid-cols-1 md:tw-grid-cols-3  tw-gap-x-4 tw-gap-y-4",
                className
            )}
        >
            {children}
        </div>
    );
}
