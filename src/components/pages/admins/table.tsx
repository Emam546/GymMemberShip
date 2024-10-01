import DeleteDialog from "@src/components/common/AlertDialog";
import { formateDate, hasOwnProperty } from "@src/utils";
import { Pagination } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import requester from "@src/utils/axios";
import CheckInput from "@src/components/common/checkInput";
import { useTranslation } from "react-i18next";
interface ElemProps {
  order: number;
  admin: DataBase.WithId<DataBase.Models.Admins>;
  onDelete?: () => any;
}
type HeadKeys = "order" | "name" | "phone" | "email" | "delete" | "type";

function UserShower({
  admin,
  order,
  headKeys,
  onDelete,
}: ElemProps & { headKeys: HeadKeys[] }) {
  const [open, setOpen] = useState(false);
  const mutate = useMutation({
    async mutationFn(val: boolean) {
      await onDelete?.();
    },
  });
  const { t } = useTranslation("table:admins");
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
            <Link href={`/admins/${admin._id}`} className="tw-block">
              {admin.name}
            </Link>
          </td>
        </E>
        <E heads={headKeys} val="type">
          <td className="tw-text-center">{admin.type}</td>
        </E>
        <E val="phone" heads={headKeys}>
          <td>{admin.phone}</td>
        </E>
        <E val="email" heads={headKeys}>
          <td>{admin.email}</td>
        </E>
        <E val="delete" heads={headKeys}>
          <td className="tw-flex tw-justify-center">
            <DeleteButton onClick={() => setOpen(true)} />
          </td>
        </E>
      </tr>
      <DeleteDialog
        onAccept={async () => {
          await mutate.mutateAsync(true);
          setOpen(false);
        }}
        onClose={function () {
          setOpen(false);
        }}
        open={open}
        data={{
          title: t("td.delete.title"),
          desc: t("td.delete.desc"),
          accept: t("td.delete.accept", { name: admin.name }),
          deny: t("td.delete.deny"),
        }}
      />
    </>
  );
}
export function TH({ children }: { children: string }) {
  return (
    <th className="border-bottom-0">
      <h6 className="mb-0 fw-semibold">{children}</h6>
    </th>
  );
}
function E({
  val,
  heads,
  children,
}: {
  val: HeadKeys;
  heads: HeadKeys[];
  children: React.ReactNode;
}) {
  if (!heads.includes(val)) return null;
  return <>{children}</>;
}
export interface Props {
  page: number;
  admins: ElemProps[];
  totalCount: number;
  setPage: (page: number) => any;
  headKeys: HeadKeys[];
  onDelete?: (admin: ElemProps["admin"]) => void;
}
export default function AdminsTable({
  page,
  admins,
  totalCount,
  setPage,
  headKeys,
  onDelete,
}: Props) {
  const { t } = useTranslation("table:admins");
  const pageNum = Math.ceil(totalCount / admins.length);
  return (
    <div>
      {totalCount > 0 && (
        <>
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
                  <E heads={headKeys} val="type">
                    <TH>{t("th.type")}</TH>
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
                {admins.map((doc) => {
                  return (
                    <UserShower
                      {...doc}
                      onDelete={() => {
                        return onDelete?.(doc.admin);
                      }}
                      key={doc.admin._id}
                      headKeys={headKeys}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
          {pageNum > 1 && (
            <div className="tw-mt-2">
              <Pagination
                onChange={(e, value) => {
                  setPage(value - 1);
                }}
                page={page + 1}
                count={pageNum}
              />
            </div>
          )}
        </>
      )}
      {totalCount == 0 && <p className="tw-mb-0">{t("noData")}</p>}
    </div>
  );
}
import i18n from "@src/i18n";
import { DeleteButton } from "@src/components/common/deleteButton";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "table:admins": {
        td: {
          Deleted: "Deleted";
          "block.label": "block";
          delete: {
            title: "Delete User";
            desc: "Once you click Delete, The user will be blocked form the database and he will have no more access on the server";
            accept: "Delete {{name}}";
            deny: "Keep";
          };
        };
        th: {
          id: "Id";
          name: "Name";
          phone: "Phone";
          email: "email";
          delete: "delete";
          type: "Type";
        };
        noData: "There is no admins so far";
      };
    }
  }
}
i18n.addLoadUrl("/components/admins/table", "table:admins");
