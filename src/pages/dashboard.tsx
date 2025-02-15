import { BigCard } from "@src/components/card";
import { GetServerSideProps } from "next";
import Subscriptions from "@serv/models/subscriptions";
import Head from "next/head";
import {
  YearsAndMonthEarnings,
  RecentPayments,
  YearsAndMonthEarningsProps,
  RecentPaymentsProps,
  SalesOverView,
  SalesOverViewProps,
} from "@src/components/pages/dashboard";
import EnvVars from "@serv/declarations/major/EnvVars";
import connect from "@serv/db/connect";
import UsersTable, {
  Props as UserTableProps,
} from "@src/components/pages/users/table";
import { getPaymentsProfit } from "@serv/routes/admin/payments";
import { getDaysArray, MakeItSerializable } from "@src/utils";
import { useTranslation } from "react-i18next";
import { RedirectIfNotAdmin } from "@src/components/wrappers/redirect";
import { getSubscriptions } from "@serv/routes/admin/subscriptions";
import { getUsers } from "@serv/routes/admin/users";

export interface Props {
  earnings: YearsAndMonthEarningsProps;
  payments: RecentPaymentsProps;
  users: UserTableProps["users"];
  sales: SalesOverViewProps;
}
export default function Page({ earnings, payments, users, sales }: Props) {
  const { t } = useTranslation("/dashboard");
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <RedirectIfNotAdmin>
        <BigCard>
          <div>
            <div className="row">
              <SalesOverView {...sales} />
              <YearsAndMonthEarnings {...earnings} />
            </div>
            <div className="row">
              <RecentPayments {...payments} />
              <div className="col-lg-8 d-flex align-items-stretch">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title fw-semibold">
                      {t("Recent Users")}
                    </h5>
                    <UsersTable
                      perPage={users.length}
                      page={0}
                      totalCount={users.length}
                      users={users}
                      headKeys={[
                        "createdAt",
                        "name",
                        "blocked",
                        "age/tall/weight",
                        "plan",
                        "order",
                        "admin",
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BigCard>
      </RedirectIfNotAdmin>
    </>
  );
}
async function getLastUsers() {
  const results = await getUsers({ limit: 5 });
  return await Promise.all(
    results.map<Promise<UserTableProps["users"][0]>>(async (doc, i) => {
      const payment = await Subscriptions.findOne({
        userId: doc._id,
        __t: "subscription",
      })
        .hint({
          userId: 1,
          createdAt: -1,
          __t: 1,
        })
        .populate("planId");
      if (!payment)
        return {
          order: i + 1,
          user: JSON.parse(JSON.stringify(doc)),
        };
      return {
        order: i + 1,
        user: MakeItSerializable(doc),
        admin: MakeItSerializable(doc.adminId),
        lastPlan: MakeItSerializable(payment.planId),
      } as unknown as any;
    })
  );
}

async function getLastMonthDays(last: number) {
  const currentDate = new Date();
  const LastMonthEarnings = await Promise.all(
    new Array(last).fill(0).map(async (_, i) => {
      const start = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        currentDate.getDate() - 8
      );
      const endAt = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        currentDate.getDate()
      );
      const data = await getPaymentsProfit({
        startAt: start.getTime().toString(),
        endAt: endAt.getTime().toString(),
        month: true,
        day: true,
        year: true,
      });
      return {
        date: start,
        data: getDaysArray(start, endAt).map((day) => {
          const res = data.find(
            (val) =>
              val._id.day == day.getDate() &&
              val._id.month == day.getMonth() + 1
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
        }),
      };
    })
  );
  return LastMonthEarnings;
}
async function getLastMonthProfit() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();

  const monthEarnings = await getPaymentsProfit({
    startAt: new Date(year, currentDate.getMonth() - 1, 1).getTime().toString(),
    day: true,
    month: true,
  });
  const data = getDaysArray(
    new Date(year, currentDate.getMonth() - 1, 1),
    currentDate
  ).map((day) => {
    const res = monthEarnings?.find(
      (val) =>
        val._id.day == day.getDate() && val._id.month == day.getMonth() + 1
    );
    if (res) return res;
    return {
      _id: {
        day: day.getDate(),
        month: day.getMonth() + 1
      },
      paymentCount: 0,
      profit: 0,
    };
  });

  return data;
}
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  await connect(EnvVars.mongo.url);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const yearsEarnings = await getPaymentsProfit({
    startAt: new Date(year - 3, 0, 1).getTime().toString(),
    year: true,
  });
  const LastMonthEarnings = await getPaymentsProfit({
    startAt: new Date(year, currentDate.getMonth() - 2, 1).getTime().toString(),
    endAt: new Date(year, currentDate.getMonth() - 1, 1).getTime().toString(),
  });
  const lastMonths = await getLastMonthDays(6);
  const users = await getLastUsers();
  const monthEarnings = await getLastMonthProfit();
  const lastTransactions = await getSubscriptions({ limit: 5 });
  ctx.res.setHeader(
    "Cache-Control",
    `public,  s-maxage=${60 * 60}, stale-while-revalidate=${60 * 60 * 2}`
  );
  return {
    props: {
      earnings: {
        yearsEarnings,
        monthEarnings,
        lastMonthEarning: LastMonthEarnings[0] || null,
      },
      payments: {
        payments: lastTransactions.map((val) =>
          JSON.parse(JSON.stringify(val))
        ),
      },
      sales: {
        months: MakeItSerializable(lastMonths),
      },
      users,
    },
  };
};
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/dashboard": {
        "Recent Transactions": string;
        "Recent Users": string;
        transactions: {
          receivePayment: "Payment received from {{name}} of {{price}}`}";
        };
      };
    }
  }
}
