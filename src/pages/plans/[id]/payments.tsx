import "@locales/plan/[id]/payments";
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
import { PaymentInfoGenerator } from "@src/components/pages/payments/table";
import PrintUserPayments from "@src/components/pages/payments/print";
import { useTranslation } from "react-i18next";
import { getDaysArray, MakeItSerializable } from "@src/utils";
import { LineChart } from "@src/components/common/charts";

import EnvVars from "@serv/declarations/major/EnvVars";
import { GetServerSideProps } from "next";
import connect from "@serv/db/connect";
import { getPlan } from "@serv/routes/admin/plans/[id]";
import PrintPlanPayments from "@src/components/pages/plans/payments/print";
import { RedirectIfNotAdmin } from "@src/components/wrappers/redirect";
const perLoad = 20;
type Payment = DataBase.AdminPopulate<
  DataBase.Populate<
    DataBase.Populate<
      DataBase.WithId<DataBase.Models.Payments>,
      "userId",
      DataBase.WithId<DataBase.Models.User>
    >,
    "planId",
    DataBase.WithId<DataBase.Models.Plans>
  >
>;
export default function Page({ doc }: Props) {
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
    queryKey: ["payments", "plans", doc._id, "infinity", filter],
    queryFn: async ({ pageParam = 0, signal }) => {
      const users = await requester.get<Routes.ResponseSuccess<Payment[]>>(
        `/api/admin/plans/${doc._id}/payments`,
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
  const QueryProfit = useQuery({
    queryKey: ["payments", "plans", doc._id, "total", filter],
    queryFn: async ({ signal }) => {
      const users = await requester.get<
        Routes.ResponseSuccess<DataBase.Queries.Payments.Profit[]>
      >(`/api/admin/plans/${doc._id}/payments/profit`, {
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
  const { t, i18n } = useTranslation("/plans/[id]/payments");
  const totalPrice =
    QueryProfit.data?.reduce((acc, val) => acc + val.profit, 0) || 0;
  const totalCount =
    QueryProfit.data?.reduce((acc, val) => acc + val.paymentCount, 0) || 0;
  const payments = QueryInfinity.data?.pages
    .map((page) => page.data)
    .reduce((acc, cur) => [...acc, ...cur], []);
  const data = getDaysArray(filter.startAt, filter.endAt).map((day) => {
    const res = QueryProfit.data?.find(
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
      profit: 0,
      paymentCount: 0,
    };
  });
  const diffTime = filter.endAt.getTime() - filter.startAt.getTime();
  const yearEnabled = diffTime > 1000 * 60 * 60 * 24 * 300;

  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
      <Head>
        <title>{t("title", { name: doc.name })}</title>
      </Head>
      <RedirectIfNotAdmin>
        <BigCard>
          <div className="tw-flex tw-justify-between">
            <CardTitle>{t("Plan Payments")}</CardTitle>
            <div>
              <PrintPlanPayments
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
                          {t("Earnings")}
                        </h5>
                        <h4
                          className="mb-3 fw-semibold rtl:tw-text-end"
                          dir="ltr"
                        >
                          {totalPrice} EGP
                        </h4>
                      </div>
                      <div>
                        <h5 className="card-title mb-9 fw-semibold">
                          {t("Total Count")}
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
                    loading={QueryProfit.isLoading}
                    height={300}
                    series={[
                      {
                        data: data.map((val) => val.profit) || [],
                        label: t("Earnings"),
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
                          (acc, { profit }) => (acc > profit ? acc : profit),
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
              {payments && (
                <PaymentInfoGenerator
                  page={0}
                  perPage={payments.length}
                  setPage={() => {}}
                  totalCount={payments.length}
                  payments={payments.map((payment, i) => ({
                    order: i,
                    payment: {
                      ...payment,
                      userId: payment.userId._id,
                      planId: payment.planId._id,
                      adminId: payment.adminId?._id,
                    },
                    plan: payment.planId,
                    user: payment.userId,
                    adminId: payment.adminId,
                  }))}
                  headKeys={[
                    "order",
                    "user",
                    "plan",
                    "paid",
                    "link",
                    "createdAt",
                    "log",
                    "endAt",
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
interface Props {
  doc: DataBase.WithId<DataBase.Models.Plans>;
}
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
