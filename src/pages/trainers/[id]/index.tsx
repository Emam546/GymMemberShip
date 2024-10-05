/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BigCard, CardTitle, MainCard } from "@src/components/card";
import Head from "next/head";
import requester from "@src/utils/axios";
import EnvVars from "@serv/declarations/major/EnvVars";
import { getDaysArray, MakeItSerializable } from "@src/utils";
import connect from "@serv/db/connect";
import { GetServerSideProps } from "next";
import { useTranslation } from "react-i18next";
import { RedirectIfNotAdmin } from "@src/components/wrappers/redirect";
import { getTrainer } from "@serv/routes/admin/trainers/[id]";
import TrainerInfoForm from "@src/components/pages/trainers/form";
import i18n from "@src/i18n";
import { LineChart } from "@src/components/common/charts";
import ErrorShower from "@src/components/common/error";
import TriggerOnVisible from "@src/components/common/triggerOnVisble";
import TimeStartEndSelector, {
  DataType,
} from "@src/components/pages/payments/filter";
import PrintUserPayments from "@src/components/pages/payments/print";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LogInfoGenerator } from "@src/components/pages/logs/table";
interface Props {
  doc: DataBase.WithId<DataBase.Models.Trainers>;
}

const perLoad = 20;
export default function Page({ doc }: Props) {
  const { t, i18n } = useTranslation("/trainers/[id]");
  const curDate = new Date();
  const [filter, setFilter] = useState<DataType>({
    startAt: new Date(
      curDate.getFullYear(),
      curDate.getMonth(),
      curDate.getDate() - 8
    ),
    endAt: curDate,
  });
  const QueryInfinity = useInfiniteQuery({
    queryKey: ["logs", "infinity", filter],
    queryFn: async ({ pageParam = 0, signal }) => {
      const users = await requester.get<
        Routes.ResponseSuccess<
          DataBase.Populate.Model<
            DataBase.WithId<DataBase.Models.Logs>,
            "adminId" | "planId" | "userId"
          >[]
        >
      >(`/api/admin/trainers/${doc._id}/logs`, {
        params: {
          ...filter,
          skip: perLoad * pageParam,
          limit: perLoad,
          startAt: filter.startAt.getTime(),
          endAt: filter.endAt.getTime(),
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
  const QueryCount = useQuery({
    queryKey: ["logs", "trainer", doc._id, "count", filter],
    queryFn: async ({ signal }) => {
      const users = await requester.get<
        Routes.ResponseSuccess<DataBase.Queries.Logs.LogsCount[]>
      >(`/api/admin/trainers/${doc._id}/logs/count`, {
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
  const totalCount =
    QueryCount.data?.reduce((acc, val) => acc + val.count, 0) || 0;
  const payments = QueryInfinity.data?.pages
    .map((page) => page.data)
    .reduce((acc, cur) => [...acc, ...cur], []);
  const data: DataBase.Queries.Logs.LogsCount[] = getDaysArray(
    filter.startAt,
    filter.endAt
  ).map((day) => {
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
      },
      count: 0,
    };
  });
  const diffTime = filter.endAt.getTime() - filter.startAt.getTime();
  const yearEnabled = diffTime > 1000 * 60 * 60 * 24 * 300;
  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
      <Head>
        <title>{doc.name}</title>
      </Head>
      <RedirectIfNotAdmin>
        <BigCard>
          <CardTitle>{t("update.title")}</CardTitle>
          <MainCard>
            <TrainerInfoForm
              defaultData={{
                name: doc.name,
                email: doc.email,
                phone: doc.phone,
              }}
              onData={async (data) => {
                await requester.post(`/api/admin/trainers/${doc._id}`, data);
                alert(t("messages.updated", { ns: "translation" }));
              }}
              buttonName={t("buttons.update", { ns: "translation" })}
            />
          </MainCard>
          <MainCard>
            <div className="tw-flex tw-justify-between">
              <CardTitle>{t("logs.title")}</CardTitle>
              <div>
                <PrintUserPayments
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
                            {t("count.title")}
                          </h5>
                          <h4 className="mb-3 fw-semibold">{totalCount}</h4>
                        </div>
                      </div>
                      <div>
                        <div className="d-flex justify-content-end">
                          <div className="p-6 text-white bg-secondary rounded-circle d-flex align-items-center justify-content-center">
                            <i className="ti ti-currency-dollar fs-6" />
                          </div>
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
                          label: t("chart.label"),
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
                          valueFormatter({
                            _id,
                          }: DataBase.Queries.Logs.LogsCount) {
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
                {payments && (
                  <LogInfoGenerator
                    perPage={payments.length}
                    page={0}
                    totalCount={payments.length}
                    logs={payments.map((payment, i) => ({
                      order: i,
                      log: {
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
                      "admin",
                      "createdAt",
                      "delete",
                      "paymentLink",
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
          </MainCard>
        </BigCard>
      </RedirectIfNotAdmin>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  await connect(EnvVars.mongo.url);
  try {
    if (!ctx.params)
      return {
        notFound: true,
      };
    const plan = await getTrainer(ctx.params.id as string);
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

declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/trainers/[id]": {
        "update.title": "Update User Data";
        "logs.title": "Logs";
        "chart.label": "User Logs";
        "count.title": "Total Count";
      };
    }
  }
}
i18n.addLoadUrl("/pages/trainers/[id]", "/trainers/[id]");
