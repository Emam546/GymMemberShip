import "@locales/users";
import { BigCard, CardTitle, MainCard } from "@src/components/card";
import ErrorShower from "@src/components/common/error";
import Head from "next/head";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import requester from "@src/utils/axios";
import TriggerOnVisible from "@src/components/common/triggerOnVisble";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TimeStartEndSelector, {
  DataType as TimeStartEndSelectorDataType,
} from "@src/components/pages/subscriptions/filter";
import PrintPaymentsQuery from "@src/components/pages/users/queryPayment/print";
import FilterUsersData, {
  DataType as FilterUsersDataType,
} from "@src/components/pages/users/filter/filterUsersData";
import { MessageDataUsers } from "@src/components/pages/whatsapp";
import UsersTable from "@src/components/pages/users/table";
import SelectRangeForm, {
  DataType as SelectRangeFormDataType,
} from "@src/components/pages/subscriptions/filter/selectRange";
type FormData = TimeStartEndSelectorDataType & FilterUsersDataType;
const perLoad = 20;

export default function Page() {
  const curDate = new Date();
  const { t } = useTranslation("/users");
  const [filter, setFilter] = useState<FormData>({
    startAt: new Date(
      curDate.getFullYear(),
      curDate.getMonth() - 8,
      curDate.getDate()
    ),
    endAt: curDate,
  });
  const [{ start, end }, setStartEnd] = useState<SelectRangeFormDataType>({
    end: 0,
    start: 0,
  });
  const QueryInfinity = useInfiniteQuery({
    queryKey: ["users", "infinity", { ...filter, start, end }],
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
          skip: Math.max(0, perLoad * pageParam + start),
          limit: Math.max(
            1,
            Math.min(perLoad, end - (pageParam * perLoad + start))
          ),
          ...filter,
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
  const QueryProfit = useQuery({
    queryKey: ["users", "total", filter],
    queryFn: async ({ signal }) => {
      const users = await requester.get<
        Routes.ResponseSuccess<DataBase.Queries.Users.LogsCount[]>
      >(`/api/admin/users/count`, {
        params: {
          ...filter,
        },
        signal,
      });
      return users.data.data;
    },
  });
  useEffect(() => {
    if (!QueryProfit.data) return;
    const count = QueryProfit.data[0]?.count || 0;
    setStartEnd({ start, end: count });
  }, [QueryProfit.data]);
  const users = QueryInfinity.data?.pages
    .map((page) => page.data)
    .reduce((acc, cur) => [...acc, ...cur], []);

  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
      <Head>
        <title>{"Whatsapp"}</title>
      </Head>
      <BigCard className="tw-min-h-screen">
        <div className="tw-flex tw-justify-between">
          <CardTitle>{t("Users")}</CardTitle>
        </div>
        <MainCard>
          <TimeStartEndSelector
            values={filter}
            onData={(data) => setFilter((pre) => ({ ...pre, ...data }))}
          />
          <div className="tw-mt-5">
            <FilterUsersData
              onData={(data) => setFilter((pre) => ({ ...pre, ...data }))}
            />
          </div>
        </MainCard>
        <MainCard>
          <CardTitle>Whatsapp</CardTitle>
          <MessageDataUsers
            OnUsers={async function () {
              const users = await requester.get<
                Routes.ResponseSuccess<
                  DataBase.Populate.Model<
                    DataBase.WithId<DataBase.Models.User>,
                    "adminId"
                  >[]
                >
              >(`/api/admin/users`, {
                params: {
                  ...filter,
                  skip: Math.max(0, start),
                  limit: Math.max(1, end - start),
                },
              });
              return users.data.data.map((val) => ({
                ...val,
                adminId: val.adminId?._id || "",
              }));
            }}
            buttonName={t("buttons.send", { ns: "translation" })}
          />
          <SelectRangeForm onData={setStartEnd} values={{ start, end }} />
        </MainCard>
        <MainCard>
          <ErrorShower
            loading={QueryInfinity.isLoading}
            error={QueryInfinity.error}
          />
          <CardTitle>{t("Users")}</CardTitle>
          <div>
            <MainCard>
              <ErrorShower
                loading={QueryInfinity.isLoading}
                error={QueryInfinity.error}
              />
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
