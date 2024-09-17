import DeleteDialog from "@src/components/common/AlertDialog";
import { formateDate, hasOwnProperty } from "@src/utils";
import { Pagination } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import requester from "@src/utils/axios";

interface ElemProps {
  order: number;
  user: DataBase.WithId<DataBase.Models.User>;
  lastPlan?: DataBase.WithId<DataBase.Models.Plans>;
}
type HeadKeys =
  | "order"
  | "name"
  | "plan"
  | "age/tall/weight"
  | "createdAt"
  | "blocked";

function UserShower({
  user,
  lastPlan,
  order,
  headKeys,
}: ElemProps & { headKeys: HeadKeys[] }) {
  const [blocked, setBlocked] = useState(new Boolean(user.blocked).valueOf());
  const [open, setOpen] = useState(false);
  const mutate = useMutation({
    async mutationFn(val: boolean) {
      const state = new Boolean(val).valueOf();
      await requester.post(`/api/admin/user/${user._id}`, {
        blocked: state,
      });
    },
    onSuccess(_, val) {
      setBlocked(val);
    },
  });
  return (
    <>
      <tr>
        <E val="order" heads={headKeys}>
          <td className="tw-max-w-fit">
            <h6 className="mb-0 fw-semibold">{order}</h6>
          </td>
        </E>
        <E val="name" heads={headKeys}>
          <td className="tw-w-full">
            <Link href={`/users/${user._id}`} className="tw-block">
              {user.name}
            </Link>
          </td>
        </E>
        <E val="age/tall/weight" heads={headKeys}>
          <td>{`${user.weight}KG,${user.tall}CM,${user.age}Year`}</td>
        </E>
        <E val="plan" heads={headKeys}>
          <td>
            <p className="mb-0 fw-normal">{lastPlan?.name || "Deleted"}</p>
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
            <div className="mb-0 tw-flex tw-items-center fw-normal">
              <input
                type="checkbox"
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
              <label id={`block-${user._id}`}>block</label>
            </div>
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
          title: `Block User`,
          desc: `Once you click Block, The user will be blocked form the courses and he will have no more access on teh server`,
          accept: `Block ${user.name}`,
          deny: "Keep",
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
                    <TH>Id</TH>
                  </E>
                  <E heads={headKeys} val="name">
                    <TH>Name</TH>
                  </E>
                  <E heads={headKeys} val="age/tall/weight">
                    <TH>Age/Tall/Weight</TH>
                  </E>
                  <E heads={headKeys} val="plan">
                    <TH>Plan</TH>
                  </E>
                  <E heads={headKeys} val="createdAt">
                    <TH>Created At</TH>
                  </E>
                  <E heads={headKeys} val="blocked">
                    <TH>Blocked</TH>
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
                  setPage(value);
                }}
                page={page}
                count={pageNum}
              />
            </div>
          )}
        </>
      )}
      {totalUsers == 0 && <p className="tw-mb-0">There is no users so far</p>}
    </div>
  );
}
