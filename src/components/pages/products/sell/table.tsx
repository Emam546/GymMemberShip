import { useTranslation } from "react-i18next";
import { E, TH } from "@src/components/common/table";
import { DeleteButton } from "@src/components/common/deleteButton";
import { PaginationManager } from "@src/components/pagination";
import { TextInput } from "@src/components/common/inputs/Text";
import { useForm } from "react-hook-form";
import { useDebounceEffect } from "@src/hooks";
import { ErrorInputShower } from "@src/components/common/inputs/main";
import { useState } from "react";
export type SellProduct = DataBase.WithId<DataBase.Models.Products> & {
  curNum: number;
};
interface ElemProps {
  order: number;
  product: SellProduct;
  onDelete?: () => void;
  onUpdate: (data: FormData) => void;
}
export interface FormData {
  curNum: number;
}
type HeadKeys =
  | "order"
  | "name"
  | "price"
  | "amount"
  | "perPrice"
  | "curAmount"
  | "delete";
function Shower({
  product,
  order,
  headKeys,
  onDelete,
  onUpdate,
}: ElemProps & { headKeys: HeadKeys[] }) {
  const { register, setValue, getValues, watch, formState } = useForm<FormData>(
    {
      defaultValues: {
        curNum: product.curNum,
      },
    }
  );
  const [state, setState] = useState(false);
  const { t } = useTranslation("table:products:sell");
  useDebounceEffect(
    () => {
      const cur = getValues();
      if (cur.curNum > product.num && !state) {
        if (confirm(t("td.noStock"))) setState(true);
        else setValue("curNum", product.num);
      }
      onUpdate(getValues());
    },
    100,
    [watch("curNum")]
  );
  return (
    <>
      <tr>
        <E val="order" heads={headKeys}>
          <td className="tw-max-w-fit">
            <h6 className="mb-0 fw-semibold">{order + 1}</h6>
          </td>
        </E>
        <E val="name" heads={headKeys}>
          <td className="tw-w-full">{product.name}</td>
        </E>
        <E heads={headKeys} val="curAmount">
          <td className="tw-text-center">
            <TextInput
              type="text"
              {...register("curNum", {
                required: true,
                valueAsNumber: true,
              })}
            />
            <ErrorInputShower err={formState.errors.curNum} />
          </td>
        </E>
        <E heads={headKeys} val="amount">
          <td className="tw-text-center">{product.num}</td>
        </E>
        <E heads={headKeys} val="perPrice">
          <td className="tw-text-center">{product.price}</td>
        </E>
        <E heads={headKeys} val="price">
          <td className="tw-text-center">{watch("curNum") * product.price}</td>
        </E>
        <E val="delete" heads={headKeys}>
          <td>
            <div className="tw-flex tw-justify-center">
              <DeleteButton onClick={() => onDelete?.()} />
            </div>
          </td>
        </E>
      </tr>
    </>
  );
}

export interface Props {
  page: number;
  perPage: number;
  products: Omit<ElemProps, "onUpdate">[];
  totalCount: number;
  setPage?: (page: number) => any;
  headKeys: HeadKeys[];
  onDelete?: (product: ElemProps["product"]) => void;
  onUpdate: (product: ElemProps["product"], data: FormData) => void;
}
export default function SellProductsTable({
  page,
  products,
  totalCount,
  setPage,
  headKeys,
  onDelete,
  perPage,
  onUpdate,
}: Props) {
  const { t } = useTranslation("table:products:sell");
  return (
    <PaginationManager
      page={page}
      perPage={perPage}
      totalCount={totalCount}
      setPage={setPage}
      noElems={t("noData")}
    >
      <div className="table-responsive">
        <table className="table mb-0 align-middle text-nowrap">
          <thead className="text-dark fs-4">
            <tr>
              <E heads={headKeys} val="order">
                <TH>{t("th.id")}</TH>
              </E>
              <E heads={headKeys} val="name">
                <TH>{t("th.name")}</TH>
              </E>
              <E heads={headKeys} val="curAmount">
                <TH>{t("th.curAmount")}</TH>
              </E>
              <E heads={headKeys} val="amount">
                <TH>{t("th.amount")}</TH>
              </E>
              <E heads={headKeys} val="perPrice">
                <TH>{t("th.perPrice")}</TH>
              </E>
              <E heads={headKeys} val="price">
                <TH>{t("th.price")}</TH>
              </E>
              <E heads={headKeys} val="delete">
                <TH>{t("th.delete")}</TH>
              </E>
            </tr>
          </thead>
          <tbody>
            {products.map((doc) => {
              return (
                <Shower
                  {...doc}
                  onDelete={() => {
                    return onDelete?.(doc.product);
                  }}
                  key={doc.product._id}
                  headKeys={headKeys}
                  onUpdate={async (data) => onUpdate(doc.product, data)}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </PaginationManager>
  );
}

declare global {
  namespace I18ResourcesType {
    interface Resources {
      "table:products:sell": {
        td: {
          noStock: string;
        };
        th: {
          id: "Id";
          name: "Name";
          amount: "number";
          curAmount: string;
          price: "price";
          delete: "delete";
          perPrice: number;
        };
        noData: "There is no products so far";
      };
    }
  }
}
