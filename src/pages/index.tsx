import { BigCard, CardTitle, MainCard } from "@src/components/card";
import { useAuth } from "@src/components/UserProvider";
import { useFormateDate } from "@src/hooks";
import { formateDate, MakeItSerializable } from "@src/utils";
import classNames from "classnames";
import Head from "next/head";
import { useRouter } from "next/router";
import { ComponentProps, useEffect, useState } from "react";
import { StyledInput } from "@src/components/common/inputs/styles";
import { AttendPerson } from "@src/components/pages/logger/form";
import { useQuery } from "@tanstack/react-query";
import mongoose from "mongoose";
import connect from "@serv/db/connect";
import requester from "@src/utils/axios";
import { isString } from "@src/utils/types";
import ErrorShower from "@src/components/common/error";
import UserInfoForm from "@src/components/pages/logger/user";
import UserPaymentsTable from "@src/components/pages/logger/payments/table";
import { useTranslation } from "react-i18next";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CopyText } from "@src/components/common/copy";
import AddUserPayment from "@src/components/pages/users/addPayment";
import EnvVars from "@serv/declarations/major/EnvVars";
import { getAllPlans } from "@serv/routes/admin/plans";
import { GetServerSideProps } from "next";
import i18n from "@src/i18n";
interface Props {
  plans: DataBase.WithId<DataBase.Models.Plans>[];
}
export function Item({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={classNames(
        "tw-p-2 tw-px-5 tw-border tw-border-gray-200 tw-border-solid tw-bg-blue-800 tw-text-gray-100 tw-font-semibold tw-text-center",
        className
      )}
      {...props}
    />
  );
}
type PaymentType = DataBase.WithId<
  DataBase.Populate<
    DataBase.Models.Payments,
    "planId",
    DataBase.WithId<DataBase.Models.Plans>
  >
