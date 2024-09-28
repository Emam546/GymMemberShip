import queryClient from "@src/queryClient";
import requester from "@src/utils/axios";
import { QueryKey, useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  HeadKeys,
  PaymentInfoGenerator,
  ElemProps,
} from "../../payments/table";

export interface Props {
  id: string;
  headKeys: HeadKeys[];
  perPage: number;
}
type S = Routes.ResponseSuccess<
  DataBase.WithId<
    DataBase.Populate<
      DataBase.Models.Payments,
      "planId",
      DataBase.WithId<DataBase.Models.User>
    >
  >[]
>;
function isQueryPayment(
  val: QueryKey
): val is ["payments", "users", string, number] {
  return (
    val[0] == "payments" &&
    val[1] == "users" &&
    typeof val[3] == "number" &&
    val.length == 4
  );
}
export default function FullPaymentInfoGenerator({
  id,
  perPage,
  headKeys,
}: Props) {
  const [page, setPage] = useState(0);
  const mutate = useMutation({
    mutationFn(payment: ElemProps["payment"]) {
      return requester.delete(`/api/admin/payments/${payment._id}`);
    },
    onSuccess(_, payment) {
      const pages = queryClient.getQueriesData<ElemProps[]>([
        "payments",
        "users",
        id,
      ]);
      const newPages = pages
        .filter(([key]) => isQueryPayment(key))
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
        queryClient.setQueryData(["payments", "users", id, page], data);
      });
      queryClient.setQueryData(
        ["payments", "users", id, "count"],
        Math.max(0, queryNum.data! - 1)
      );
    },
  });
  const query = useQuery({
    queryKey: ["payments", "users", id, page],
    queryFn: async () => {
      const request = await requester.get<S>(
        `/api/admin/users/${id}/payments`,
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
          plan: doc.planId,
        } as unknown as ElemProps;
      });
    },
  });
  const queryNum = useQuery({
    queryKey: ["payments", "users", id, "count"],
    queryFn: async () => {
      const request = await requester.get<
        Routes.ResponseSuccess<DataBase.Queries.Payments.Profit[]>
      >(`/api/admin/users/${id}/payments/profit`);
      return request.data.data[0].paymentCount;
    },
  });
  if (query.isLoading || queryNum.isLoading) return null;
  if (query.isError) return <p>{JSON.stringify(query.error)}</p>;
  if (queryNum.isError) return <p>{JSON.stringify(query.error)}</p>;
  return (
    <PaymentInfoGenerator
      headKeys={headKeys}
      page={page}
      onDelete={(elem) => mutate.mutateAsync(elem.payment)}
      payments={query.data}
      setPage={setPage}
      totalCount={queryNum.data}
    />
  );
}
