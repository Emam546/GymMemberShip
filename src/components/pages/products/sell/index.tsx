import PrimaryButton, { SuccessButton } from "@src/components/button";
import { Grid2 } from "@src/components/grid";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import SelectInput from "@src/components/common/inputs/select";

export interface FormData {
  productId: string;
}

export interface Props {
  products: DataBase.WithId<DataBase.Models.Products>[];
  onData: (data: FormData) => any;
}

export default function AddProduct({ onData, products }: Props) {
  const { handleSubmit, register, formState, setValue, watch } =
    useForm<FormData>();
  const { t } = useTranslation("subscription:add");

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        await onData(data);
      })}
      autoComplete="off"
    >
      <Grid2>
        <div>
          <SelectInput
            id={"plan-input"}
            title={t("Choose Course")}
            err={formState.errors.productId}
            {...register("productId", { required: true })}
          >
            {products.map((val) => {
              return (
                <option key={val._id} value={val._id}>
                  {val.name}
                </option>
              );
            })}
          </SelectInput>
        </div>
        <div className="tw-flex tw-justify-end tw-items-end tw-mt-5">
          <SuccessButton type="submit">
            {t("buttons.add", { ns: "translation" })}
          </SuccessButton>
        </div>
      </Grid2>
    </form>
  );
}
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "subscription:add": {
        "Choose Course": "Choose Course";
        payment: {
          endAt: "This payment should be end at {{val}}";
        };
        paid: {
          label: "The amount paid";
          required: {
            currency: "Please select a currency";
            num: "Please set the course price or set it to 0";
          };
          paragraph: "The amount to be paid is {{val}}";
          placeholder: "eg.120";
        };
        startAt: string;
        endAt: string;
        remaining: string;
        trainer: {
          label: "Trainer";
          default: "Choose Trainer";
        };
      };
    }
  }
}
