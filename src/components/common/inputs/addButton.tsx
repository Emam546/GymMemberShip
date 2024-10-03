import { faAdd, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link, { LinkProps } from "next/link";
import React, { ComponentProps } from "react";
export type Props = {
  label: string;
} & LinkProps;
function Button({ ...props }: LinkProps) {
  return (
    <Link
      className="tw-text-blue-600 tw-font-bold hover:tw-bg-blue-600/10 tw-transition-all tw-w-full tw-py-3 tw-text-start tw-px-4 tw-flex tw-gap-2 tw-items-center"
      {...props}
    />
  );
}
export function GoToButton({ label, ...props }: Props) {
  return (
    <Button {...props}>
      <FontAwesomeIcon icon={faArrowRight} />
      <span>{label}</span>
    </Button>
  );
}
export default function AddButton({ label, ...props }: Props) {
  return (
    <Button {...props}>
      <FontAwesomeIcon icon={faAdd} />
      <span>{label}</span>
    </Button>
  );
}
