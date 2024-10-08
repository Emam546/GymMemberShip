import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ErrorShower from "@src/components/common/error";
import { ErrorInputShower } from "@src/components/common/inputs/main";
import { StyledInput } from "@src/components/common/inputs/styles";
import requester from "@src/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

interface Props {
  onSetUserId: (id?: string) => void;
}
type Result = DataBase.WithId<
  DataBase.Populate.Model<DataBase.Models.User, "adminId">
>;
interface FormData {
  search: number;
}
export default function BarcodeSearcher({ onSetUserId }: Props) {
  const { formState, handleSubmit, register, reset, setError } =
    useForm<FormData>();
  const getBarcode = useMutation({
    mutationFn(barcode: number) {
      return requester.get<Routes.ResponseSuccess<Result[]>>(
        "/api/admin/users",
        {
          params: { barcode: barcode.toString() },
        }
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
            className="placeholder:tw-text-gray-600 rtl:tw-rounded-l-none ltr:tw-rounded-r-none"
          />
          <ErrorInputShower err={formState.errors.search} />
        </div>
        <div>
          <button
            type="reset"
            onClick={() => {
              onSetUserId(undefined);
              reset();
            }}
            className="tw-bg-red-500 hover:tw-bg-red-600 tw-text-white tw-border-none tw-px-3 tw-self-stretch tw-block tw-h-full ltr:tw-rounded-r-lg rtl:tw-rounded-l-lg"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      </div>
      <ErrorShower error={getBarcode.error} />
    </form>
  );
}
