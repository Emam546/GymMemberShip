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
  user: DataBase.WithId<DataBase.Models.User>;
  admin?: DataBase.WithId<DataBase.Models.Admins>;
  lastPlan?: DataBase.WithId<DataBase.Models.Plans>;
}
type HeadKeys =
  | "order"
  | "name"
  | "plan"
  | "age/tall/weight"
  | "createdAt"
  | "blocked"
  | "admin";

function UserShower({
  user,
  admin,
  lastPlan,
  order,
  headKeys,
}: ElemProps & { headKeys: HeadKeys[] }) {
  const [blocked, setBlocked] = useState(new Boolean(user.blocked).valueOf());
  const [open, setOpen] = useState(false);
  const mutate = useMutation({
    async mutationFn(val: boolean) {
      const state = new Boolean(val).valueOf();
      await requester.post(`/api/admin/users/${user._id}`, {
        blocked: state,
      });
    },
    onSuccess(_, val) {
      setBlocked(val);
    },
  });
  const { t } = useTranslation("table:users");
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
            <Link href={`/users/${user._id}`} className="tw-block">
              {user.name}
            </Link>
          </td>
        </E>
        <E val="admin" heads={headKeys}>
          <td className="tw-w-full">
            {admin ? (
              <Link href={`/admins/${admin._id}`} className="tw-block">
                {admin.name}
              </Link>
            ) : (
              t("td.Deleted")
            )}
          </td>
        </E>
        <E val="age/tall/weight" heads={headKeys}>
          <td>
            <span>{`${user.weight || 0}KG`}</span>,
            <span>{`${user.tall || 0}CM`}</span>,
            <span>{`${user.age || 0}Year`}</span>
          </td>
        </E>
        <E val="plan" heads={headKeys}>
          <td>
            <p className="mb-0 fw-normal">
              {lastPlan?.name || t("td.Deleted")}
            </p>
          </td>
        </E>
        <E val="createdAt" heads={headKeys}>
          <td>
            <p className="mb-0 fw-normal">
              {formateDate(new Date(user.createdAt))}
            </p>
          </td>
        </E>
        <E val="blocked" heads={headKeys}>
          <td>
            <CheckInput
              label={t("td.block.label")}
              checked={blocked}
              className="tw-mr-1"
              onChange={async (e) => {
                if (blocked) {
                  mutate.mutate(false);
                } else {
                  setOpen(true);
                }
              }}
              disabled={mutate.isLoading}
              id={`block-${user._id}`}
            />
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
          accept: t("td.delete.accept", { name: user.name }),
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
  users: ElemProps[];
  totalUsers: number;
  setPage: (page: number) => any;
  headKeys: HeadKeys[];
}
export default function UsersTable({
  page,
  users,
  totalUsers,
  setPage,
  headKeys,
}: Props) {
  const { t } = useTranslation("table:users");
  const pageNum = Math.ceil(totalUsers / users.length);
  return (
    <div>
      {totalUsers > 0 && (
        <>
          <div className="table-responsive">
            <table className="table mb-0 align-middle text-nowrap">
              <thead className="text-dark fs-4">
                <tr>
                  <E heads={headKeys} val="order">
                    <TH>{t("th.Id")}</TH>
                  </E>
                  <E heads={headKeys} val="name">
                    <TH>{t("th.Name")}</TH>
                  </E>
                  <E heads={headKeys} val="admin">
                    <TH>{t("th.admin")}</TH>
                  </E>
                  <E heads={headKeys} val="age/tall/weight">
                    <TH>{t("th.Age/Tall/Weight")}</TH>
                  </E>
                  <E heads={headKeys} val="plan">
                    <TH>{t("th.Plan")}</TH>
                  </E>
                  <E heads={headKeys} val="createdAt">
                    <TH>{t("th.Created At")}</TH>
                  </E>
                  <E heads={headKeys} val="blocked">
                    <TH>{t("th.Blocked")}</TH>
                  </E>
                </tr>
              </thead>
              <tbody>
                {users.map((doc) => {
                  return (
                    <UserShower
                      {...doc}
                      key={doc.user._id}
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
      {totalUsers == 0 && (
        <p className="tw-mb-0">{t("There is no users so far")}</p>
      )}
    </div>
  );
}
import i18n from "@src/i18n";
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "table:users": {
        td: {
          Deleted: "Deleted";
          "block.label": "block";
          delete: {
            title: "Block User";
            desc: "Once you click Block, The user will be blocked form the courses and he will have no more access on teh server";
            accept: "Block {{name}}";
            deny: "Keep";
          };
        };
        th: {
          Id: "Id";
          Name: "Name";
          "Age/Tall/Weight": "Age/Tall/Weight";
          Plan: "Plan";
          "Created At": "Created At";
          Blocked: "Blocked";
          admin: string;
        };
        "There is no users so far": "There is no users so far";
      };
    }
  }
}
i18n.addLoadUrl("/components/users/table", "table:users");
