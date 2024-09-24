import "@locales/payments";
import { BigCard, CardTitle, MainCard } from "@src/components/card";
import ErrorShower from "@src/components/common/error";
import Head from "next/head";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import requester from "@src/utils/axios";
import TriggerOnVisible from "@src/components/common/triggerOnVisble";
import PaymentsFilter, {
  DataType,
} from "@src/components/pages/payments/filter";
import { useState } from "react";
import { PaymentInfoGenerator } from "@src/components/pages/payments/table";
import PrintUserPayments from "@src/components/pages/payments/print";
import { MonthlyEarnings } from "@src/components/pages/dashboard/charts";
import { useTranslation } from "react-i18next";

const perLoad = 20;
type Payment = DataBase.Populate<
  DataBase.Populate<
    DataBase.WithId<DataBase.Models.Payments>,
    "userId",
    DataBase.WithId<DataBase.Models.User>
  >,
  "planId",
  DataBase.WithId<DataBase.Models.Plans>
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
  const QueryInfinity = useInfiniteQuery({
    queryKey: ["payments", "infinity", filter],
    queryFn: async ({ pageParam = 0, signal }) => {
      const users = await requester.get<Routes.ResponseSuccess<Payment[]>>(
        `/api/admin/payments`,
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
    queryKey: ["payments", "total", filter],
    queryFn: async ({ signal }) => {
      const users = await requester.get<
        Routes.ResponseSuccess<DataBase.Queries.Payments.Profit[]>
      >(`/api/admin/payments/profit`, {
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
  const { t } = useTranslation("/payments");
  const totalPrice =
    QueryProfit.data?.reduce((acc, val) => acc + val.profit, 0) || 0;
  const totalCount =
    QueryProfit.data?.reduce((acc, val) => acc + val.paymentCount, 0) || 0;
  const payments = QueryInfinity.data?.pages
    .map((page) => page.data)
    .reduce((acc, cur) => [...acc, ...cur], []);
  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
      <Head>
        <title>{t("title")}</title>
      </Head>
      <BigCard>
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
          <PaymentsFilter values={filter} onData={setFilter} />
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
                      <h4 className="mb-3 fw-semibold">${totalPrice}</h4>
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
              <MonthlyEarnings
                height={100}
                series={QueryProfit.data?.map((val) => val.profit) || []}
              />
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
                setPage={() => {}}
                totalCount={payments.length}
                payments={payments.map((payment, i) => ({
                  order: i,
                  payment: {
                    ...payment,
                    userId: payment.userId._id,
                    planId: payment.planId._id,
                  },
                  plan: payment.planId,
                  user: payment.userId,
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
    </div>
  );
}
