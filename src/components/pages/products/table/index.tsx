/* eslint-disable @typescript-eslint/no-namespace */
import DeleteDialog from "@src/components/common/AlertDialog";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { E, TH } from "@src/components/common/table";
import { DeleteButton } from "@src/components/common/deleteButton";
import { PaginationManager } from "@src/components/pagination";
import { TextInput } from "@src/components/common/inputs/Text";
import { useForm } from "react-hook-form";
import { useDebounceEffect } from "@src/hooks";
interface ElemProps {
  order: number;
  product: DataBase.WithId<DataBase.Models.Products>;
  onDelete?: () => void;
  onUpdate: (data: FormData) => void;
}
export interface FormData {
  price: number;
  num: number;
  name: string;
}
type HeadKeys = "order" | "name" | "price" | "amount" | "delete";
function Shower({
  product,
  order,
  headKeys,
  onDelete,
  onUpdate,
}: ElemProps & { headKeys: HeadKeys[] }) {
  const [open, setOpen] = useState(false);
  const mutate = useMutation({
    async mutationFn() {
      await onDelete?.();
    },
  });
  const { register, handleSubmit, getValues, watch } = useForm<FormData>({
    values: {
      name: product.name,
      num: product.num,
      price: product.price,
    },
  });
  const { t } = useTranslation("table:admins");
  useDebounceEffect(
    () => {
      onUpdate(getValues());
    },
    1000,
    [watch("name"), watch("num"), watch("price")]
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
          <td className="tw-w-full">
            <TextInput type="text" {...register("name", { required: true })} />
          </td>
        </E>
        <E heads={headKeys} val="price">
          <td className="tw-text-center">
            <TextInput
              type="text"
              {...register("price", { required: true, valueAsNumber: true })}
            />
          </td>
        </E>
        <E heads={headKeys} val="amount">
          <td className="tw-text-center">
            <TextInput
              type="text"
              {...register("num", { required: true, valueAsNumber: true })}
            />
          </td>
        </E>
        <E val="delete" heads={headKeys}>
          <td>
            <div className="tw-flex tw-justify-center">
              <DeleteButton onClick={() => setOpen(true)} />
            </div>
          </td>
        </E>
      </tr>
      <DeleteDialog
        onAccept={async () => {
          await mutate.mutateAsync();
          setOpen(false);
        }}
        onClose={function () {
          setOpen(false);
        }}
        open={open}
        data={{
          title: t("td.delete.title"),
          desc: t("td.delete.desc"),
          accept: t("td.delete.accept", { name: product.name }),
          deny: t("td.delete.deny"),
        }}
      />
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
export default function ProductsTable({
  page,
  products,
  totalCount,
  setPage,
  headKeys,
  onDelete,
  perPage,
  onUpdate,
}: Props) {
  const { t } = useTranslation("table:products");
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
              <E heads={headKeys} val="amount">
                <TH>{t("th.price")}</TH>
              </E>
              <E heads={headKeys} val="amount">
                <TH>{t("th.amount")}</TH>
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
      "table:products": {
        td: {
          Deleted: "Deleted";
          "block.label": "Delete";
          delete: {
            title: "Delete Product";
            desc: "Once you click Delete, The product will be removed form the database";
            accept: "Delete {{name}}";
            deny: "Keep";
          };
        };
        th: {
          id: "Id";
          name: "Name";
          amount: "number";
          price: "price";
          delete: "delete";
        };
        noData: "There is no products so far";
      };
    }
  }
}
