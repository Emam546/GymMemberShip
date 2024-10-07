import { SuccessButton } from "@src/components/button";
import ErrorShower from "@src/components/common/error";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ComponentProps } from "react";

export function WhatsappButton<T>({
  fn,
  children,
  containerProps,
  ...props
}: ComponentProps<"button"> & {
  fn: () => Promise<T>;
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
        onClick={(e) => {
          e.preventDefault();
          mutate.mutate();
        }}
        className="tw-flex tw-items-center tw-gap-1"
        disabled={mutate.isLoading}
        {...props}
      >
        <FontAwesomeIcon icon={faWhatsapp} />
        {children ? children : <span>{t("buttons.send")}</span>}
      </SuccessButton>
      <ErrorShower error={mutate.error as Error} />
    </div>
  );
}
