import { faAdd, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link, { LinkProps } from "next/link";
import React, { ComponentProps } from "react";
import classNames from "classnames";
export type Props = {
  label: string;
};
function Button({ ...props }: LinkProps) {
  return (
    <Link
      className="tw-text-blue-600 tw-font-bold hover:tw-bg-blue-600/10 tw-transition-all tw-w-full tw-py-3 tw-text-start tw-px-4 tw-flex tw-gap-2 tw-items-center"
      {...props}
    />
  );
}
export function GoToButton({ label, ...props }: Props & LinkProps) {
  return (
    <Button {...props}>
      <FontAwesomeIcon className="tw-rotate-180" icon={faArrowRight} />
      <span>{label}</span>
    </Button>
  );
}
export default function GoToAddButton({ label, ...props }: Props & LinkProps) {
  return (
    <Link
      {...props}
      className="tw-text-blue-600 tw-font-bold hover:tw-bg-blue-600/10 tw-transition-all tw-w-full tw-py-3 tw-text-start tw-px-4 tw-flex tw-gap-2 tw-items-center"
    >
      <FontAwesomeIcon icon={faAdd} />
      <span>{label}</span>
    </Link>
  );
}
export function AddButton({
  label,
  ...props
}: Props & ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={classNames(
        "tw-border-none tw-bg-inherit",
        "tw-text-blue-600 tw-font-bold hover:tw-bg-blue-600/10 tw-transition-all tw-w-full tw-py-3 tw-text-start tw-px-4 tw-flex tw-gap-2 tw-items-center"
      )}
    >
      <FontAwesomeIcon icon={faAdd} />
      <span>{label}</span>
    </button>
  );
}
