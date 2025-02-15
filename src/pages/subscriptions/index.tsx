/* eslint-disable @typescript-eslint/no-non-null-assertion */
import "@locales/subscriptions";
import { BigCard, CardTitle, MainCard } from "@src/components/card";
import ErrorShower from "@src/components/common/error";
import Head from "next/head";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import requester from "@src/utils/axios";
import TriggerOnVisible from "@src/components/common/triggerOnVisble";
import TimeStartEndSelector, {
  DataType as TimeStartEndSelectorDataType,
} from "@src/components/pages/subscriptions/filter";
import { useState } from "react";
import { PaymentInfoGenerator } from "@src/components/pages/subscriptions/table";
import PrintUserPayments from "@src/components/pages/subscriptions/print";
import { useTranslation } from "react-i18next";
import { getDaysArray } from "@src/utils";
import { LineChart } from "@src/components/common/charts";

import { RedirectIfNotAdmin } from "@src/components/wrappers/redirect";
import PaymentsDataFilter, {
  DataType as PaymentsDataFilterDataType,
} from "@src/components/pages/subscriptions/filter/PaymentsData";

const perLoad = 20;
type Payment = DataBase.Populate.Model<
  DataBase.WithId<DataBase.Models.Subscriptions>,
  "userId" | "adminId" | "planId" | "trainerId"
>;
type FormData = PaymentsDataFilterDataType & TimeStartEndSelectorDataType;
export default function Page() {
  const curDate = new Date();
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
    queryKey: ["subscriptions", "infinity", filter],
    queryFn: async ({ pageParam = 0, signal }) => {
      const users = await requester.get<Routes.ResponseSuccess<Payment[]>>(
        `/api/admin/subscriptions`,
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
    getNextPageParam: (lastPage) => {
      if (lastPage.data.length > 0) return lastPage.page + 1;
      return undefined;
    },
  });
  const QueryProfit = useQuery({
    queryKey: ["subscriptions", "total", filter],
    queryFn: async ({ signal }) => {
      const users = await requester.get<
        Routes.ResponseSuccess<DataBase.Queries.Payments.Profit[]>
      >(`/api/admin/subscriptions/profit`, {
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
  const { t, i18n } = useTranslation("/subscriptions");
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
        <title>{t("title")}</title>
      </Head>
      <BigCard>
        <RedirectIfNotAdmin>
          <div className="tw-flex tw-justify-between">
            <CardTitle>{t("Payments")}</CardTitle>
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
            <TimeStartEndSelector
              values={filter}
              onData={(data) => setFilter((pre) => ({ ...pre, ...data }))}
            />
          </div>
          <MainCard>
            <div className="tw-flex tw-justify-between tw-gap-x-4">
              <div className="tw-flex tw-gap-3 tw-flex-wrap tw-max-w-xs tw-flex-1 tw-justify-between">
                <div>
                  <h5 className="card-title mb-9 fw-semibold">
                    {t("Earnings")}
                  </h5>
                  <h4 className="mb-3 fw-semibold rtl:tw-text-end" dir="ltr">
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
                    valueFormatter({ _id }: DataBase.Queries.Logs.LogsCount) {
                      const date = new Date(_id.year!, _id.month!, _id.day!);
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
            <div>
              <PaymentsDataFilter
                onData={(data) => setFilter((pre) => ({ ...pre, ...data }))}
              />
            </div>
          </MainCard>
          <MainCard >
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
        </RedirectIfNotAdmin>
      </BigCard>
    </div>
  );
}
