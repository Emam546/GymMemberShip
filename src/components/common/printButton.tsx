import { SuccessButton } from "@src/components/button";
import ErrorShower from "@src/components/common/error";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ComponentProps } from "react";

export function PrintButton<T>({
  fn,
  children,
  containerProps,
  ...props
}: ComponentProps<"button"> & {
  fn: () => Promise<T>;
  children?: React.ReactNode;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  const mutate = useMutation({
    mutationFn: fn,
  });
  const { t } = useTranslation("translation");
  return (
    <div {...containerProps}>
      <SuccessButton
        type="button"
        onClick={() => {
          mutate.mutate();
        }}
        className="tw-flex tw-items-center tw-gap-1"
        disabled={mutate.isLoading}
        {...props}
      >
        <FontAwesomeIcon icon={faPrint} />
        {children ? children : <span>{t("buttons.print")}</span>}
      </SuccessButton>
      <ErrorShower error={mutate.error as Error} />
    </div>
  );
}
