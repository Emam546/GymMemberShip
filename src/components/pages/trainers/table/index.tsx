import DeleteDialog from "@src/components/common/AlertDialog";
import Link from "next/link";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { E, TH } from "@src/components/common/table";
interface ElemProps {
  order: number;
  trainer: DataBase.WithId<DataBase.Models.Trainers>;
  onDelete?: () => void;
}
type HeadKeys = "order" | "name" | "phone" | "email" | "delete";

function UserShower({
  trainer,
  order,
  headKeys,
  onDelete,
}: ElemProps & { headKeys: HeadKeys[] }) {
  const [open, setOpen] = useState(false);
  const mutate = useMutation({
    async mutationFn() {
      await onDelete?.();
    },
  });
  const { t } = useTranslation("table:trainers");
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
            <Link href={`/trainers/${trainer._id}`} className="tw-block">
              {trainer.name}
            </Link>
          </td>
        </E>
        <E val="email" heads={headKeys}>
          <td>{trainer.email}</td>
        </E>
        <E val="phone" heads={headKeys}>
          <td>{trainer.phone}</td>
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
          accept: t("td.delete.accept", { name: trainer.name }),
          deny: t("td.delete.deny"),
        }}
      />
    </>
  );
}

export interface Props {
  page: number;
  perPage: number;
  trainers: ElemProps[];
  totalCount: number;
  setPage: (page: number) => void;
  headKeys: HeadKeys[];
  onDelete?: (admin: ElemProps["trainer"]) => void;
}
export default function TrainersTable({
  page,
  trainers: trainers,
  totalCount,
  setPage,
  headKeys,
  onDelete,
  perPage,
}: Props) {
  const { t } = useTranslation("table:trainers");
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
              <E heads={headKeys} val="email">
                <TH>{t("th.email")}</TH>
              </E>
              <E heads={headKeys} val="phone">
                <TH>{t("th.phone")}</TH>
              </E>
              <E heads={headKeys} val="delete">
                <TH>{t("th.delete")}</TH>
              </E>
            </tr>
          </thead>
          <tbody>
            {trainers.map((doc) => {
              return (
                <UserShower
                  {...doc}
                  onDelete={() => {
                    return onDelete?.(doc.trainer);
                  }}
                  key={doc.trainer._id}
                  headKeys={headKeys}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </PaginationManager>
  );
}
import i18n from "@src/i18n";
import { DeleteButton } from "@src/components/common/deleteButton";
import { PaginationManager } from "@src/components/pagination";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "table:trainers": {
        td: {
          Deleted: "Deleted";
          "block.label": "block";
          delete: {
            title: "Delete User";
            desc: "Once you click Delete, The user will be deleted form the database";
            accept: "Delete {{name}}";
            deny: "Keep";
          };
        };
        th: {
          id: "Id";
          name: "Name";
          phone: "Phone";
          email: "email";
          delete: string;
        };
        noData: "There is no trainers so far";
      };
    }
  }
}
i18n.addLoadUrl("/components/trainers/table", "table:trainers");
