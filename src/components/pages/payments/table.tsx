import DeleteDialog from "@src/components/common/AlertDialog";
import { formateDate } from "@src/utils";
import { Pagination } from "@mui/material";
import Link from "next/link";
import React, { ComponentProps, useState } from "react";
import { DeleteButton } from "@src/components/common/deleteButton";
import { useMutation, useQuery } from "@tanstack/react-query";
import requester from "@src/utils/axios";
import { remainingDays, planToDays } from "@src/utils/payment";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import queryClient from "@src/queryClient";
export interface ElemProps {
  order: number;
  payment: Omit<DataBase.WithId<DataBase.Models.Payments>, "userId" | "planId">;
  user?: DataBase.WithId<DataBase.Models.User>;
  plan?: DataBase.WithId<DataBase.Models.Plans>;
  onDelete?: () => any;
}
export type HeadKeys =
  | "order"
  | "user"
  | "plan"
  | "paid"
  | "createdAt"
  | "delete"
  | "separated"
  | "log"
  | "daysLogged"
  | "addLog"
  | "link";

function ShowLogValues({ payment }: { payment: ElemProps["payment"] }) {
  const query = useQuery({
    queryKey: ["payments", payment._id, "logs"],
    queryFn: async () => {
      const request = await requester.get<
        Routes.ResponseSuccess<DataBase.WithId<DataBase.Models.Logs>[]>
      >(`/api/admin/payments/${payment._id}/logs`);
      return request.data.data;
    },
  });
  if (query.isLoading) return <p>Loading...</p>;
  if (query.isError) return <p>{JSON.stringify(query.error)}</p>;
  const TotalDays = planToDays(payment.plan);
  const rDays = remainingDays(payment, query.data.length);
  return (
    <div>
      <Link href={`/payments/${payment._id}/logs`} className="tw-text-inherit">
        <p className="tw-text-center tw-mb-0">
          <span>{query.data.length}</span>/<span>{rDays}</span>/
          <span>{TotalDays}</span>
        </p>
      </Link>
    </div>
  );
}
function AddLog({
  className,
  payment,
  ...props
}: ComponentProps<"button"> & {
  payment: Omit<DataBase.WithId<DataBase.Models.Payments>, "userId" | "planId">;
}) {
  const mutate = useMutation({
    async mutationFn() {
      const data = await requester.post<
        Routes.ResponseSuccess<DataBase.WithId<DataBase.Models.Logs>>
      >(`/api/admin/payments/${payment._id}/logs`);
      return data.data.data;
    },
    onSuccess(data) {
      queryClient.setQueryData<DataBase.WithId<DataBase.Models.Logs>[]>(
        ["payments", payment._id, "logs"],
        (old) => {
          return [...old!, data];
        }
      );
      alert("Log Added successfully");
    },
  });
  return (
    <button
      disabled={mutate.isLoading}
      onClick={() => mutate.mutate()}
      {...props}
      className={classNames(
        "tw-border-none focus-within:tw-outline-none tw-bg-blue-500 tw-text-blue-100 tw-w-5 tw-h-5 tw-flex tw-items-center tw-justify-center tw-rounded tw-leading-[0]",
        className
      )}
    >
      <FontAwesomeIcon fontSize="1rem" icon={faPlus} />
    </button>
  );
}
function Separated({
  className,
  payment,
  ...props
}: ComponentProps<"input"> & {
  payment: Omit<DataBase.WithId<DataBase.Models.Payments>, "userId" | "planId">;
}) {
  const [blocked, setBlocked] = useState(false);
  const mutate = useMutation({
    async mutationFn(state: boolean) {
      const data = await requester.post(`/api/admin/payments/${payment._id}`, {
        separated: state,
      });
      return data.data.data;
    },
    onSuccess(_, val) {
      setBlocked(val);
      alert("Value Changed successfully");
    },
  });
  return (
    <input
      {...props}
      type="checkbox"
      checked={blocked}
      className="tw-mr-1"
      onChange={(e) => {
        mutate.mutate(!blocked);
      }}
      disabled={mutate.isLoading}
    />
  );
}
function UserShower({
  payment,
  user,
  order,
  headKeys,
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
        <E val="link" heads={headKeys}>
          <td>
            <Link href={`/payments/${payment._id}`}>Link</Link>
          </td>
        </E>
        <E val="paid" heads={headKeys}>
          <td>{`${payment.paid.num} ${payment.paid.type}`}</td>
        </E>
        <E val="createdAt" heads={headKeys}>
          <td>
            <p className="mb-0 fw-normal">
              {formateDate(new Date(payment.createdAt))}
            </p>
          </td>
        </E>
        <E val="log" heads={headKeys}>
          <td>
            <ShowLogValues payment={payment} />
          </td>
        </E>
        <E val="separated" heads={headKeys}>
          <td>
            <div className="tw-flex tw-justify-center">
              <Separated payment={payment} />
            </div>
          </td>
        </E>
        <E val="addLog" heads={headKeys}>
          <td className="tw-flex tw-justify-center">
            <div className="tw-flex tw-justify-center">
              <AddLog payment={payment} />
            </div>
          </td>
        </E>
        <td>
          <DeleteButton onClick={() => setOpen(true)} />
        </td>
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
  payments: ElemProps[];
  totalUsers: number;
  setPage: (page: number) => any;
  headKeys: HeadKeys[];
  onDelete: (payment: ElemProps) => any;
}
export function PaymentInfoGenerator({
  page,
  payments,
  totalUsers: totalPayments,
  setPage,
  headKeys,
}: PaymentProps) {
  const pageNum = Math.ceil(totalPayments / payments.length);
  return (
    <div>
      {totalPayments > 0 && (
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
                  <E heads={headKeys} val="link">
                    <TH>Link</TH>
                  </E>
                  <E heads={headKeys} val="paid">
                    <TH>Paid</TH>
                  </E>
                  <E heads={headKeys} val="createdAt">
                    <TH>Created At</TH>
                  </E>

                  <E heads={headKeys} val="log">
                    <TH className="tw-text-center">A/R/T</TH>
                  </E>
                  <E heads={headKeys} val="separated">
                    <TH>Separated</TH>
                  </E>
                  <E heads={headKeys} val="addLog">
                    <TH>Attend</TH>
                  </E>
                  <E heads={headKeys} val="delete">
                    <TH>Delete</TH>
                  </E>
                </tr>
              </thead>
              <tbody>
                {payments.map((doc) => {
                  return (
                    <UserShower
                      {...doc}
                      key={doc.payment._id}
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
      {totalPayments == 0 && (
        <p className="tw-mb-0">There is no payments so far</p>
      )}
    </div>
  );
}
