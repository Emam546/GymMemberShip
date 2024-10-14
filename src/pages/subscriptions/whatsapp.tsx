import { BigCard, CardTitle, MainCard } from "@src/components/card";
import ErrorShower from "@src/components/common/error";
import Head from "next/head";
import { useInfiniteQuery } from "@tanstack/react-query";
import requester from "@src/utils/axios";
import TriggerOnVisible from "@src/components/common/triggerOnVisble";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import TimeStartEndSelector, {
  DataType as TimeStartEndSelectorDataType,
} from "@src/components/pages/subscriptions/filter";
import { PaymentInfoGenerator } from "@src/components/pages/subscriptions/table";
import PrintPaymentsQuery from "@src/components/pages/users/queryPayment/print";
import FilterUsersData, {
  DataType as FilterUsersDataType,
} from "@src/components/pages/users/filter/filterUsersData";
import { MessageDataUsers } from "@src/components/pages/whatsapp";
import PaymentsDataFilter, {
  DataType as PaymentsDataFilterFilter,
} from "@src/components/pages/subscriptions/filter/PaymentsData";
import SelectRangeForm, {
  DataType,
} from "@src/components/pages/subscriptions/filter/selectRange";

type FormData = TimeStartEndSelectorDataType &
  FilterUsersDataType &
  PaymentsDataFilterFilter;
const perLoad = 20;
export default function Page() {
  const curDate = new Date();
  const { t } = useTranslation("/users");
  const [filter, setFilter] = useState<FormData>({
    startAt: new Date(
      curDate.getFullYear(),
      curDate.getMonth(),
      curDate.getDate() - 8
    ),
    endAt: curDate,
    active: true,
  });
  const QueryInfinity = useInfiniteQuery({
    queryKey: ["subscriptions", "query", "infinity", filter],
    queryFn: async ({ pageParam = 0, signal }) => {
      const users = await requester.get<
        Routes.ResponseSuccess<
          DataBase.Populate.Model<
            DataBase.WithId<DataBase.Models.Subscriptions>,
            "adminId" | "userId" | "planId"
          >[]
        >
      >(`/api/admin/subscriptions/query`, {
        params: {
          skip: perLoad * pageParam,
          limit: perLoad,
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
  const payments = QueryInfinity.data?.pages
    .map((page) => page.data)
    .reduce((acc, cur) => [...acc, ...cur], []);
  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
      <Head>
        <title>{"Whatsapp"}</title>
      </Head>
      <BigCard className="tw-min-h-screen">
        <div className="tw-flex tw-justify-between">
          <div>
            <CardTitle>{t("Users")}</CardTitle>
          </div>
          <div>
            <PrintPaymentsQuery
              query={{
                ...filter,
              }}
            />
          </div>
        </div>
        <MainCard>
          <TimeStartEndSelector
            values={filter}
            onData={(data) => setFilter((pre) => ({ ...pre, ...data }))}
          />
          <div>
            <FilterUsersData
              onData={(data) => setFilter((pre) => ({ ...pre, ...data }))}
            />
          </div>
          <div>
            <PaymentsDataFilter
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
                    DataBase.WithId<DataBase.Models.Subscriptions>,
                    "adminId" | "userId" | "planId"
                  >[]
                >
              >(`/api/admin/subscriptions/query`, {
                params: {
                  ...filter,
                },
              });
              return users.data.data
                .map((val) => val.userId)
                .filter(
                  (val) => val != undefined
                ) as DataBase.WithId<DataBase.Models.User>[];
            }}
            buttonName={t("buttons.send", { ns: "translation" })}
          />
          <SelectRangeForm
            onData={function (data: DataType) {
              // throw new Error("Function not implemented.");
            }}
            values={{
              end: 0,
              start: 0,
            }}
          />
        </MainCard>
        <MainCard >
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
                {payments && (
                  <PaymentInfoGenerator
                    perPage={payments.length}
                    page={0}
                    totalCount={payments.length}
                    subscriptions={payments.map((payment, i) => ({
                      order: i,
                      subscription: {
                        ...payment,
                        userId: payment.userId?._id || "",
                        planId: payment.planId?._id || "",
                        adminId: payment.adminId?._id || "",
                      },
                      admin: payment.adminId,
                      plan: payment.planId,
                      user: payment.userId,
                    }))}
                    headKeys={[
                      "order",
                      "user",
                      "plan",
                      "paid",
                      "link",
                      "remainingMoney",
                      "log",
                      "endAt",
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