>;
const perPage = 7;
export default function Page({ plans }: Props) {
  const router = useRouter();
  const date = new Date();
  const { t } = useTranslation("/index");

  const month = useFormateDate({
    weekday: "long",
  });
  // const { userId } = router.query as { userId?: string };
  const [userId, setUserId] = useState<string | undefined>(
    router.query.userId as string
  );
  const userState = isString(userId) && mongoose.Types.ObjectId.isValid(userId);
  const [strInput, setStrInput] = useState("");
  const query = useQuery({
    queryKey: ["barcode", userId],
    queryFn: async () => {
      const req = await requester.get<
        Routes.ResponseSuccess<DataBase.WithId<DataBase.Models.User>>
      >(`/api/admin/users/${userId}`);
      const payments = await requester.get<
        Routes.ResponseSuccess<PaymentType[]>
      >(`/api/admin/users/${userId}/payments`);
      return {
        user: req.data.data,
        payments: payments.data.data,
      };
    },
    enabled: userState,
  });
  const [selectedPayment, setSelected] = useState<string>();
  const [page, setPage] = useState(0);
  useEffect(() => {
    setPage(0);
    setSelected(undefined);
  }, [userId]);
  useEffect(() => {
    if (!query.data) return;
    setSelected(query.data.payments[0]?._id);
    if (userState)
      router.push(
        "/",
        {
          query: { userId: userId },
        },
        { scroll: false }
      );
  }, [query.data]);
  useEffect(() => {
    const state = mongoose.Types.ObjectId.isValid(strInput);
    if (!state) return;
    setUserId(strInput);
    setStrInput("");
  }, [strInput]);
  const auth = useAuth()!;
  const currentPayment = query.data?.payments.find(
    (payment) => payment._id == selectedPayment
  );
  return (
    <div>
      <Head>
        <title>{t("title")}</title>
      </Head>
      <BigCard>
        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
          <div className="tw-grow tw-flex tw-flex-col tw-items-stretch">
            <div className="tw-grid tw-grid-cols-[auto,1fr] tw-gap-1 tw-self-start tw-w-full">
              <Item className="">{month(date)}</Item>
              <Item className="tw-w-full">{formateDate(date)}</Item>
              <Item>{t("admin.name")}</Item>
              <Item className="tw-w-full tw-flex-1">{auth.name}</Item>
            </div>
            <MainCard data-blocked={query.data?.user.blocked}>
              <div className="tw-flex tw-justify-between tw-mb-3">
                <CardTitle>{t("user.title")}</CardTitle>
                <div>
                  {query.data && (
                    <CopyText text={query.data?.user._id}>
                      ID:{query.data?.user._id}
                    </CopyText>
                  )}
                </div>
              </div>
              <UserInfoForm user={query.data?.user} />
            </MainCard>

            <MainCard containerClassName="tw-flex-1">
              <CardTitle>{t("payments.title")}</CardTitle>
              <UserPaymentsTable
                perPage={perPage}
                elems={
                  query.data?.payments
                    .slice(page * perPage, page * perPage + perPage)
                    .map((val, i) => ({
                      order: i + page * perPage,
                      payment: val,
                    })) || []
                }
                totalCount={query.data?.payments.length || 0}
                onSetPage={function (page: number): void {
                  setPage(page);
                }}
                onSelect={function (page): void {
                  setSelected(page.payment._id);
                }}
                selected={selectedPayment}
                page={page}
                headKeys={["endAt", "plan", "id", "remainingDays"]}
              />
            </MainCard>
          </div>
          <div className="tw-flex-1">
            <div className="card tw-mb-3">
              <div className="tw-py-4 card-body">
                <div className="tw-flex tw-justify-center">
                  <div className="tw-flex-1">
                    <StyledInput
                      onChange={(e) => {
                        setStrInput(e.currentTarget.value);
                      }}
                      value={strInput}
                      placeholder="Barcode"
                      className="placeholder:tw-text-gray-600 rtl:tw-rounded-l-none ltr:tw-rounded-r-none"
                    />
                    <ErrorShower error={query.error} />
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setUserId(undefined);
                        setStrInput("");
                      }}
                      className="tw-bg-red-500 hover:tw-bg-red-600 tw-text-white tw-border-none tw-px-3 tw-self-stretch tw-block tw-h-full ltr:tw-rounded-r-lg rtl:tw-rounded-l-lg"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <MainCard
              className="tw-min-h-[30rem]"
              data-blocked={
                currentPayment?.remaining ? currentPayment.remaining > 0 : false
              }
            >
              <AttendPerson
                payment={currentPayment}
                onUpdate={async function (data) {
                  if (!currentPayment) return;
                  await requester.post(
                    `/api/admin/payments/${currentPayment._id}`,
                    data
                  );
                  alert(t("messages.updated", { ns: "translation" }));
                  query.refetch();
                }}
                onIncrement={() => {
                  query.refetch();
                }}
              />
            </MainCard>
          </div>
        </div>
        <div>
          <MainCard>
            <CardTitle className="tw-mb-3">{t("addPayment.title")}</CardTitle>
            <AddUserPayment
              onData={async (data) => {
                if (!query.data) return;
                const req = await requester.post<
                  Routes.ResponseSuccess<
                    DataBase.WithId<DataBase.Models.Payments>
                  >
                >(`/api/admin/payments`, {
                  ...data,
                  userId: query.data.user._id,
                });
                setSelected(req.data.data._id);
                setPage(0);
                query.refetch();
                alert(t("messages.added", { ns: "translation" }));
              }}
              plans={plans}
            />
          </MainCard>
        </div>
      </BigCard>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  await connect(EnvVars.mongo.url);
  try {
    const plans = await getAllPlans();
    return {
      props: {
        plans: plans.map((plan) => {
          return {
            ...MakeItSerializable(plan),
            _id: plan._id.toString(),
          };
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
      "/index": {
        title: "Home";
        admin: {
          name: "Admin Name";
        };
        payments: {
          title: "Payments";
        };
        addPayment: {
          title: "Add payment";
        };
        user: {
          title: "Users Info";
        };
      };
    }
  }
}
i18n.addLoadUrl("/pages/index", "/index");
