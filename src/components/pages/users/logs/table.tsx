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
  DataBase.Populate.Model<
    DataBase.WithId<DataBase.Models.Subscriptions>,
    "planId" | "adminId" | "trainerId"
  >[]
>;
export default function FullLogsInfoGenerator({
  id,
  perPage,
  headKeys,
}: Props) {
  const [page, setPage] = useState(0);

  const query = useQuery({
    queryKey: ["logs", "users", id, page],
    queryFn: async () => {
      const request = await requester.get<S>(`/api/admin/users/${id}/logs`, {
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
      const request = await requester.get<
        Routes.ResponseSuccess<DataBase.Queries.Logs.LogsCount>
      >(`/api/admin/users/${id}/logs/count`);
      return request.data.data.count;
    },
  });
  if (query.isLoading || queryNum.isLoading) return null;
  if (query.isError) return <p>{JSON.stringify(query.error)}</p>;
  if (queryNum.isError) return <p>{JSON.stringify(query.error)}</p>;
  return (
    <LogInfoGenerator
      perPage={perPage}
      headKeys={headKeys}
      page={page}
      onDelete={async (elem) => {
        await requester.delete(`/api/admin/logs/${elem.log._id}`);
        const pages = queryClient.getQueriesData<ElemProps[]>([
          "users",
          id,
          "subscriptions",
        ]);
        const doc = elem.log;
        const newPages = pages
          .filter(
            (val) => typeof val[0] == "number" || val[0] instanceof Number
          )
          .reduce((acc, [, cur]) => {
            if (!cur) return acc;
            return [...acc, ...cur];
          }, [] as ElemProps[])
          .filter((val) => val.log._id != doc._id)
          .reduce(
            (acc, cur) => {
              const last = acc.at(-1);
              if (!last) return [[]];
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
          queryNum.data ? queryNum.data - 1 : 0
        );
      }}
      logs={query.data}
      setPage={setPage}
      totalCount={queryNum.data}
    />
  );
}
