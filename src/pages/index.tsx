import { BigCard } from "@src/components/card";
import { GetStaticProps } from "next";
import Payments from "@serv/models/payments";
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
import Users from "@serv/models/users";
import Plans from "@serv/models/plans";
import { getPayments, getPaymentsProfit } from "@serv/routes/admin/payments";
import { MakeItSerializable } from "@src/utils";
import { useTranslation } from "next-i18next";
export interface Props {
  earnings: YearsAndMonthEarningsProps;
  payments: RecentPaymentsProps;
  users: UserTableProps["users"];
  sales: SalesOverViewProps;
}
export default function Page({ earnings, payments, users, sales }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <BigCard>
        <div>
          <p>
            {t("welcome")}
          </p>
          <div className="row">
            <SalesOverView {...sales} />
            <YearsAndMonthEarnings {...earnings} />
          </div>
          <div className="row">
            <RecentPayments {...payments} />
            <div className="col-lg-8 d-flex align-items-stretch">
              <div className="card w-100">
                <div className="p-4 card-body">
                  <h5 className="mb-4 card-title fw-semibold">Recent Users</h5>
                  <UsersTable
                    page={0}
                    setPage={() => {}}
                    totalUsers={users.length}
                    users={users}
                    headKeys={[
                      "createdAt",
                      "name",
                      "blocked",
                      "age/tall/weight",
                      "plan",
                      "order",
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </BigCard>
    </>
  );
}
export async function getLastUsers() {
  const results = await Users.find({}).hint({ createdAt: -1 }).limit(5);
  return await Promise.all(
    results.map<Promise<UserTableProps["users"][0]>>(async (doc, i) => {
      const payment = await Payments.findOne({ userId: doc._id }).hint({
        userId: 1,
        createdAt: -1,
      });
      if (!payment)
        return {
          order: i + 1,
          user: JSON.parse(JSON.stringify(doc)),
        };
      const plan = await Plans.findById(payment.planId);
      return {
        order: i + 1,
        user: JSON.parse(JSON.stringify(doc)),
        lastPlan: JSON.parse(JSON.stringify(plan)),
      };
    })
  );
}
function getDaysArray(start: Date, end: Date) {
  const arr = [];
  const dt = new Date(start);

  while (dt <= end) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }

  return arr;
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
      console.log(data);
      return {
        date: start,
        data: getDaysArray(start, endAt).map((day) => {
          const res = data.find(
            (val) =>
              val._id.day == day.getDate() &&
              val._id.month == day.getMonth() + 1
          );
          console.log(day, day.getDate(), day.getMonth());
          if (res) return res;
          return {
            _id: {
              day: day.getDate(),
              month: day.getMonth(),
              currency: "EGP",
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
export const getStaticProps: GetStaticProps<Props> = async (ctx,) => {
  await connect(EnvVars.mongo.url);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const yearsEarnings = await getPaymentsProfit({
    startAt: new Date(year - 3, 0, 1).getTime().toString(),
    year: true,
  });
  const monthEarnings = await getPaymentsProfit({
    startAt: new Date(year, currentDate.getMonth() - 1, 1).getTime().toString(),
    day: true,
  });
  const LastMonthEarnings = await getPaymentsProfit({
    startAt: new Date(year, currentDate.getMonth() - 2, 1).getTime().toString(),
    endAt: new Date(year, currentDate.getMonth() - 1, 1).getTime().toString(),
  });
  const lastMonths = await getLastMonthDays(6);
  const users = await getLastUsers();
  const lastTransactions = await getPayments({ limit: 5 });
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
    revalidate: 60 * 10,
  };
};
