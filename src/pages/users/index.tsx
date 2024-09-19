import { BigCard, CardTitle, MainCard } from "@src/components/card";
import ErrorShower from "@src/components/common/error";
import UsersTable from "@src/components/pages/users/table";
import Head from "next/head";
import { useInfiniteQuery } from "@tanstack/react-query";
import requester from "@src/utils/axios";
import TriggerOnVisible from "@src/components/common/triggerOnVisble";
import UsersFilter, { DataType } from "@src/components/pages/users/filter";
import { useState } from "react";
const perLoad = 20;
export default function Page() {
  const [filter, setFilter] = useState<DataType>({});
  const QueryInfinity = useInfiniteQuery({
    queryKey: ["users", "infinity", filter],
    queryFn: async ({ pageParam = 0, signal }) => {
      const users = await requester.get<
        Routes.ResponseSuccess<DataBase.WithId<DataBase.Models.User>[]>
      >(`/api/admin/user`, {
        params: {
          skip: perLoad * pageParam,
          limit: perLoad,
          name: filter.name ? filter.name : undefined,
        },
        signal,
      });
      return { page: pageParam, data: users.data.data };
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length > 0) return lastPage.page + 1;
      return undefined;
    },
  });
  const users = QueryInfinity.data?.pages
    .map((page) => page.data)
    .reduce((acc, cur) => [...acc, ...cur], []);
  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
      <Head>
        <title>Users</title>
      </Head>
      <BigCard>
        <UsersFilter onData={setFilter} />
        <MainCard className="p-4 tw-mt-3">
          <ErrorShower
            loading={QueryInfinity.isLoading}
            error={QueryInfinity.error}
          />
          <CardTitle>Students</CardTitle>
          <div>
            {users && (
              <UsersTable
                page={0}
                setPage={() => {}}
                totalUsers={users.length}
                users={users.map((user, i) => ({
                  order: i,
                  user: user,
                }))}
                headKeys={["order", "name", "createdAt", "blocked"]}
              />
            )}
          </div>
          <TriggerOnVisible
            onVisible={async () => {
              if (!QueryInfinity.isFetching && QueryInfinity.hasNextPage)
                QueryInfinity.fetchNextPage();
            }}
          />
        </MainCard>
      </BigCard>
    </div>
  );
}
