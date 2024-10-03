import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { ComponentProps } from "react";

export function DeleteButton({
  className,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={classNames(
        "hover:tw-text-red-600 disabled:tw-text-neutral-600 tw-border-0 tw-bg-transparent tw-block tw-text-gray-100 tw-w-fit tw-mx-auto",
        className
      )}
      aria-label="delete"
      {...props}
    >
      <FontAwesomeIcon icon={faTrashCan} />
    </button>
  );
}
