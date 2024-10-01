import "@locales/plan/[id]/logs";
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
import { LineChart } from "@mui/x-charts/LineChart";
import { getDaysArray, MakeItSerializable } from "@src/utils";
import EnvVars from "@serv/declarations/major/EnvVars";
import { getPlan } from "@serv/routes/admin/plans/[id]";
import connect from "@serv/db/connect";
import { GetServerSideProps, NextPage } from "next";
import PrintPlanLogs from "@src/components/pages/plans/logs/print";
import { RedirectIfNotAdmin } from "@src/components/wrappers/redirect";
const perLoad = 20;
interface Props {
  doc: DataBase.WithId<DataBase.Models.Plans>;
}
type LogDoc = DataBase.Populate<
  DataBase.Populate<
    DataBase.WithId<DataBase.Models.Logs>,
    "userId",
    DataBase.WithId<DataBase.Models.User>
  >,
  "paymentId",
  DataBase.WithId<DataBase.Models.Payments>
>;
const Page: NextPage<Props> = function Page({ doc }) {
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
    queryKey: ["logs", "plans", doc._id, "infinity", filter],
    queryFn: async ({ pageParam = 0, signal }) => {
      const users = await requester.get<Routes.ResponseSuccess<LogDoc[]>>(
        `/api/admin/plans/${doc._id}/logs`,
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
    queryKey: ["logs", "plans", doc._id, "total", filter],
    queryFn: async ({ signal }) => {
      const users = await requester.get<
        Routes.ResponseSuccess<DataBase.Queries.Logs.LogsCount[]>
      >(`/api/admin/plans/${doc._id}/logCount`, {
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
  const { t, i18n } = useTranslation("/plans/[id]/logs");
  const totalCount =
    QueryCount.data?.reduce((acc, val) => acc + val.count, 0) || 0;
  const logs = QueryInfinity.data?.pages
    .map((page) => page.data)
    .reduce((acc, cur) => [...acc, ...cur], []);
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
        <title>{t("title", { name: doc.name })}</title>
      </Head>
      <RedirectIfNotAdmin>
        <BigCard>
          <div className="tw-flex tw-justify-between">
            <CardTitle>{t("Plan Logs")}</CardTitle>
            <div>
              <PrintPlanLogs
                id={doc._id}
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
                        label: "Logs",
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
                      paymentId: payment.paymentId._id,
                    },
                    user: payment.userId,
                  }))}
                  headKeys={[
                    "order",
                    "user",
                    "paymentLink",
                    "createdAt",
                    "delete",
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
};
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  await connect(EnvVars.mongo.url);
  try {
    const plan = await getPlan(ctx.params!.id as string);
    return {
      props: {
        doc: MakeItSerializable({
          ...plan.toJSON(),
          _id: plan._id.toString(),
        }),
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
export default Page;
