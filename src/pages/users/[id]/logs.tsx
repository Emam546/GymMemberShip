import { BigCard, MainCard } from "@src/components/card";
import ErrorShower from "@src/components/common/error";
import UsersTable from "@src/components/pages/users/table";
import Head from "next/head";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import requester from "@src/utils/axios";
import { useRouter } from "next/router";
import { LogInfoGenerator } from "@src/components/pages/logs/table";
import queryClient from "@src/queryClient";
import TriggerOnVisible from "@src/components/common/triggerOnVisble";
import { last } from "ramda";
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
export default function Page() {
  const router = useRouter();
  const { id } = router.query;
  const mutate = useMutation({
    mutationFn(id: string) {
      return requester.delete(`/api/admin/logs/${id}`);
    },
    onSuccess(_, logId) {
      queryClient.setQueryData<InfiniteQueryData>(
        ["logs", "users", id, "infinity"],
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
    queryKey: ["logs", "users", id, "infinity"],
    queryFn: async ({ pageParam = 0, signal }) => {
      const users = await requester.get<
        Routes.ResponseSuccess<
          DataBase.Populate<
            DataBase.WithId<DataBase.Models.Logs>,
            "planId",
            DataBase.WithId<DataBase.Models.Plans>
          >[]
        >
      >(`/api/admin/user/${id}/logs`, {
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
    <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
      <Head>
        <title>Logs</title>
      </Head>
      <BigCard>
        <MainCard className="p-4 tw-mt-3">
          <ErrorShower
            loading={QueryInfinity.isLoading}
            error={QueryInfinity.error}
          />
          <h5 className="mb-4 card-title fw-semibold">User Logs</h5>

          <div>
            <LogInfoGenerator
              page={0}
              setPage={() => {}}
              totalCount={logs.length}
              logs={logs.map((log, i) => ({
                order: i,
                log,
                plan: log.planId,
              }))}
              headKeys={["order", "delete", "paymentLink", "plan", "createdAt"]}
              onDelete={(doc) => mutate.mutateAsync(doc.log._id)}
            />
          </div>
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
        </MainCard>
      </BigCard>
    </div>
  );
}
