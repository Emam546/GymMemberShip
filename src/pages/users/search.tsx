import "@locales/users";
import { BigCard, CardTitle, MainCard } from "@src/components/card";
import ErrorShower from "@src/components/common/error";
import UsersTable from "@src/components/pages/users/table";
import Head from "next/head";
import { useInfiniteQuery } from "@tanstack/react-query";
import requester from "@src/utils/axios";
import TriggerOnVisible from "@src/components/common/triggerOnVisble";
import UsersFilter, { DataType } from "@src/components/pages/users/filter";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const perLoad = 20;
export default function Page() {
  const { t } = useTranslation("/users");
  const [filter, setFilter] = useState<DataType>({ name: "" });
  const QueryInfinity = useInfiniteQuery({
    queryKey: ["users", "infinity", filter],
    queryFn: async ({ pageParam = 0, signal }) => {
      const users = await requester.get<
        Routes.ResponseSuccess<
          DataBase.Populate.Model<
            DataBase.WithId<DataBase.Models.User>,
            "adminId"
          >[]
        >
      >(`/api/admin/users`, {
        params: {
          skip: perLoad * pageParam,
          limit: perLoad,
          name: filter.name ? filter.name : undefined,
        },
        signal,
      });
      return { page: pageParam, data: users.data.data };
    },
    getNextPageParam: (lastPage) => {
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
        <title>{t("title")}</title>
      </Head>
      <BigCard>
        <UsersFilter onData={setFilter} />
        <MainCard>
          <ErrorShower
            loading={QueryInfinity.isLoading}
            error={QueryInfinity.error}
          />
          <CardTitle>{t("Users")}</CardTitle>
          <div>
            {users && (
              <UsersTable
                perPage={users.length}
                page={0}
                totalCount={users.length}
                users={users.map((user, i) => ({
                  order: i,
                  user: { ...user, adminId: user.adminId?._id || "" },
                  admin: user.adminId,
                }))}
                headKeys={[
                  "order",
                  "name",
                  "createdAt",
                  "blocked",
                  "age/tall/weight",
                  "admin",
                  "admin",
                ]}
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
