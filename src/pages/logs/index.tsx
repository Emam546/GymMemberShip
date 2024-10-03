import "@locales/logs";
import { BigCard, CardTitle, MainCard } from "@src/components/card";
import ErrorShower from "@src/components/common/error";
import Head from "next/head";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import requester from "@src/utils/axios";
import TriggerOnVisible from "@src/components/common/triggerOnVisble";
import TimeStartEndSelector, {
  DataType,
} from "@src/components/pages/payments/filter";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LogInfoGenerator } from "@src/components/pages/logs/table";
import PrintLogs from "@src/components/pages/logs/print";
import { LineChart } from "@src/components/common/charts";
import { getDaysArray } from "@src/utils";
import { RedirectIfNotAdmin } from "@src/components/wrappers/redirect";
const perLoad = 20;
type LogDoc = DataBase.Populate<
  DataBase.Populate<
    DataBase.Populate<
      DataBase.WithId<DataBase.Models.Logs>,
      "userId",
      DataBase.WithId<DataBase.Models.User>
    >,
    "planId",
    DataBase.WithId<DataBase.Models.Plans>
  >,
  "paymentId",
  DataBase.WithId<DataBase.Models.Payments>
>;
export default function Page() {
  const curDate = new Date();
  const [filter, setFilter] = useState<DataType>({
    startAt: new Date(
      curDate.getFullYear(),
      curDate.getMonth(),
      curDate.getDate() - 8
    ),
    endAt: curDate,
  });
  const diffTime = filter.endAt.getTime() - filter.startAt.getTime();
  const QueryInfinity = useInfiniteQuery({
    queryKey: ["logs", "infinity", filter],
    queryFn: async ({ pageParam = 0, signal }) => {
      const users = await requester.get<Routes.ResponseSuccess<LogDoc[]>>(
        `/api/admin/logs`,
        {
          params: {
            ...filter,
            skip: perLoad * pageParam,
            limit: perLoad,
            startAt: filter.startAt.getTime(),
            endAt: filter.endAt.getTime(),
          },
          signal,
        }
      );
      return { page: pageParam, data: users.data.data };
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length > 0) return lastPage.page + 1;
      return undefined;
    },
  });
  const yearEnabled = diffTime > 1000 * 60 * 60 * 24 * 300;
  const QueryCount = useQuery({
    queryKey: ["logs", "total", filter],
    queryFn: async ({ signal }) => {
      const users = await requester.get<
        Routes.ResponseSuccess<DataBase.Queries.Logs.LogsCount[]>
      >(`/api/admin/logs/logCount`, {
        params: {
          ...filter,
          day: true,
          year: true,
          month: true,
          startAt: filter.startAt.getTime(),
          endAt: filter.endAt.getTime(),
        },
        signal,
      });
      return users.data.data;
    },
  });
  const { t, i18n } = useTranslation("/logs");
  const totalCount =
    QueryCount.data?.reduce((acc, val) => acc + val.count, 0) || 0;
  const logs = QueryInfinity.data?.pages
    .map((page) => page.data)
    .reduce((acc, cur) => [...acc, ...cur], []);
  //   const enableChart = filter.endAt - filter.startAt;
  const data = getDaysArray(filter.startAt, filter.endAt).map((day) => {
    const res = QueryCount.data?.find(
      (val) =>
        val._id.day == day.getDate() &&
        val._id.month == day.getMonth() + 1 &&
        val._id.year == day.getFullYear()
    );
    if (res) return res;
    return {
      _id: {
        day: day.getDate(),
        month: day.getMonth() + 1,
        year: day.getFullYear(),
        currency: "EGP",
      },
      count: 0,
    };
  });
  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
      <Head>
        <title>{t("title")}</title>
      </Head>
      <RedirectIfNotAdmin>
        <BigCard>
          <div className="tw-flex tw-justify-between">
            <CardTitle>{t("Logs")}</CardTitle>
            <div>
              <PrintLogs
                query={{
                  ...filter,
                  startAt: filter.startAt.getTime(),
                  endAt: filter.endAt.getTime(),
                }}
              />
            </div>
          </div>
          <div className="tw-my-4">
            <TimeStartEndSelector values={filter} onData={setFilter} />
          </div>
          <div>
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="tw-flex tw-justify-between tw-gap-x-4">
                    <div className="tw-flex tw-gap-3 tw-flex-wrap tw-max-w-xs tw-flex-1 tw-justify-between">
                      <div>
                        <h5 className="card-title mb-9 fw-semibold">
                          {t("Total Count")}
                        </h5>
                        <h4 className="mb-3 fw-semibold">{totalCount}</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div dir="ltr">
                  <LineChart
                    loading={QueryCount.isLoading}
                    height={300}
                    series={[
                      {
                        data: data.map((val) => val.count) || [],
                        label: t("Logs"),
                        area: true,
                        type: "line",
                        color: "#49BEFF",
                        showMark: false,
                        stack: "total",
                      },
                    ]}
                    slotProps={{ legend: { hidden: true } }}
                    yAxis={[
                      {
                        min: 0,
                        max: data.reduce(
                          (acc, { count }) => (acc > count ? acc : count),
                          10
                        ),
                      },
                    ]}
                    xAxis={[
                      {
                        scaleType: "point",
                        data: data,
                        valueFormatter(
                          { _id }: DataBase.Queries.Logs.LogsCount,
                          context
                        ) {
                          const date = new Date(
                            _id.year!,
                            _id.month!,
                            _id.day!
                          );
                          return `${date.toLocaleDateString(i18n.language, {
                            day: "2-digit",
                            month: "short",
                            year: yearEnabled ? "numeric" : undefined,
                          })}`;
                        },
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
          <MainCard className="p-4 tw-mt-3">
            <ErrorShower
              loading={QueryInfinity.isLoading}
              error={QueryInfinity.error}
            />
            <div>
              {logs && (
                <LogInfoGenerator
                  page={0}
                  setPage={() => {}}
                  totalCount={logs.length}
                  logs={logs.map((payment, i) => ({
                    order: i,
                    log: {
                      ...payment,
                      userId: payment.userId._id,
                      planId: payment.planId._id,
                      paymentId: payment.paymentId._id,
                    },
                    plan: payment.planId,
                    user: payment.userId,
                  }))}
                  headKeys={[
                    "order",
                    "user",
                    "plan",
                    "paymentLink",
                    "createdAt",
                    "delete",
                    "admin",
                  ]}
                  onDelete={() => {}}
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
      </RedirectIfNotAdmin>
    </div>
  );
}
