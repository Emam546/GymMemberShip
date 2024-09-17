import { BigCard } from "@src/components/card";
import { GetServerSideProps } from "next";
import Payments from "@serv/models/payments";
import Head from "next/head";
import {
  YearsAndMonthEarnings,
  RecentPayments,
  YearsAndMonthEarningsProps,
  RecentPaymentsProps,
} from "@src/components/common/dashboard";
import mongoose from "mongoose";
import EnvVars from "@serv/declarations/major/EnvVars";
import connect from "@serv/db/connect";
import UsersTable, {
  Props as UserTabelProps,
} from "@src/components/pages/users/table";
import Users from "@serv/models/user";
import Plans from "@serv/models/plans";
export interface Props {
  earnings: YearsAndMonthEarningsProps;
  payments: RecentPaymentsProps;
  users: UserTabelProps["users"];
}
export default function Page({ earnings, payments, users }: Props) {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <BigCard>
        <div>
          {/*  Row 1 */}
          <div className="row">
            <div className="col-lg-8 d-flex align-items-strech">
              <div className="card w-100">
                <div className="card-body">
                  <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
                    <div className="mb-3 mb-sm-0">
                      <h5 className="card-title fw-semibold">Sales Overview</h5>
                    </div>
                    <div>
                      <select className="form-select">
                        <option value={1}>March 2023</option>
                        <option value={2}>April 2023</option>
                        <option value={3}>May 2023</option>
                        <option value={4}>June 2023</option>
                      </select>
                    </div>
                  </div>
                  <div id="chart" />
                </div>
              </div>
            </div>
            <YearsAndMonthEarnings {...earnings} />
          </div>
          <div className="row">
            <RecentPayments {...payments} />
            <div className="col-lg-8 d-flex align-items-stretch">
              <div className="card w-100">
                <div className="p-4 card-body">
                  <h5 className="mb-4 card-title fw-semibold">
                    Recent Students
                  </h5>
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
  console.log(mongoose.connection.readyState);
  const results = await Users.find({}).hint({ createdAt: -1 }).limit(5);

  return await Promise.all(
    results.map<Promise<UserTabelProps["users"][0]>>(async (doc, i) => {
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
      console.log(plan);
      return {
        order: i + 1,
        user: JSON.parse(JSON.stringify(doc)),
        lastPlan: JSON.parse(JSON.stringify(plan)),
      };
    })
  );
}
export async function getPaymentsTotal(startData: Date): Promise<number> {
  console.log(mongoose.connection.readyState);
  const results = await Payments.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startData,
        },
      },
    },
    {
      $group: { _id: "$paid.type", totalPrice: { $sum: "$paid.num" } },
    },
  ])
    .hint({ createdAt: -1 })
    .sort({ createdAT: -1 })
    .limit(5);
  if (results.length > 0) {
    return results[0].totalPrice;
  } else {
    return 0; // If no documents, return 0
  }
}
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  console.log(EnvVars.mongo.url);
  await connect(EnvVars.mongo.url);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const yearsEarnings = await getPaymentsTotal(new Date(year - 1, 0, 1));
  const monthEarnings = await getPaymentsTotal(
    new Date(year, currentDate.getMonth() - 1, 1)
  );
  const users = await getLastUsers();
  const lastTransactions = await Payments.find({})
    .sort({ createdAt: -1 })
    .hint({ createdAt: -1 })
    .limit(5)
    .populate("userId");
  return {
    props: {
      earnings: { yearsEarnings, monthEarnings },
      payments: {
        payments: lastTransactions.map((val) =>
          JSON.parse(JSON.stringify(val))
        ) as unknown as RecentPaymentsProps["payments"],
      },
      users,
    },
  };
};
