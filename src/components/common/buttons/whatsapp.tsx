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
  return (
    <div {...containerProps}>
      <WhatsappButtonStyle
        type="button"
        onClick={(e) => {
          e.preventDefault();
          mutate.mutate();
        }}
        className="tw-flex tw-items-center tw-gap-1"
        disabled={mutate.isLoading}
        {...props}
      >
        {children}
      </WhatsappButtonStyle>
      <ErrorShower error={mutate.error as Error} />
    </div>
  );
}
export function WhatsappButtonStyle({
  children,
  ...props
}: ComponentProps<"button">) {
  const { t } = useTranslation("translation");
  return (
    <SuccessButton className="tw-flex tw-items-center tw-gap-1" {...props}>
      <FontAwesomeIcon icon={faWhatsapp as any} />
      {children ? children : <span>{t("buttons.send")}</span>}
    </SuccessButton>
  );
}
