import ErrorShower from "@src/components/common/error";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import requester from "@src/utils/axios";
import { LogInfoGenerator } from "@src/components/pages/logs/table";
import queryClient from "@src/queryClient";
import TriggerOnVisible from "@src/components/common/triggerOnVisble";
const perLoad = 20;
type Page = {
  page: number;
  data: DataBase.Populate<
    DataBase.WithId<DataBase.Models.Logs>,
    "planId",
    DataBase.WithId<DataBase.Models.Plans>
  >[];
};
interface InfiniteQueryData {
  pages: Page[];
  pageParams: unknown[];
}
export interface Props {
  id: string;
}
export default function LogsPaymentInfo({ id }: Props) {
  const mutate = useMutation({
    mutationFn(id: string) {
      return requester.delete(`/api/admin/logs/${id}`);
    },
    onSuccess(_, logId) {
      queryClient.setQueryData<InfiniteQueryData>(
        ["logs", "payments", id, "infinity"],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.filter((item) => item._id !== logId),
            })),
          };
        }
      );
    },
  });
  const QueryInfinity = useInfiniteQuery({
    queryKey: ["logs", "payments", id, "infinity"],
    queryFn: async ({ pageParam = 0, signal }) => {
      const users = await requester.get<
        Routes.ResponseSuccess<DataBase.WithId<DataBase.Models.Logs>[]>
      >(`/api/admin/payments/${id}/logs`, {
        params: {
          skip: perLoad * pageParam,
          limit: perLoad,
        },
        signal,
      });
      return { page: pageParam, data: users.data.data };
    },
    enabled: typeof id == "string",
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length > 0) return lastPage.page + 1;
      return undefined;
    },
  });
  const logs =
    QueryInfinity.data?.pages
      .map((page) => page.data)
      .reduce((acc, cur) => [...acc, ...cur], []) || [];
  return (
    <div>
      <ErrorShower
        loading={QueryInfinity.isLoading}
        error={QueryInfinity.error}
      />
      <LogInfoGenerator
        page={0}
        setPage={() => {}}
        totalCount={logs.length}
        logs={logs.map((log, i) => ({
          order: i,
          log,
        }))}
        headKeys={["order", "delete", "createdAt", "admin"]}
        onDelete={(doc) => mutate.mutateAsync(doc.log._id)}
      />
      <TriggerOnVisible
        onVisible={async () => {
          if (
            !QueryInfinity.isFetching &&
            !QueryInfinity.isLoading &&
            QueryInfinity.hasNextPage
          )
            QueryInfinity.fetchNextPage();
        }}
      />
    </div>
  );
}
