import "@locales/users/[id]/logs";
import { BigCard, CardTitle, MainCard } from "@src/components/card";
import ErrorShower from "@src/components/common/error";
import Head from "next/head";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import requester from "@src/utils/axios";
import { useRouter } from "next/router";
import { LogInfoGenerator } from "@src/components/pages/logs/table";
import queryClient from "@src/queryClient";
import TriggerOnVisible from "@src/components/common/triggerOnVisble";
import { useTranslation } from "react-i18next";
import EnvVars from "@serv/declarations/major/EnvVars";
import { getUser } from "@serv/routes/admin/users/[id]";
import { getDaysArray, getMonthsArray, MakeItSerializable } from "@src/utils";
import connect from "@serv/db/connect";
import { GetServerSideProps } from "next";
import { getLogsCount } from "@serv/routes/admin/log";
import { LineChart } from "@src/components/common/charts";
import { useFormateDate } from "@src/hooks";
interface Props {
  doc: DataBase.WithId<DataBase.Models.User>;
  logs: DataBase.Queries.Logs.LogsCount[];
}
const perLoad = 20;
type LogDoc = DataBase.Populate<
  DataBase.Populate<
    DataBase.WithId<DataBase.Models.Logs>,
    "planId",
    DataBase.WithId<DataBase.Models.Plans>
  >,
  "paymentId",
  DataBase.WithId<DataBase.Models.Payments>
>;
type Page = {
  page: number;
  data: LogDoc[];
};
interface InfiniteQueryData {
  pages: Page[];
  pageParams: unknown[];
}

export default function Page({ doc, logs: logsCount }: Props) {
  const curDate = new Date();
  const startAt = new Date(curDate.getFullYear(), curDate.getMonth() - 8, 0);
  const router = useRouter();
  const getMonthName = useFormateDate({ month: "short" });
  const { t } = useTranslation("/users/[id]/logs");
  const { id } = router.query;
  const mutate = useMutation({
    mutationFn(id: string) {
      return requester.delete(`/api/admin/logs/${id}`);
    },
    onSuccess(_, logId) {
      queryClient.setQueryData<InfiniteQueryData>(
        ["logs", "users", id, "infinity"],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.filter((item) => item._id !== logId),
            })),
          };
        }
      );
    },
  });
  const QueryInfinity = useInfiniteQuery({
    queryKey: ["logs", "users", id, "infinity"],
    queryFn: async ({ pageParam = 0, signal }) => {
      const users = await requester.get<Routes.ResponseSuccess<LogDoc[]>>(
        `/api/admin/users/${id}/logs`,
        {
          params: {
            skip: perLoad * pageParam,
            limit: perLoad,
          },
          signal,
        }
      );
      return { page: pageParam, data: users.data.data };
    },
    enabled: typeof id == "string",
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length > 0) return lastPage.page + 1;
      return undefined;
    },
  });
  const logs =
    QueryInfinity.data?.pages
      .map((page) => page.data)
      .reduce((acc, cur) => [...acc, ...cur], []) || [];
  const data = getDaysArray(
    startAt,
    curDate
  ).map<DataBase.Queries.Logs.LogsCount>((day) => {
    const res = logsCount.find(
      (val) =>
        val._id.month == day.getMonth() + 1 &&
        val._id.year == day.getFullYear() &&
        val._id.day == day.getDate()
    );
    if (res) return res;
    return {
      _id: {
        month: day.getMonth() + 1,
        year: day.getFullYear(),
        day: day.getDate(),
      },
      count: 0,
    };
  });
  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
      <Head>
        <title>{t("title", { name: doc.name })}</title>
      </Head>
      <BigCard>
        <MainCard className="p-4 tw-mt-3">
          <ErrorShower
            loading={QueryInfinity.isLoading}
            error={QueryInfinity.error}
          />
          <CardTitle>{t("User Logs")}</CardTitle>
          <div dir="ltr">
            <LineChart
              height={300}
              series={[
                {
                  data: data.map((val) => val.count) || [],
                  label: t("User Logs"),
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
                  valueFormatter({ _id }: DataBase.Queries.Logs.LogsCount) {
                    const date = new Date();
                    date.setMonth((_id.month || 0) - 1);
                    return `${getMonthName(date)} ${_id.day}`;
                  },
                  tickInterval(value: DataBase.Queries.Logs.LogsCount) {
                    return value._id.day == 1;
                  },
                },
              ]}
            />
          </div>
          <div>
            <LogInfoGenerator
              page={0}
              perPage={logs.length}
              setPage={() => {}}
              totalCount={logs.length}
              logs={logs.map((log, i) => ({
                order: i,
                log: {
                  ...log,
                  planId: log.planId._id,
                  paymentId: log.paymentId._id,
                },
                plan: log.planId,
              }))}
              headKeys={[
                "order",
                "delete",
                "paymentLink",
                "plan",
                "createdAt",
                "admin",
              ]}
              onDelete={(doc) => mutate.mutateAsync(doc.log._id)}
            />
          </div>
          <TriggerOnVisible
            onVisible={async () => {
              if (
                !QueryInfinity.isFetching &&
                !QueryInfinity.isLoading &&
                QueryInfinity.hasNextPage
              )
                QueryInfinity.fetchNextPage();
            }}
          />
        </MainCard>
      </BigCard>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  await connect(EnvVars.mongo.url);
  const curDate = new Date();
  const startAt = new Date(curDate.getFullYear(), curDate.getMonth() - 8, 0);
  try {
    const user = await getUser(ctx.params!.id as string);
    const logsCount = await getLogsCount(
      {
        startAt: startAt.getTime().toString(),
        endAt: curDate.getTime().toString(),
        month: true,
        year: true,
        day: true,
      },
      {
        userId: user._id,
      },
      {
        userId: 1,
        createdAt: -1,
      }
    );

    return {
      props: {
        doc: MakeItSerializable({ ...user.toJSON(), _id: user._id.toString() }),
        logs: logsCount,
      },
    };
  } catch (err) {
    console.error("Error", err);
    return {
      notFound: true,
    };
  }
};
