import { BigCard, MainCard } from "@src/components/card";
import ErrorShower from "@src/components/common/error";
import UsersTable from "@src/components/pages/users/table";
import Head from "next/head";
import { useInfiniteQuery } from "@tanstack/react-query";
import requester from "@src/utils/axios";
const perLoad = 20;
export default function Page() {
  const QueryInfinity = useInfiniteQuery({
    queryKey: ["users", "infinity", {}],
    queryFn: async ({ pageParam = 0, signal }) => {
      const users = await requester.get<
        Routes.ResponseSuccess<DataBase.WithId<DataBase.Models.User>[]>
      >(`/api/admin/user`, {
        params: {
          skip: perLoad * pageParam,
          limit: perLoad,
        },
        signal,
      });
      return { page: pageParam, data: users.data.data };
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length) return lastPage.page + 1;
      return null;
    },
  });
  const users =
    QueryInfinity.data?.pages
      .map((page) => page.data)
      .reduce((acc, cur) => [...acc, ...cur], []) || [];
  console.log(users);
  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
      <Head>
        <title>Users</title>
      </Head>
      <BigCard>
        <MainCard className="p-4 tw-mt-3">
          <ErrorShower
            loading={QueryInfinity.isLoading}
            error={QueryInfinity.error}
          />
          <h5 className="mb-4 card-title fw-semibold">Students</h5>
          {
            <div>
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
            </div>
          }
        </MainCard>
      </BigCard>
    </div>
  );
}
