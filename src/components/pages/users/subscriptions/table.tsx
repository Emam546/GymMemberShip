import queryClient from "@src/queryClient";
import requester from "@src/utils/axios";
import { QueryKey, useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  HeadKeys,
  PaymentInfoGenerator,
  ElemProps,
} from "../../subscriptions/table";
import subscriptions from "@serv/models/subscriptions";

export interface Props {
  id: string;
  headKeys: HeadKeys[];
  perPage: number;
}
type S = Routes.ResponseSuccess<
  DataBase.Populate.Model<
    DataBase.WithId<DataBase.Models.Subscriptions>,
    "planId" | "adminId" | "trainerId"
  >[]
>;
function isQueryPayment(
  val: QueryKey
): val is ["subscriptions", "users", string, number] {
  return (
    val[0] == "subscriptions" &&
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
    mutationFn(payment: ElemProps["subscription"]) {
      return requester.delete(`/api/admin/subscriptions/${payment._id}`);
    },
    onSuccess(_, payment) {
      const pages = queryClient.getQueriesData<ElemProps[]>([
        "subscriptions",
        "users",
        id,
      ]);
      const newPages = pages
        .filter(([key]) => isQueryPayment(key))
        .reduce((acc, [_, cur]) => {
          if (!cur) return acc;
          return [...acc, ...cur];
        }, [] as ElemProps[])
        .filter((val) => val.subscription._id != payment._id)
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
        queryClient.setQueryData(["subscriptions", "users", id, page], data);
      });
      queryClient.setQueryData(
        ["subscriptions", "users", id, "count"],
        Math.max(0, queryNum.data! - 1)
      );
    },
  });
  const query = useQuery({
    queryKey: ["subscriptions", "users", id, page],
    queryFn: async () => {
      const request = await requester.get<S>(
        `/api/admin/users/${id}/subscriptions`,
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
          subscription: doc,
          plan: doc.planId,
          admin: doc.adminId,
        } as ElemProps;
      });
    },
  });
  const queryNum = useQuery({
    queryKey: ["subscriptions", "users", id, "count"],
    queryFn: async () => {
      const request = await requester.get<
        Routes.ResponseSuccess<DataBase.Queries.Payments.Profit[]>
      >(`/api/admin/users/${id}/subscriptions/profit`);
      return request.data.data[0]?.paymentCount || 0;
    },
  });
  if (query.isLoading || queryNum.isLoading) return null;
  if (query.isError) return <p>{JSON.stringify(query.error)}</p>;
  if (queryNum.isError) return <p>{JSON.stringify(query.error)}</p>;
  return (
    <PaymentInfoGenerator
      perPage={perPage}
      headKeys={headKeys}
      page={page}
      onDelete={(elem) => mutate.mutateAsync(elem.subscription)}
      subscriptions={query.data}
      setPage={setPage}
      totalCount={queryNum.data}
    />
  );
}
