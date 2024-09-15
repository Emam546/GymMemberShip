import { faAdd, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link, { LinkProps } from "next/link";
import React from "react";
export type Props = {
    label: string;
} & LinkProps;
export function GoToButton({ label, ...props }: Props) {
    return (
        <Link
            className="tw-text-blue-600 tw-font-bold hover:tw-bg-blue-100 tw-transition-all tw-block tw-w-full tw-py-3 tw-text-start tw-px-4 tw-space-x-2"
            {...props}
        >
            <FontAwesomeIcon icon={faArrowRight} />
            <span>{label}</span>
        </Link>
    );
}
export default function AddButton({ label, ...props }: Props) {
    return (
        <Link
            className="tw-text-blue-600 tw-font-bold hover:tw-bg-blue-100 tw-transition-all tw-block tw-w-full tw-py-3 tw-text-start tw-px-4 tw-space-x-2"
            {...props}
        >
            <FontAwesomeIcon icon={faAdd} />
            <span>{label}</span>
        </Link>
    );
}
