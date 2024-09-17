import DeleteDialog from "@src/components/common/AlertDialog";
import { formateDate, hasOwnProperty } from "@src/utils";
import { Pagination } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { QueryKey, useMutation, useQuery } from "@tanstack/react-query";
import requester from "@src/utils/axios";
import { DeleteButton } from "@src/components/common/deleteButton";
import queryClient from "@src/queryClient";
import { of } from "ramda";

interface ElemProps {
  order: number;
  payment: Omit<DataBase.WithId<DataBase.Models.Payments>, "userId">;
  user?: DataBase.WithId<DataBase.Models.User>;
  onDelete?: () => any;
}
type HeadKeys = "order" | "user" | "paid" | "createdAt" | "delete";

function UserShower({
  payment,
  user,
  order,
  headKeys,
  onDelete,
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
          <td>
            {user ? (
              <Link href={`/users/${user._id}`} className="tw-block">
                {user.name}
              </Link>
            ) : (
              "Deleted"
            )}
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
                  <E heads={headKeys} val="paid">
                    <TH>Paid</TH>
                  </E>
                  <E heads={headKeys} val="createdAt">
                    <TH>Created At</TH>
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
export interface Props {
  id: string;
  headKeys: HeadKeys[];
  perPage: number;
}
type S = Routes.ResponseSuccess<
  DataBase.WithId<
    DataBase.Populate<
      DataBase.Models.Payments,
      "userId",
      DataBase.WithId<DataBase.Models.User>
    >
  >[]
>;
export default function FullPaymentInfoGenerator({
  id,
  perPage,
  headKeys,
}: Props) {
  const [page, setPage] = useState(0);
  const mutate = useMutation({
    mutationFn(payment: DataBase.WithId<DataBase.Models.Payments>) {
      return requester.delete(`/api/admin/payments/${payment._id}`);
    },
    onSuccess(_, payment) {
      queryClient.getQueryData(["plans", "payments"]);
      const pages = queryClient.getQueriesData<ElemProps[]>([
        "plans",
        "payments",
      ]);
      const newPages = pages
        .filter((val) => typeof val[0] == "number" || val[0] instanceof Number)
        .reduce((acc, [_, cur]) => {
          if (!cur) return acc;
          return [...acc, ...cur];
        }, [] as ElemProps[])
        .filter((val) => val.payment._id != payment._id)
        .reduce(
          (acc, cur) => {
            const last = acc.at(-1)!;
            if (last.length > perPage) return [...acc, [cur]];
            last.push(cur);
            return acc;
          },
          [[]] as ElemProps[][]
        );
      newPages.forEach((data, page) => {
        queryClient.setQueryData(["plans", "payments", page], data);
      });
      queryClient.setQueryData(
        ["plans", "payments", "number"],
        queryNum.data! - 1
      );
    },
  });
  const query = useQuery({
    queryKey: ["plans", "payments", page],
    queryFn: async () => {
      const request = await requester.get<S>(
        `/api/admin/plans/${id}/payments`,
        {
          params: {
            skip: page * perPage,
            limit: perPage,
          },
        }
      );
      return request.data.data.map((doc, i) => {
        return {
          order: page + i + 1,
          payment: doc,
          user: doc.userId,
        } as ElemProps;
      });
    },
  });
  const queryNum = useQuery({
    queryKey: ["plans", "payments", "number"],
    queryFn: async () => {
      const request = await requester.get<Routes.ResponseSuccess<number>>(
        `/api/admin/plans/${id}/payments/count`,
        {
          params: {
            skip: page * perPage,
            limit: perPage,
          },
        }
      );
      return request.data.data;
    },
  });
  if (query.isLoading || queryNum.isLoading) return null;
  if (query.isError) return <p>{JSON.stringify(query.error)}</p>;
  if (queryNum.isError) return <p>{JSON.stringify(query.error)}</p>;
  return (
    <PaymentInfoGenerator
      headKeys={headKeys}
      page={page}
      onDelete={(elem) =>
        mutate.mutateAsync({ ...elem.payment, userId: elem.user!._id })
      }
      payments={query.data}
      setPage={setPage}
      totalUsers={queryNum.data}
    />
  );
}
