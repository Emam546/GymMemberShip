import "@locales/users";
import { BigCard, CardTitle, MainCard } from "@src/components/card";
import ErrorShower from "@src/components/common/error";
import Head from "next/head";
import { useInfiniteQuery } from "@tanstack/react-query";
import requester from "@src/utils/axios";
import TriggerOnVisible from "@src/components/common/triggerOnVisble";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import TimeStartEndSelector, {
  DataType as TimeStartEndSelectorDataType,
} from "@src/components/pages/payments/filter";
import { PaymentInfoGenerator } from "@src/components/pages/payments/table";
import PrintPaymentsQuery from "@src/components/pages/users/queryPayment/print";
import FilterUsersData, {
  DataType as FilterUsersDataType,
} from "@src/components/pages/users/filter/filterUsersData";
import MessageDataForm from "@src/components/pages/whatsapp";
import { isValidPhoneNumber } from "react-phone-number-input";
import { hasOwnProperty } from "@src/utils";

type FormData = TimeStartEndSelectorDataType & FilterUsersDataType;
const perLoad = 20;
export default function Page() {
  const curDate = new Date();
  const { t } = useTranslation("/users");
  const [filter, setFilter] = useState<FormData>({
    startAt: new Date(
      curDate.getFullYear(),
      curDate.getMonth(),
      curDate.getDate() - 8
    ),
    endAt: curDate,
  });
  const QueryInfinity = useInfiniteQuery({
    queryKey: ["payments", "query", "infinity", filter],
    queryFn: async ({ pageParam = 0, signal }) => {
      const users = await requester.get<
        Routes.ResponseSuccess<
          DataBase.Populate.Model<
            DataBase.WithId<DataBase.Models.Payments>,
            "adminId" | "userId" | "planId"
          >[]
        >
      >(`/api/admin/payments/query`, {
        params: {
          skip: perLoad * pageParam,
          limit: perLoad,
          ...filter,
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
  const payments = QueryInfinity.data?.pages
    .map((page) => page.data)
    .reduce((acc, cur) => [...acc, ...cur], []);
  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
      <Head>
        <title>{"Whatsapp"}</title>
      </Head>
      <BigCard className="tw-min-h-screen">
        <div className="tw-flex tw-justify-between">
          <CardTitle>{t("Users")}</CardTitle>
          <div>
            <PrintPaymentsQuery
              query={{
                ...filter,
              }}
            />
          </div>
        </div>
        <MainCard className="tw-my-4">
          <TimeStartEndSelector
            values={filter}
            onData={(data) => setFilter((pre) => ({ ...pre, ...data }))}
          />
          <div className="tw-mt-5">
            <FilterUsersData
              onData={(data) => setFilter((pre) => ({ ...pre, ...data }))}
            />
          </div>
        </MainCard>
        <MainCard>
          <CardTitle>Whatsapp</CardTitle>
          <MessageDataForm
            onData={async function (dataMessages) {
              const users = await requester.get<
                Routes.ResponseSuccess<
                  DataBase.Populate.Model<
                    DataBase.WithId<DataBase.Models.Payments>,
                    "adminId" | "userId" | "planId"
                  >[]
                >
              >(`/api/admin/payments/query`, {
                params: {
                  ...filter,
                },
              });

              await Promise.all(
                users.data.data.map(async (val) => {
                  const formData = new FormData();
                  const phone = val.userId?.phone;
                  if (!phone || !isValidPhoneNumber(phone)) return;
                  const num = phone.startsWith("+") ? phone.slice(1) : phone;
                  const data = {
                    number: num,
                    messages: dataMessages.messages.map((data, i) => {
                      if (hasOwnProperty(data, "message")) {
                        return {
                          message: data.message,
                        };
                      }
                      formData.append(i.toString(), data.file);
                      return {
                        file: i,
                      };
                    }),
                  };
                  formData.append("data", JSON.stringify(data));
                  try {
                    await requester.post("/api/admin/whatsapp", formData, {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    });
                  } catch (err) {
                    console.error(val.userId?.name);
                    console.error(err);
                  }
                })
              );
              alert(t("messages.whatsapp.sended", { ns: "translation" }));
            }}
            buttonName={t("buttons.send", { ns: "translation" })}
          />
        </MainCard>
        <MainCard className="p-4 tw-mt-3">
          <ErrorShower
            loading={QueryInfinity.isLoading}
            error={QueryInfinity.error}
          />
          <CardTitle>{t("Users")}</CardTitle>
          <div>
            <MainCard className="p-4 tw-mt-3">
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
                    payments={payments.map((payment, i) => ({
                      order: i,
                      payment: {
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
