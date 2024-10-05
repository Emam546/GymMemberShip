import { SuccessButton } from "@src/components/button";
import ErrorShower from "@src/components/common/error";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export function PrintButton<T>({
  fn,
  containerProps,
  buttonProps,
}: {
  fn: () => Promise<T>;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}) {
  const mutate = useMutation({
    mutationFn: fn
  });
  const { t } = useTranslation("translation");
  return (
    <div {...containerProps}>
      <div>
        <SuccessButton
          type="button"
          onClick={(e) => {
            e.preventDefault();
            mutate.mutate();
          }}
          className="tw-flex tw-items-center tw-gap-1"
          disabled={mutate.isLoading}
          {...buttonProps}
        >
          <FontAwesomeIcon icon={faPrint} />
          <span>{t("buttons.print")}</span>
        </SuccessButton>
        <ErrorShower error={mutate.error as Error} />
      </div>
    </div>
  );
}
