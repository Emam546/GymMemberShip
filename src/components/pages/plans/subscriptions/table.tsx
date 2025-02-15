import { useState } from "react";
import { QueryKey, useMutation, useQuery } from "@tanstack/react-query";
import requester from "@src/utils/axios";
import queryClient from "@src/queryClient";
import {
  HeadKeys,
  PaymentInfoGenerator,
  ElemProps,
} from "../../subscriptions/table";

export interface Props {
  id: string;
  headKeys: HeadKeys[];
  perPage: number;
}
type S = Routes.ResponseSuccess<
  DataBase.Populate.Model<
    DataBase.WithId<DataBase.Models.Subscriptions>,
    "userId" | "adminId" | "trainerId"
  >[]
>;
function isQueryPayment(
  val: QueryKey
): val is ["subscriptions", "users", string, number] {
  return (
    val[0] == "subscriptions" &&
    val[1] == "plans" &&
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
    async mutationFn(payment: ElemProps["subscription"]) {
      return await requester.delete(`/api/admin/subscriptions/${payment._id}`);
    },
    onSuccess(_, payment) {
      queryClient.getQueryData(["subscriptions", "plans", id]);
      const pages = queryClient.getQueriesData<ElemProps[]>([
        "subscriptions",
        "plans",
        id,
      ]);
      const newPages = pages
        .filter(([val]) => isQueryPayment(val))
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
        queryClient.setQueryData(["subscriptions", "plans", id, page], data);
      });
      queryClient.setQueryData(
        ["subscriptions", "plans", id, "number"],
        Math.max(0, queryNum.data! - 1)
      );
    },
  });
  const query = useQuery({
    queryKey: ["subscriptions", "plans", id, page],
    queryFn: async () => {
      const request = await requester.get<S>(
        `/api/admin/plans/${id}/subscriptions`,
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
          user: doc.userId,
          adminId: doc.adminId,
        } as ElemProps;
      });
    },
  });
  const queryNum = useQuery({
    queryKey: ["subscriptions", "plans", id, "number"],
    queryFn: async () => {
      const request = await requester.get<
        Routes.ResponseSuccess<DataBase.Queries.Payments.Profit[]>
      >(`/api/admin/plans/${id}/subscriptions/profit`);
      return request.data.data[0]?.paymentCount || 0;
    },
  });
  if (query.isLoading || queryNum.isLoading) return null;
  if (query.isError) return <p>{JSON.stringify(query.error)}</p>;
  if (queryNum.isError) return <p>{JSON.stringify(query.error)}</p>;
  console.log(query.data);
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
