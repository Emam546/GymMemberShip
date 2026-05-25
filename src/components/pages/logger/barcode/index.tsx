import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SuccessButton } from "@src/components/button";
import ErrorShower from "@src/components/common/error";
import { ErrorInputShower } from "@src/components/common/inputs/main";
import { StyledInput } from "@src/components/common/inputs/styles";
import requester from "@src/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

interface Props {
  onSetUserId: (id?: string) => void;
  defaultValue?: number;
}
type Result = DataBase.WithId<
  DataBase.Populate.Model<DataBase.Models.User, "adminId">
>;
interface FormData {
  search: number;
}
export default function BarcodeSearcher({ onSetUserId, defaultValue }: Props) {
  const { formState, handleSubmit, register, setError } = useForm<FormData>({
    defaultValues: { search: defaultValue },
  });
  const getBarcode = useMutation({
    mutationFn(barcode: number) {
      return requester.get<Routes.ResponseSuccess<Result[]>>(
        "/api/admin/users/barcode",
        {
          params: { barcode: barcode.toString() },
        },
      );
    },
  });
  return (
    <form
      action=""
      onSubmit={handleSubmit(async (data) => {
        if (isNaN(data.search))
          return setError("search", {
            message: "The barcode must be a number",
          });
        const res = await getBarcode.mutateAsync(data.search);

        if (res.data.data.length == 0) {
          return setError("search", { message: "the barcode is not exist" });
        }
        onSetUserId(res.data.data[0]._id);
      })}
    >
      <div className="tw-flex tw-justify-center">
        <div className="tw-flex-1">
          <StyledInput
            type="search"
            {...register("search", { valueAsNumber: true })}
            placeholder="Barcode"
            onChange={async (e) => {
              const value = parseInt(e.target.value);
              if (isNaN(value)) return;
              const res = await getBarcode.mutateAsync(value);
              if (res.data.data.length == 0) return onSetUserId(undefined);
              onSetUserId(res.data.data[0]._id);
            }}
            className="placeholder:tw-text-gray-600 rtl:tw-rounded-l-none ltr:tw-rounded-r-none ltr:tw-pr-2.5 rtl:tw-pl-2.5"
          />
        </div>
        <div>
          <SuccessButton
            type="submit"
            className="tw-text-white tw-border-none tw-px-3 tw-self-stretch tw-block tw-h-full tw-rounded-none ltr:tw-rounded-r-lg rtl:tw-rounded-l-lg"
          >
            <FontAwesomeIcon
              className="rtl:tw-rotate-180"
              icon={faArrowRight}
            />
          </SuccessButton>
        </div>
      </div>
      <ErrorInputShower err={formState.errors.search} />
      <ErrorShower error={getBarcode.error} />
    </form>
  );
}
