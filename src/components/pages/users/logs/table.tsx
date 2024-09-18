import queryClient from "@src/queryClient";
import requester from "@src/utils/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { HeadKeys, LogInfoGenerator, ElemProps } from "../../logs/table";

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
export default function FullLogsInfoGenerator({
  id,
  perPage,
  headKeys,
}: Props) {
  const [page, setPage] = useState(0);
  const mutate = useMutation({
    mutationFn(payment: ElemProps["log"]) {
      return requester.delete(`/api/admin/logs/${payment._id}`);
    },
    onSuccess(_, doc) {
      const pages = queryClient.getQueriesData<ElemProps[]>([
        "users",
        id,
        "payments",
      ]);
      const newPages = pages
        .filter((val) => typeof val[0] == "number" || val[0] instanceof Number)
        .reduce((acc, [_, cur]) => {
          if (!cur) return acc;
          return [...acc, ...cur];
        }, [] as ElemProps[])
        .filter((val) => val.log._id != doc._id)
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
        queryClient.setQueryData(["logs", "users", id, page], data);
      });
      queryClient.setQueryData(
        ["logs", "users", id, "number"],
        queryNum.data! - 1
      );
    },
  });
  const query = useQuery({
    queryKey: ["logs", "users", id, page],
    queryFn: async () => {
      const request = await requester.get<S>(`/api/admin/user/${id}/logs`, {
        params: {
          skip: page * perPage,
          limit: perPage,
        },
      });
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
    queryKey: ["logs", "users", id, "number"],
    queryFn: async () => {
      const request = await requester.get<Routes.ResponseSuccess<number>>(
        `/api/admin/user/${id}/logs/count`
      );
      return request.data.data;
    },
  });
  if (query.isLoading || queryNum.isLoading) return null;
  if (query.isError) return <p>{JSON.stringify(query.error)}</p>;
  if (queryNum.isError) return <p>{JSON.stringify(query.error)}</p>;
  return (
    <LogInfoGenerator
      headKeys={headKeys}
      page={page}
      onDelete={(elem) => mutate.mutateAsync(elem.log)}
      logs={query.data}
      setPage={setPage}
      totalCount={queryNum.data}
    />
  );
}
