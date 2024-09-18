import DeleteDialog from "@src/components/common/AlertDialog";
import { formateDate, formateDateClock } from "@src/utils";
import { Pagination } from "@mui/material";
import Link from "next/link";
import React, { ComponentProps, useState } from "react";
import { DeleteButton } from "@src/components/common/deleteButton";
import classNames from "classnames";
export interface ElemProps {
  order: number;
  log: Omit<DataBase.WithId<DataBase.Models.Logs>, "userId" | "planId">;
  user?: DataBase.WithId<DataBase.Models.User>;
  plan?: DataBase.WithId<DataBase.Models.Plans>;
  onDelete?: () => any;
}
export type HeadKeys =
  | "order"
  | "user"
  | "plan"
  | "createdAt"
  | "delete"
  | "paymentLink";
const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert to 12-hour format and handle midnight

  return `${day}-${month} ${hours}:${minutes} ${ampm}`;
};
function Shower({
  user,
  order,
  headKeys,
  log,
  onDelete,
  plan,
}: ElemProps & { headKeys: HeadKeys[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr>
        <E val="order" heads={headKeys}>
          <td>
            <h6 className="mb-0 fw-semibold">{order}</h6>
          </td>
        </E>
        <E val="user" heads={headKeys}>
          <td className="tw-w-full">
            {user ? (
              <Link href={`/users/${user._id}`}>{user.name}</Link>
            ) : (
              "Deleted"
            )}
          </td>
        </E>
        <E val="plan" heads={headKeys}>
          <td className="tw-w-full">
            {plan ? (
              <Link href={`/plans/${plan._id}`}>{plan.name}</Link>
            ) : (
              "Deleted"
            )}
          </td>
        </E>
        <E val="paymentLink" heads={headKeys}>
          <td>
            <Link href={`/payments/${log.paymentId}`}>Link</Link>
          </td>
        </E>
        <E val="createdAt" heads={headKeys}>
          <td>
            <p className="mb-0 fw-normal">
              {formatDate(new Date(log.createdAt))}
            </p>
          </td>
        </E>
        <E val="delete" heads={headKeys}>
          <td>
            <DeleteButton onClick={() => setOpen(true)} />
          </td>
        </E>
      </tr>
      <DeleteDialog
        onAccept={async () => {
          if (onDelete) await onDelete();
          setOpen(false);
        }}
        onClose={function () {
          setOpen(false);
        }}
        open={open}
        data={{
          title: `Block User`,
          desc: `Once you click Block, The payment will be deleted from his history`,
          accept: `Delete Payment`,
          deny: "Keep",
        }}
      />
    </>
  );
}
export function TH({ children, className, ...props }: ComponentProps<"th">) {
  return (
    <th className={classNames("border-bottom-0", className)} {...props}>
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
export interface PaymentProps {
  page: number;
  logs: ElemProps[];
  totalCount: number;
  setPage: (page: number) => any;
  headKeys: HeadKeys[];
  onDelete: (elem: ElemProps) => any;
}
export function LogInfoGenerator({
  page,
  logs,
  totalCount,
  setPage,
  headKeys,
  onDelete,
}: PaymentProps) {
  const pageNum = Math.ceil(totalCount / logs.length);
  return (
    <div>
      {totalCount > 0 && (
        <>
          <div className="table-responsive">
            <table className="table mb-0 align-middle text-nowrap">
              <thead className="text-dark fs-4">
                <tr>
                  <E heads={headKeys} val="order">
                    <TH>Id</TH>
                  </E>
                  <E heads={headKeys} val="user">
                    <TH>User</TH>
                  </E>
                  <E heads={headKeys} val="plan">
                    <TH>Plan</TH>
                  </E>
                  <E heads={headKeys} val="paymentLink">
                    <TH>Payment Link</TH>
                  </E>
                  <E heads={headKeys} val="createdAt">
                    <TH>Loged At</TH>
                  </E>
                  <E heads={headKeys} val="delete">
                    <TH>Delete</TH>
                  </E>
                </tr>
              </thead>
              <tbody>
                {logs.map((doc) => {
                  return (
                    <Shower
                      {...doc}
                      key={doc.log._id}
                      headKeys={headKeys}
                      onDelete={() => {
                        onDelete(doc);
                      }}
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
      {totalCount == 0 && <p className="tw-mb-0">There is no Logs so far</p>}
    </div>
  );
}
