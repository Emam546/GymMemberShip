import { SuccessButton } from "@src/components/button";
import ErrorShower from "@src/components/common/error";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";

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
    mutationFn: fn,
    onError(err) {},
  });
  return (
    <div {...containerProps}>
      <div>
        <SuccessButton
          type="button"
          onClick={(e) => {
            e.preventDefault();
            mutate.mutate();
          }}
          disabled={mutate.isLoading}
          {...buttonProps}
        >
          <FontAwesomeIcon className="tw-mr-1" icon={faPrint} />
          Print
        </SuccessButton>
        <ErrorShower error={mutate.error as Error} />
      </div>
    </div>
  );
}
