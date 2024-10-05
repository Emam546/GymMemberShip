import "@src/i18n/locales/payments/[id]";
import { BigCard, CardTitle, MainCard } from "@src/components/card";
import Head from "next/head";
import { useState } from "react";
import requester from "@src/utils/axios";
import EnvVars from "@serv/declarations/major/EnvVars";
import { MakeItSerializable } from "@src/utils";
import connect from "@serv/db/connect";
import { GetServerSideProps } from "next";
import { getAllPlans } from "@serv/routes/admin/plans";
import { getPayment } from "@serv/routes/admin/payments/[id]";
import PaymentInfoForm from "@src/components/pages/payments/info";
import DeletePaymentForm from "@src/components/pages/payments/info/deleteForm";
import LogsPaymentInfo from "@src/components/pages/payments/logs";
import { useTranslation } from "react-i18next";

interface Props {
  doc: DataBase.WithId<
    DataBase.Populate.Model<
      DataBase.WithId<DataBase.Models.Payments>,
      "userId" | "planId" | "adminId"
    >
  >;
  plans: DataBase.WithId<DataBase.Models.Plans>[];
}
export default function Page({ doc: initData, plans }: Props) {
  const [doc, setDoc] = useState(initData);
  const { t } = useTranslation("/payments/[id]");

  return (
    <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
      <Head>
        <title>
          {t("title", {
            val: doc.userId?.name,
          })}
        </title>
      </Head>
      <BigCard>
        <CardTitle>{t("Update Payment Data")}</CardTitle>
        <MainCard>
          <PaymentInfoForm
            payment={{
              ...doc,
              planId: doc.planId?._id || "",
              userId: doc.userId?._id || "",
              adminId: doc.adminId?._id || "",
            }}
            plans={plans}
            user={doc.userId}
            onData={async (data) => {
              await requester.post(`/api/admin/payments/${doc._id}`, data);
              setDoc({ ...doc, ...data });
              alert(t("messages.updated", { ns: "translation" }));
            }}
          />
        </MainCard>
        <DeletePaymentForm
          payment={{
            ...doc,
            planId: doc.planId?._id || "",
            userId: doc.userId?._id || "",
            adminId: doc.adminId?._id || "",
          }}
        />
        <MainCard>
          <CardTitle>{t("User Logs")}</CardTitle>
          <div>
            <LogsPaymentInfo id={doc._id} />
          </div>
        </MainCard>
      </BigCard>
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
    const payment = await getPayment(ctx.params.id as string);
    const plans = await getAllPlans();
    return {
      props: {
        doc: MakeItSerializable({
          ...payment.toJSON(),
          _id: payment._id.toString(),
        }) as unknown as Props["doc"],
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
