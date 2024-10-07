import ErrorShower from "@src/components/common/error";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import requester from "@src/utils/axios";
import { LogInfoGenerator } from "@src/components/pages/logs/table";
import queryClient from "@src/queryClient";
import TriggerOnVisible from "@src/components/common/triggerOnVisble";
const perLoad = 20;
type Doc = DataBase.Populate.Model<
  DataBase.WithId<DataBase.Models.Logs>,
  "adminId" | "planId" | "userId" | "trainerId"
>;
type Page = {
  page: number;
  data: Doc[];
};
interface InfiniteQueryData {
  pages: Page[];
  pageParams: unknown[];
}
export interface Props {
  id: string;
}

export default function LogsPaymentInfo({ id }: Props) {
  const queryInfinityKey = ["logs", "payments", id, "infinity"];
  const QueryInfinity = useInfiniteQuery({
    queryKey: queryInfinityKey,
    queryFn: async ({ pageParam = 0, signal }) => {
      const users = await requester.get<Routes.ResponseSuccess<Doc[]>>(
        `/api/admin/payments/${id}/logs`,
        {
          params: {
            skip: perLoad * pageParam,
            limit: perLoad,
          },
          signal,
        }
      );
      return { page: pageParam, data: users.data.data };
    },
    enabled: typeof id == "string",
    getNextPageParam: (lastPage) => {
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
        perPage={logs.length}
        page={0}
        totalCount={logs.length}
        logs={logs.map((log, i) => ({
          order: i,
          log: {
            ...log,
            trainerId: log.trainerId?._id || "",
            userId: log.userId?._id || "",
            adminId: log.userId?._id || "",
            planId: log.planId?._id || "",
          },
          admin: log.adminId,
          user: log.userId,
          plan: log.planId,
          trainer: log.trainerId,
        }))}
        headKeys={["order", "delete", "createdAt", "admin", "trainer"]}
        onDelete={async (doc) => {
          await requester.delete(`/api/admin/logs/${doc.log._id}`);
          queryClient.setQueryData<InfiniteQueryData>(
            queryInfinityKey,
            (oldData) => {
              if (!oldData) return oldData;
              return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                  ...page,
                  data: page.data.filter((item) => item._id !== doc.log._id),
                })),
              };
            }
          );
        }}
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
